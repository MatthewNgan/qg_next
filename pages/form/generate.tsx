import Head from 'next/head'
import Link from 'next/link';
import React from 'react';
import Header from '../template/header';
import DateSelect from '../../utils/DateSelect';

interface QuestionChoice {
  question: string;
  answer: string;
  point: number;
}

interface Feed {
  title: string;
  link: string;
  content: string;
}

export default function GenerateForm() {

  const [examDate, setExamDate] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth()+1,
    day: new Date().getDate(),
  });
  const [text, setText] = React.useState('');
  const [teacherName, setTeacherName] = React.useState('');
  const [paperName, setPaperName] = React.useState('');
  const [paperLink, setPaperLink] = React.useState('');
  const [paperId, setPaperId] = React.useState('');
  const [token, setToken] = React.useState<string>(null);
  const [rssFeed, setRssFeed] = React.useState<Feed[]>([]);
  const [rssLoaded, setRssLoaded] = React.useState(false);
  const [rssError, setRssError] = React.useState(null);

  const [questionChoices, setQuestionChoices] = React.useState<QuestionChoice[]>([]);
  const [selectedQuestions, setSelectedQuestions] = React.useState<QuestionChoice[]>([]);
  const generateButton = React.useRef<HTMLButtonElement>();
  const generateFormButton = React.useRef<HTMLButtonElement>();

  const generateQuestions = async (text: string) => {
    if (generateButton.current) {
      generateButton.current.disabled = true;
      generateButton.current.innerText = 'Generating...';
    }
    fetch(`${process.env.COMPREHELP_SERVER}/qg`, {
      method: 'POST',
      body: JSON.stringify({
        text: text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async r => {
      if (generateButton.current) {
        generateButton.current.disabled = false;
        generateButton.current.innerText = 'Generate Questions';
      }
      if (r.status !== 200) throw await r.text();
      return r.json();
    }).then(res => {
      console.log(res);
      let questionChoices = [];
      for (let q of res.outputs) {
        q.point = 0;
        questionChoices.push(q);
      }
      setQuestionChoices(questionChoices);
      setSelectedQuestions([]);
    }).catch(e => {
      console.log(e);
    });
  };

  const generateForm = async () => {
    if (generateFormButton.current) {
      generateFormButton.current.disabled = true;
      generateFormButton.current.innerText = 'Generating...';
    }
    let date = `${examDate.year}/${examDate.month}/${examDate.day}`
    let by = `${teacherName !== '' ? teacherName : 'unknown'}`
    let docTitle = `${date}_${by}_${paperName !== '' ? paperName : 'untitled'}`;
    let title = `${paperName !== '' ? paperName : 'untitled'}`;
    let body = {
      docTitle: docTitle,
      text: text,
      title: title,
      date: date,
      by: by,
      questions: []
    };
    for (const [index, question] of Object.entries(selectedQuestions)) {
      body.questions.push({
        title: question.question,
        point: question.point,
        ans: [{ value: question.answer }],
        para: false,
        idx: parseInt(index)
      })
    }
    console.log(body);
    fetch(`${process.env.BACKEND_SERVER}/generate`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }).then(async r => {
      if (r.status !== 200) throw await r.text();
      return await r.json();
    }).then(res => {
      setPaperLink(res.link);
      setPaperId(res.id);
      if (generateFormButton.current) {
        generateFormButton.current.disabled = false;
        generateFormButton.current.innerText = 'Generate Google Form';
      }
    }).catch(e => console.log(e));
  }

  const getRss = () => {
    fetch(
      `${process.env.BACKEND_SERVER}/rss?url=http://feeds.bbci.co.uk/news/rss.xml&limit=3&detail=true`
    ).then(async r => {
      if (r.status !== 200) throw await r.text();
      return await r.json();
    }).then(feed => {
      setRssLoaded(true);
      setRssFeed(feed);
    }).catch(error => {
      setRssLoaded(true);
      setRssError(error);
      console.log(error);
    });
  }

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setToken(localStorage.getItem('token'));
    }
    getRss();
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='py-20 px-6 flex-grow'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 px-6'>
            <div className='flex flex-col gap-6'>
              <div className='border-4 border-neutral-900 rounded-lg'>
                <h2 className='text-2xl font-bold w-full text-center py-4 border-neutral-900 border-b-4'>Generate Questions</h2>
                <div className='mx-4 py-4 flex flex-col items-center gap-4 relative'>
                  <div className='flex flex-col w-full h-96 border-4 border-neutral-900 rounded-lg overflow-hidden'>
                    <textarea className={`flex-grow p-4 resize-none border-0${ text ? '' : ` border-b-4`} border-neutral-900 focus:border-neutral-900 focus:ring-0 w-full`} placeholder='Paste your article here' onChange={(e) => setText(e.target.value)} value={text}>
                    </textarea>
                    {
                      !text && <div className='p-4 flex flex-col gap-2'>
                        <div>or find example here (sourced from BBC RSS Feed):</div>
                        <div className='flex flex-row flex-wrap gap-2'>
                          {
                            rssLoaded ? (
                              rssFeed[0] ?
                                rssFeed.map((feed) => {
                                console.log(feed);
                                return (
                                  <div className='p-3 text-sm border rounded-lg overflow-hidden whitespace-nowrap text-ellipsis hover:underline cursor-pointer leading-none' onClick={() => {
                                    setText(feed.content);
                                  }}>
                                    <span className='font-bold'>BBC</span> {feed.title}
                                  </div>
                                )
                              }) : <div>An error occured: {rssError.toString()}</div>
                            ) : <div>Loading...</div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                  <button ref={generateButton} className='px-6 py-4 leading-none border-4 border-neutral-900 bg-blue-300 rounded-full font-bold text-2xl disabled:bg-neutral-400' onClick={(e) => {
                    generateQuestions(text);
                  }}>Generate Questions</button>
                </div>
                {
                  questionChoices.length > 0 &&
                  <div className='flex flex-col rounded-lg'>
                    <div className='px-6 flex flex-col'>
                      {
                        questionChoices.length > 0 &&
                        <button className='ml-auto text-xl rounded-lg font-bold hover:underline' onClick={() => {
                          setSelectedQuestions(questionChoices);
                          setQuestionChoices([]);
                        }}>Select All</button>
                      }
                      {
                        questionChoices.map((choice, index) =>
                          <div key={index} className={`py-6 px-2${index < questionChoices.length - 1 ? ' border-b-2' : ''}`}>
                            <div className='flex flex-row justify-between items-center mb-4'>
                              <h3 className='text-2xl'>Question {index + 1}</h3>
                              <input type='checkbox' className='p-3 rounded-md text-neutral-900 focus:ring-0' onChange={e => {
                                if (e.target.checked) {
                                  setSelectedQuestions([
                                    ...selectedQuestions,
                                    choice
                                  ]);
                                  setQuestionChoices([
                                    ...questionChoices.slice(0, index),
                                    ...questionChoices.slice(index + 1)
                                  ]);
                                  e.target.checked = false;
                                }
                              }} />
                            </div>
                            <div>
                              <div>{choice.question}</div>
                              <div className='flex flex-row gap-2 items-center mt-2'>
                                <div>Answer:</div>
                                <div className='font-bold overflow-hidden text-ellipsis whitespace-nowrap'>{choice.answer}</div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col border-neutral-900 border-4 rounded-lg'>
                <h2 className='text-2xl font-bold w-full text-center py-4 border-neutral-900 border-b-4 relative flex items-center justify-center z-10'>
                  Selected Questions
                  {
                    paperLink !== '' &&
                    <Link href={paperLink}>
                      <a className='absolute right-4 text-xl hover:underline px-4 py-2 leading-none border-2 border-neutral-900 bg-red-300 rounded-full disabled:bg-neutral-400 z-10'>
                        Link
                      </a>
                    </Link>
                  }
                </h2>
                <div className='flex flex-col mx-6 py-6 gap-2 border-b-2'>
                  <input name='paper_name' type='text' placeholder='Name of exam paper' className='p-3 border rounded-md' onChange={(e) => setPaperName(e.target.value)} />
                  <input name='teacher_name' type='text' placeholder='Name of teacher' className='p-3 border rounded-md' onChange={(e) => setTeacherName(e.target.value)} />
                  <div>
                    <div className='px-1 mb-2'>Expected exam date</div>
                    <DateSelect year={examDate.year} month={examDate.month} day={examDate.day} setExamDate={setExamDate} />
                  </div>
                  <div>
                    {/* <div className='px-1 mb-2'>Exam grade</div>
                  <select className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
                    <option disabled selected>grade</option>
                  </select> */}
                  </div>
                </div>
                {
                  selectedQuestions.map((choice, index) =>
                    <div key={index} className='px-6'>
                      <div className='px-2 py-6 border-b-2'>
                        <div className='flex flex-row justify-between items-center mb-4'>
                          <h3 className='text-2xl'>Question {index + 1}</h3>
                          <input type='checkbox' className='p-3 rounded-md text-neutral-900 focus:ring-0' checked onChange={e => {
                            if (!e.target.checked) {
                              setQuestionChoices([
                                ...questionChoices,
                                choice
                              ]);
                              setSelectedQuestions([
                                ...selectedQuestions.slice(0, index),
                                ...selectedQuestions.slice(index + 1)
                              ])
                            }
                          }} />
                        </div>
                        <div>
                          <input type='text' className='w-full rounded-md' value={choice.question} onChange={e => {
                            setSelectedQuestions([
                              ...selectedQuestions.slice(0, index),
                              {
                                question: e.target.value,
                                answer: choice.answer,
                                point: choice.point
                              },
                              ...selectedQuestions.slice(index + 1)
                            ]);
                          }} />
                          <div className='pl-2 flex flex-row gap-2 items-center justify-start mt-2'>
                            <div>Answer:</div>
                            <input type='text' className='flex-grow font-bold w-1/2 rounded-md' value={choice.answer} onChange={e => {
                              setSelectedQuestions([
                                ...selectedQuestions.slice(0, index),
                                {
                                  question: choice.question,
                                  answer: e.target.value,
                                  point: choice.point
                                },
                                ...selectedQuestions.slice(index + 1)
                              ]);
                            }} />
                            <div className='ml-4'>
                              Points:
                              <input type='number' className='w-12 ml-2 border-0 border-b-2 border-neutral-400 h-8 p-0 focus:ring-0 focus:border-neutral-900 text-center' value={choice.point} onChange={e => {
                                setSelectedQuestions([
                                  ...selectedQuestions.slice(0, index),
                                  {
                                    question: choice.question,
                                    answer: choice.answer,
                                    point: parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0
                                  },
                                  ...selectedQuestions.slice(index + 1)
                                ]);
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                <div className='px-6 py-4'>
                  <button className='text-xl text-neutral-600' onClick={(e) => {
                    setSelectedQuestions([
                      ...selectedQuestions,
                      {
                        question: '',
                        answer: '',
                        point: 0
                      }
                    ])
                  }}>+ Add question</button>
                </div>
              </div>
              {
                selectedQuestions.length > 0 &&
                <>
                  <div className='flex flex-col items-center'>
                    {
                      paperLink === '' &&
                      <button ref={generateFormButton} className='px-6 py-4 leading-none border-4 border-neutral-900 bg-purple-300 rounded-full font-bold text-2xl disabled:bg-neutral-400' onClick={(e) => { generateForm() }}>
                        Generate Google Form
                      </button>
                    }
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>

      <footer>
      </footer>
    </div>
  )
}
