import Head from 'next/head';
import Link from 'next/link';

export default function Header() {
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
          <Link href='/login/exist'>
            <a className='text-white hover:underline'>Login</a>
          </Link>
          <Link href='/login/new'>
            <a className='text-white hover:underline'>Signup</a>
          </Link>
          <Link href='/form/dashboard'>
            <a className='text-white hover:underline'>Dashboard</a>
          </Link>
        </div>
        </div>
      </header>
    </>
  )
}