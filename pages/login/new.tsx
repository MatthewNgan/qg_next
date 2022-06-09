import React from 'react';
import Header from '../template/header';
import { useRouter } from 'next/router';

export default function New() {

  const router = useRouter();
  React.useEffect(() => {
    if (window != null && localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      router.push('/form/dashboard');
    }
  }, [])
  
  const form = React.useRef<HTMLFormElement>(null);
  const createUser = (data: {username: string; password: string}) => {
    fetch(`http://${process.env.BACKEND_SERVER}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then(async r => {
      if (r.status !== 200) throw await r.text();
      return r.json();
    }).then(tdata => {
      localStorage.setItem('token', `${tdata.token_type} ${tdata.access_token}`);
      router.push('/form/dashboard');
    });
  };

  React.useEffect(() => {
    if (form != null) {
      form.current.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(form.current);
        if (formData.get('password') === formData.get('retype')) {
          let postData = {
            username: formData.get('username').toString(),
            password: formData.get('password').toString()
          };
          createUser(postData);
        }
      })
    }
  }, [form])

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex flex-col items-center flex-grow justify-center'>
        <h1 className='text-4xl font-bold mb-8'>Sign Up</h1>
        <form ref={form}>
          <div className='flex flex-col gap-2'>
            <input placeholder='Username' name='username' type='text' className='rounded-lg' />
            <input placeholder='Password' name='password' type='password' className='rounded-lg' />
            <input placeholder='Retype your password' name='retype' type='password' className='rounded-lg' />
            <button type='submit' className='p-2 bg-green-600 text-white hover:underline rounded-lg'>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}