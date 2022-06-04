import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Header() {

  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setLoggedIn(true);
    }
  });

  return (
    <>
      <Head>
        <title>Quetsion Generator</title>
        <meta name='description' content='A question generator by AI' />
      </Head>
      <header className='bg-slate-500 sticky top-0 w-full'>
        <div className='container mx-auto p-6 flex flex-row justify-between'>
        <h1 className='text-4xl font-bold text-white'>
          <Link href='/'>
            <a>
              Question Generator
            </a>
          </Link>
          </h1>
        <div className='flex flex-row gap-4 items-center'>
          {
            loggedIn ? 
            <Link href='/form/dashboard'>
              <a className='text-white hover:underline'>Dashboard</a>
            </Link>
            : <>
              <Link href='/login/exist'>
                <a className='text-white hover:underline'>Login</a>
              </Link>
              <Link href='/login/new'>
                <a className='text-white hover:underline'>Signup</a>
              </Link>
            </>
          }
        </div>
        </div>
      </header>
    </>
  )
}