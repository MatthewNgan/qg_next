import Header from '../../template/header';
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

export default function Info() {
  const router = useRouter();
  const id = React.useRef(router.query.id);
  const [token, setToken] = React.useState<string>(null);

  const [response, setResponse] = React.useState<Response>(null);
  const [title, setTitle] = React.useState<string>(null);
  const [description, setDescription] = React.useState<string>(null);
  const [url, setUrl] = React.useState<string>(null);

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setToken(localStorage.getItem('token'));
    } else {
      router.push('/login/exist');
    }
  }, []);

  React.useEffect(() => {
    console.log('called once');
    if (id.current != null && token != null) {
      // fetch(`/api/getResponse?id=${id.current}`, {
      //   method: 'GET', headers: {Authorization: token}
      // }).then(res => res.json()).then(data => setResponse(data));
      fetch(`/api/getForm?id=${id.current}`, {
        method: 'GET', headers: {Authorization: token}
      }).then(res => res.json()).then(data => {
        setTitle(data.info.title);
        setDescription(data.info.description);
        setUrl(data.responderUri);
      });
    }
  }, [id, token]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex-glow p-6'>
        <h1 className='text-3xl font-bold'>{title}</h1>
      </div>
    </div>
  );
}