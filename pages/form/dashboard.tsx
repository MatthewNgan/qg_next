import Header from '../template/header';
import Link from 'next/link';
import React from 'react';

export default function Dashboard () {
  return (
    <div>
      <Header />
      <div className='container mx-auto'>
        <div className='p-4'>
          <h1 className='text-5xl'>
            Dashboard
          </h1>
          <div>
            <Link href='./generate'>
              <a>Generate a form</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}