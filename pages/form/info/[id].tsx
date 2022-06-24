import Header from '../../template/header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import range from '../../../utils/range';
import ReactPaginate from 'react-paginate';

interface Answer {
  value: string;
}

interface Question {
  title: string;
  questionId: string;
  answer: Answer[];
  correctAnswer: {
    answers: Answer[];
  };
  score: number;
}

interface Response {
  responseId: string;
  questions: Question[];
  totalScore: number;
}

export async function getServerSideProps(context) {
  return {
      props: {},
  };
}

export default function Info() {
  const router = useRouter();
  const id = React.useRef(router.query.id);
  const [token, setToken] = React.useState<string>(null);

  const [responses, setResponses] = React.useState<Response[]>(null);
  const [form, setForm] = React.useState<any>(null);
  const [error, setError] = React.useState<string>(null);
  const [currentRes, setCurrentRes] = React.useState(0);
  const [formLoaded, setFormLoaded] = React.useState(false);
  const [resLoaded, setResLoaded] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setToken(localStorage.getItem('token'));
    } else {
      router.push('/login/exist');
    }
  }, []);

  React.useEffect(() => {
    if (id.current != null && token != null) {
      fetch(`${process.env.BACKEND_SERVER}/forms/${id.current}`, {
        method: 'GET', headers: {Authorization: token}
      }).then(async r => {
        setFormLoaded(true);
        if (r.status !== 200) throw await r.text();
        return r.json();
      }).then(data => setForm(data)).catch(err => setError(err));
      fetch(`${process.env.BACKEND_SERVER}/getresponses?form_id=${id.current}`, {
        method: 'GET', headers: {Authorization: token}
      }).then(async r => {
        setResLoaded(true);
        if (r.status !== 200) throw await r.text();
        return r.json();
      }).then(data => setResponses(data)).catch(err => setError(err));;
    }
  }, [id, token]);

  const ResponseItem = React.useCallback(({ response }: { response: Response }) => {
    return (<>
      <div className='font-bold mb-4 text-xl'>Total score: {response.totalScore}</div>
      <div className='flex flex-col gap-4'>
        {
          response.questions.map((question, id) => <div key={id}>
            <h3 className='font-lg font-bold'>Q{id + 1}. {question.title}</h3>
            <div>Response: {question.answer[0].value}</div>
            <div>Correct answer: {question.correctAnswer.answers[0].value}</div>
            <div>Score: {question.score}</div>
          </div>)
        }
      </div>
    </>)
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex-glow p-6 flex flex-col gap-4'>
        {
          form != null ?
          <>
            <h1 className='text-5xl font-bold'>{form.title}</h1>
            <Link href={form.link} target='_blank' rel='noreferrer noopener'>
              <a className='hover:underline'>
                Link to form
              </a>
            </Link>
            {
              form.text != null && form.text !== '' &&
              <details>
                <summary className='hover:underline cursor-pointer'>
                  Show the text
                </summary>
                <div className='my-2 w-full border-4 border-neutral-800 rounded-lg p-4 cursor-text'>{form.text}</div>
              </details>
            }
            {
              responses != null ? 
                responses.length > 0 ? <div className='flex flex-col items-start'>
                  <h2 className='text-4xl font-bold'>Responses</h2>
                  <ReactPaginate
                    pageCount={responses.length}
                    onPageChange={(e) => setCurrentRes(e.selected)}
                    nextLabel='>'
                    previousLabel='<'
                    containerClassName='flex flex-row border rounded-lg self-center overflow-hidden'
                    pageLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    nextLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    previousLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    activeClassName='bg-neutral-700 text-white'
                    breakLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    forcePage={currentRes}
                  />
                  <ResponseItem response={responses[currentRes]} />
                  <ReactPaginate
                    pageCount={responses.length}
                    onPageChange={(e) => setCurrentRes(e.selected)}
                    nextLabel='>'
                    previousLabel='<'
                    containerClassName='flex flex-row border rounded-lg self-center overflow-hidden'
                    pageLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    nextLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    previousLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    activeClassName='bg-neutral-700 text-white'
                    breakLinkClassName='p-4 block leading-none border-r cursor-pointer hover:underline last:border-none'
                    forcePage={currentRes}
                  />
                </div>
                : <h2 className='text-2xl'>No response yet</h2>
              : resLoaded ? <h2 className='text-2xl'>{error}</h2> : <h2 className='text-2xl'>Loading...</h2>
            }
            <Link href={form.link} target='_blank'>
              <a className='hover:underline'>
                Link to form
              </a>
            </Link>
          </>
          : formLoaded ? <h2 className='text-2xl'>{error != null ? error : ''}</h2> : <h2 className='text-2xl'>Loading...</h2>
        }
      </div>
    </div>
  );
}