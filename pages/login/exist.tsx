import React from 'react';
import Header from '../template/header';
import { useRouter } from 'next/router';

export default function Exist() {

  const router = useRouter();
  React.useEffect(() => {
    if (window != null && localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      router.push('/form/dashboard');
    }
  }, [])
  
  const form = React.useRef<HTMLFormElement>(null);
  const [token, setToken] = React.useState<string>(null);
  const [error, setError] = React.useState<string>(null);
  const login = (formData: FormData) => {
    const data = new URLSearchParams();
    data.append('grant_type', '');
    data.append('username', formData.get('username').toString());
    data.append('password', formData.get('password').toString());
    data.append('scope', '');
    data.append('client_id', '');
    data.append('client_secret', '');
    fetch(`${process.env.BACKEND_SERVER}/user/token`, {
      method: 'POST',
      body: data,
    }).then(async r => {
      if (r.status !== 200) throw await r.text();
      return r.json();
    }).then(tdata => {
      if (tdata.token_type != null && tdata.access_token != null) {
        localStorage.setItem('token', `${tdata.token_type} ${tdata.access_token}`);
        router.push('/form/dashboard');
      }
    }).catch((e) => {
        setError(e);
    });
  }

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  React.useEffect(() => {
    if (form != null) {
      form.current.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(form.current);
        login(formData);
      })
    }
  }, [form])

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex flex-col items-center flex-grow justify-center'>
        <h1 className='text-4xl font-bold mb-8'>Login</h1>
        {
          error != null && <div>Error: {error}</div>
        }
        <form ref={form}>
          <div className='flex flex-col gap-2'>
            <input placeholder='Username' name='username' type='text' className='rounded-lg' />
            <input placeholder='Password' name='password' type='password' className='rounded-lg' />
            <button type='submit' className='p-2 bg-green-600 text-white hover:underline rounded-lg'>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}