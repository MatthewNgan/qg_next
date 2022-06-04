import Link from 'next/link';
import React from 'react';
import Header from './template/header';

export default function Home() {

  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setLoggedIn(true);
    }
  });

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex px-6 items-center flex-col justify-center gap-12 flex-grow text-center'>
        <h1 className='text-5xl font-bold'>
          Generate questions for text with just a few clicks.
        </h1>
        <div className='flex flex-row justify-center gap-4'>
          {
            loggedIn ?
            <div>
              <Link href='/form/dashboard'>
                <a className='p-4 bg-red-600 text-white rounded-lg hover:underline'>Dashboard</a>
              </Link>
            </div>
            : <>
              <div>
                <Link href='/login/new'>
                  <a className='p-4 bg-green-600 text-white rounded-lg hover:underline'>Sign up</a>
                </Link>
              </div>
              <div>
                or
              </div>
              <div>
                <Link href='/login/exist'>
                  <a className='p-4 bg-blue-600 text-white rounded-lg hover:underline'>Log in</a>
                </Link>
              </div>
            </> 
          }
        </div>
      </div>
    </div>
  );
}
