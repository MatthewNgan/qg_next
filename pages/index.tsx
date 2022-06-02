import Head from 'next/head'
import Link from 'next/link';
import React from 'react';

function range(start: number, stop: number, step: number = 1) {
  if (typeof stop == 'undefined') {
    stop = start;
    start = 0;
  }
  if (typeof step == 'undefined') {
    step = 1;
  }
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }
  var result: string[] = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i < 10 ? `0${i}` : i.toString());
  }

  return result;
};

function DateSelect(props: { day: number; month: number; year: number, setExamDate: Function }) {

  const days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const { day, month, year, setExamDate } = props;

  return (
    <div className='flex flex-row gap-4'>
      <select name='exam_day' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
        {
          range(day, days_in_month[month] + 1).map(d => <option key={`day_${d}`} value={d}>
            {d}
          </option>)
        }
      </select>
      <select name='exam_month' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
        {
          range(month + 1, 13).map(m => <option key={`month_${m}`} value={m}>
            {m}
          </option>)
        }
      </select>
      <select name='exam_year' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
        {
          range(year, year + 4).map(y => <option key={`year_${y}`} value={y}>
            {y}
          </option>)
        }
      </select>
    </div>
  )
}

interface QuestionChoice {
  question: string;
  answer: string;
  point: number;
}

export default function Home() {

  const [examDate, setExamDate] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  });
  const [text, setText] = React.useState('');
  const [teacherName, setTeacherName] = React.useState('');
  const [paperName, setPaperName] = React.useState('');
  const [paperLink, setPaperLink] = React.useState('');
  const [paperId, setPaperId] = React.useState('');

  const [questionChoices, setQuestionChoices] = React.useState<QuestionChoice[]>([]);
  const [selectedQuestions, setSelectedQuestions] = React.useState<QuestionChoice[]>([]);
  const generateButton = React.useRef<HTMLButtonElement>();
  const generateFormButton = React.useRef<HTMLButtonElement>();

  const generateQuestions = async (text: string) => {
    if (generateButton.current) {
      generateButton.current.disabled = true;
      generateButton.current.innerText = 'Generating...';
    }
    const res = await fetch(`/api/fetchQuestion`, {
      method: 'POST',
      body: JSON.stringify({
        text: text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (r) => await r.json());
    console.log(res);
    let questionChoices = [];
    for (let q of res.outputs) {
      q.point = 0;
      questionChoices.push(q);
    }
    setQuestionChoices(questionChoices);
    setSelectedQuestions([]);
    if (generateButton.current) {
      generateButton.current.disabled = false;
      generateButton.current.innerText = 'Generate Questions';
    }
  };

  const generateForm = async () => {
    if (generateFormButton.current) {
      generateFormButton.current.disabled = true;
      generateFormButton.current.innerText = 'Generating...';
    }
    let body = {
      docTitle: `${examDate.year}/${examDate.month}/${examDate.day}_${teacherName !== '' ? teacherName : 'unknown'}_${paperName !== '' ? paperName : 'untitled'}`,
      title: `${paperName !== '' ? paperName : 'untitled'}`,
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
    const res = await fetch(`/api/generateForm`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (r) => await r.json());
    setPaperLink(res.link);
    setPaperId(res.id);
    if (generateFormButton.current) {
      generateFormButton.current.disabled = false;
      generateFormButton.current.innerText = 'Generate Google Form';
    }
  }

  return (
    <div>
      <Head>
        <title>Quetsion Generator</title>
        <meta name='description' content='A question generator by AI' />
      </Head>

      <main className='py-20 px-6'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col px-8 py-6 gap-2 border-4 rounded-lg border-neutral-900'>
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
              <textarea defaultValue={text} className='border-4 border-neutral-900 rounded-lg p-8 h-96 resize-none' placeholder='Past your article here' onChange={(e) => setText(e.target.value)}>
              </textarea>
              <div className='flex justify-center'>
                <button ref={generateButton} className='px-6 py-4 leading-none border-4 border-neutral-900 bg-blue-300 rounded-full font-bold text-2xl disabled:bg-neutral-400' onClick={(e) => {
                  generateQuestions(text);
                }}>Generate Questions</button>
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              {
                questionChoices.length > 0 &&
                <div className='flex flex-col border-neutral-900 border-4 rounded-lg'>
                  <h2 className='text-2xl font-bold w-full text-center py-4 border-neutral-900 border-b-4'>Question Choices</h2>
                  <div className='px-6'>
                    {
                      questionChoices.map((choice, index) =>
                        <div key={index} className={`py-6${index < questionChoices.length - 1 ? ' border-b-2' : ''}`}>
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
                          <div className='pl-2'>
                            <div>{choice.question}</div>
                            <div className='flex flex-row gap-2 items-center mt-2'>
                              <div>Answer:</div>
                              <div className='font-bold'>{choice.answer}</div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              }
              <div className='flex flex-col border-neutral-900 border-4 rounded-lg'>
                <h2 className='text-2xl font-bold w-full text-center py-4 border-neutral-900 border-b-4'>Selected Questions</h2>
                {
                  selectedQuestions.map((choice, index) =>
                    <div key={index} className='px-6'>
                      <div className={`py-6 border-b-2`}>
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
                            <input type='text' className='font-bold w-1/2 rounded-md' value={choice.answer} onChange={e => {
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
                            <div className='ml-auto'>
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
                      paperLink === '' ?
                        <button ref={generateFormButton} className='px-6 py-4 leading-none border-4 border-neutral-900 bg-purple-300 rounded-full font-bold text-2xl disabled:bg-neutral-400' onClick={(e) => { generateForm() }}>
                          Generate Google Form
                        </button>
                        : <Link href={paperLink}>
                          <a className='mt-4 text-2xl hover:underline px-6 py-4 leading-none border-4 border-neutral-900 bg-red-300 rounded-full font-bold disabled:bg-neutral-400'>
                            Link
                          </a>
                        </Link>
                    }
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
