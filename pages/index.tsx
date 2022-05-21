import Head from 'next/head'
import React from 'react';

function range(start : number, stop : number, step : number = 1) {
  if (typeof stop == 'undefined') {
      stop = start;
      start = 0;
  }
  if (typeof step == 'undefined') {
      step = 1;
  }
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
  }
  var result : string[] = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i < 10 ? `0${i}` : i.toString());
  }

  return result;
};

function DateSelect ( props : { day: number; month: number; year: number, setExamDate: Function } ) {

  const days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];

  const { day, month, year, setExamDate } = props;

  return (
    <div className='flex flex-row gap-4'>
      <select name='exam_day' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
        <option disabled selected>dd</option>
        {
          range(day, days_in_month[month] + 1).map(d => <option key={`day_${d}`} value={d}>
            {d}
          </option>)
        }
      </select>
      <select name='exam_month' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
        <option disabled selected>mm</option>
        {
          range(month+1, 13).map(m => <option key={`month_${m}`} value={m}>
            {m}
          </option>)
        }
      </select>
      <select name='exam_year' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
        <option disabled selected>yy</option>
        {
          range(year, year + 4).map(y => <option key={`year_${y}`} value={y}>
            {y}
          </option>)
        }
      </select>
    </div>
  )
}

export default function Home() {

  const [examDate, setExamDate] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  });
  const [text, setText] = React.useState('');

  return (
    <div>
      <Head>
        <title>Quetsion Generator</title>
        <meta name='description' content='A question generator by AI' />
      </Head>

      <main className='py-20 px-6'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col px-8 py-6 gap-2 border-4 rounded-lg border-neutral-900'>
                <input name='paper_name' type='text' placeholder='Name of exam paper' className='p-3 border rounded-md' />
                <input name='teacher_name' type='text' placeholder='Name of teacher' className='p-3 border rounded-md' />
                <div>
                  <div className='px-1 mb-2'>Expected exam date</div>
                  <DateSelect year={examDate.year} month={examDate.month} day={examDate.day} setExamDate={setExamDate} />
                </div>
                <div>
                  <div className='px-1 mb-2'>Exam grade</div>
                  <select className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow'>
                    <option>grade</option>
                  </select>
                </div>
              </div>
              <textarea className='border-none focus:border-none border-neutral-900 rounded-lg p-8 h-96 resize-none overflow-hidden' placeholder='Past your article here' onChange={(e) => setText(e.target.value)}>
                {text}
              </textarea>
              <div className='flex justify-center'>
                <button className='px-6 py-4 leading-none border-4 border-neutral-900 bg-blue-300 rounded-full font-bold text-2xl'>Generate Questions</button>
              </div>
            </div>
            <div className='flex flex-col gap-6'>

            </div>
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
