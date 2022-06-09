export default function range(start: number, stop: number, step: number = 1, date: boolean = false) {
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
  var result: any[] = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    if (date) result.push(i < 10 ? `0${i}` : i.toString());
    else result.push(i);
  }

  return result;
};