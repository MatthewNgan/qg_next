import Head from 'next/head'
import Link from 'next/link';
import React from 'react';
import Header from './template/header';

export default function Home() {
  return (
    <div>
      <Header />
      <div className='container mx-auto flex items-center flex-col justify-center h-screen gap-12'>
        <h1 className='text-5xl font-bold'>
          Generate questions for text with just a few clicks.
        </h1>
        <div className='flex flex-row justify-center gap-4'>
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
        </div>
      </div>
    </div>
  );
}
