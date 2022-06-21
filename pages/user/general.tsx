import React from 'react';
import Header from '../template/header';
import { useRouter } from 'next/router';

export default function General() {

  const router = useRouter();

  const changePwdForm = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (changePwdForm != null) {
      changePwdForm.current.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(changePwdForm.current);
        let postData = {
          password: formData.get('password'),
          new_password: formData.get('new_password')
        }
        if (formData.get('retype_password') === formData.get('new_password')) {
          fetch(`${process.env.BACKEND_SERVER}/user/update`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(postData)
          }).then(() => {
            // to-do...
          }).catch(() => {
            // to-do....
          });
        }
      })
    }
  }, [changePwdForm]);

  React.useEffect(() => {
    if (localStorage.getItem('token') == null || localStorage.getItem('token') === '')
      router.push('/');
  }, [router]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto p-6'>
        <div>
          <h1 className='text-4xl pb-2 mb-2 border-b'>Account Details</h1>
          <div className='flex flex-col gap-2 items-start'>
            <h2 className='text-2xl font-bold'>Change Password</h2>
            <form ref={changePwdForm}>
              <div className='flex flex-col gap-2'>
                <label>
                  <div>Current password</div>
                  <input type='password' name='password' className='rounded-md' required />
                </label>
                <label>
                  <div>New password</div>
                  <input type='password' name='new_password' className='rounded-md' required />
                </label>
                <label>
                  <div>Retype password</div>
                  <input type='password' name='retype_password' className='rounded-md' required />
                </label>
                <button type='submit' className='p-2 bg-green-600 text-white rounded-md hover:underline'>Submit</button>
              </div>
            </form>
            <button className='p-4 bg-red-600 text-white rounded-lg hover:underline' onClick={() => {
              localStorage.removeItem('token');
              router.push('/');
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}