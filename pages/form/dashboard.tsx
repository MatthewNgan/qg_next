import Header from '../template/header';
import Link from 'next/link';
import React from 'react';

export default function Dashboard () {

  const [formList, setFormList] = React.useState<Form[]>([]);

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
    refreshFormList();
  }, []);

  return (
    <div>
      <Header />
      <div className='container mx-auto'>
        <div className='p-4 flex flex-col gap-8'>
          <h1 className='text-5xl'>
            Dashboard
          </h1>
          <div>
            <Link href='/form/generate'>
              <a className='p-4 bg-red-500 text-white rounded-lg hover:underline'>Generate a form</a>
            </Link>
          </div>
          <div>
            <h2 className='text-2xl mb-4'>Recent forms</h2>
            <div className='grid grid-cols-3'>
              {
                formList.length > 0 ?
                formList.map((item) => (
                  <Link href={`/form/info/${item.id}`}>
                    <a>
                      <div key={item.id} className='group p-4 border rounded-lg'>
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
                : <div>No form</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}