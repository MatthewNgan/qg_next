import Header from '../template/header';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

export default function Dashboard () {

  const [formList, setFormList] = React.useState<Form[]>([]);
  const [token, setToken] = React.useState<string>(null);
  const [error, setError] = React.useState<string>(null);

  const router = useRouter();

  const initFormList = () => {
    localStorage.setItem('formList', JSON.stringify(formList));
  }
  const refreshFormList = () => {
    if (localStorage.getItem('formList') != null) {
      let list: Form[] = JSON.parse(localStorage.getItem('formList'));
      setFormList(list);
    }
    else initFormList();
  }

  React.useEffect(() => {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') !== '') {
      setToken(localStorage.getItem('token'));
    } else {
      router.push('/login/exist');
    }
  }, []);

  React.useEffect(() => {
    if (token != null) {
      fetch(`${process.env.BACKEND_SERVER}/forms`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      }).then(async r => {
        if (r.status !== 200 && r.status !== 304) throw await r.text();
        return r.json();
      }).then(data => {
        setFormList(data);
        setError('No forms');
      }).catch(error => {
        setError(error);
        console.log(error);
      });
    }
  }, [token])

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto flex-grow'>
        <div className='px-4 py-8 flex flex-col gap-8'>
          <h1 className='text-5xl'>
            Dashboard
          </h1>
          <div>
            <Link href='/form/generate'>
              <a className='p-4 bg-green-500 text-white rounded-lg hover:underline'>Generate a form</a>
            </Link>
          </div>
          <div>
            <h2 className='text-2xl mb-4'>Your forms</h2>
            <div className='grid grid-cols-3 gap-4 mb-4'>
              {
                formList.length > 0 ?
                formList.map((item) => (
                  <Link href={`/form/info/${item.form_id}`} key={item.form_id}>
                    <a>
                      <div className='group p-4 border border-neutral-300 rounded-lg'>
                        <h3 className='text-xl font-bold group-hover:underline'>{item.title}</h3>
                        <div>
                          By: {item.by}
                        </div>
                        <div>
                          Date: {item.date}
                        </div>
                      </div>
                    </a>
                  </Link>
                ))
                : ( error != null ?
                  <div className='col-span-full'>{error.toString()}</div>
                  : <div className='col-span-full'>Loading...</div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}