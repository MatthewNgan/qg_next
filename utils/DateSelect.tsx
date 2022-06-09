import range from "./range";

function isLeap(y: number) {
  if (y % 4 !== 0) return false;
  if (y % 100 !== 0) return true;
  if (y % 400 === 0) return true;
  return false;
}

export default function DateSelect(props: { day: number; month: number; year: number, setExamDate: Function }) {

  const { day, month, year, setExamDate } = props;
  const days_in_month = [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return (
    <div className='flex flex-row gap-4'>
      <select name='exam_day' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow' defaultValue={new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()} onChange={(e) => {
        setExamDate({
          year: year,
          month: month,
          day: parseInt(e.target.value)
        })
      }}>
        {
          range(1, days_in_month[month-1] + 1, 1, true).map(d => <option key={`day_${d}`} value={d}>
            {d}
          </option>)
        }
      </select>
      <select name='exam_month' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow' defaultValue={new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1} onChange={(e) => {
        setExamDate({
          year: year,
          month: parseInt(e.target.value),
          day: day
        })
      }}>
        {
          range(1, 13, 1, true).map(m => <option key={`month_${m}`} value={m}>
            {m}
          </option>)
        }
      </select>
      <select name='exam_year' className='border border-neutral-400 bg-neutral-100 rounded-md p-1 flex-grow' defaultValue={year} onChange={(e) => {
        setExamDate({
          year: parseInt(e.target.value),
          month: month,
          day: day
        })
      }}>
        {
          range(new Date().getFullYear(), new Date().getFullYear() + 4).map(y => <option key={`year_${y}`} value={y}>
            {y}
          </option>)
        }
      </select>
    </div>
  )
}