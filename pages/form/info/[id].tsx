import Header from '../../template/header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

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

  const [response, setResponse] = React.useState<Response>(null);
  const [title, setTitle] = React.useState<string>(null);
  const [form, setForm] = React.useState<any>(null);
  const [description, setDescription] = React.useState<string>(null);
  const [url, setUrl] = React.useState<string>(null);
  const [error, setError] = React.useState<string>(null);

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setToken(localStorage.getItem('token'));
    } else {
      router.push('/login/exist');
    }
  }, []);

  React.useEffect(() => {
    if (id.current != null && token != null) {
      fetch(`/api/getForm?id=${id.current}`, {
        method: 'GET', headers: {Authorization: token}
      }).then(res => res.json()).then(data => {
        setForm(data);
      }).catch(error => {
        setError(error);
        console.log(error);
      });
      fetch(`/api/getResponse?id=${id.current}`, {
        method: 'GET', headers: {Authorization: token}
      }).then(res => res.json()).then(data => setResponse(data));
    }
  }, [id, token]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex-glow p-6 flex flex-col gap-4'>
        {
          form != null ?
          <>
            <h1 className='text-5xl font-bold'>{form.title}</h1>
            {
              form.text != null && form.text !== '' &&
              <details>
                <summary className='hover:underline cursor-pointer'>
                  Show the text
                </summary>
                {
                  form.text.slice().split('\n').map((text, id) => <div key={`para_${id}`} className='my-2 text-gray-500'>
                    {text}
                  </div>)
                }
              </details>
            }
            <Link href={form.link}>
              <a className='hover:underline'>
                Link to form
              </a>
            </Link>
          </>
          : <h2 className='text-4xl'>Loading...</h2>
        }
      </div>
    </div>
  );
}