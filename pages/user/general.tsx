import Header from '../template/header';

interface GeneralProps {

}

export default function General(props: GeneralProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container mx-auto p-6'>
        <div>
          <h1 className='text-4xl pb-4 border-b'>Account Details</h1>
          <div className='flex flex-col gap-4'>
            <h2>Change Password</h2>
            <form>
              <label>
                <div>Current password</div>
                <input />
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}