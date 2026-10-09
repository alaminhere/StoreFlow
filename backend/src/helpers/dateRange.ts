import dayjs from '../config/dayjs.js';
import type { RangeKey } from '../constants/index.js';

export function getDateRange(range: RangeKey) {
  const now = dayjs().tz();
  let from: dayjs.Dayjs;
  let to: dayjs.Dayjs = now;
  let prevFrom: dayjs.Dayjs;
  let prevTo: dayjs.Dayjs;

  switch (range) {
    case 'today':
      from = now.startOf('day');
      to = now.endOf('day');
      prevFrom = from.subtract(1, 'day');
      prevTo = from.subtract(1, 'day').endOf('day');
      break;

    case 'yesterday':
      from = now.subtract(1, 'day').startOf('day');
      to = from.endOf('day');
      prevFrom = from.subtract(1, 'day');
      prevTo = from.subtract(1, 'day').endOf('day');
      break;

    case 'last7days':
      from = now.subtract(6, 'day').startOf('day');
      to = now.endOf('day');
      prevFrom = from.subtract(7, 'day');
      prevTo = from.subtract(1, 'millisecond');
      break;

    case 'last30days':
      from = now.subtract(29, 'day').startOf('day');
      to = now.endOf('day');
      prevFrom = from.subtract(30, 'day');
      prevTo = from.subtract(1, 'millisecond');
      break;

    case 'lastMonth':
      from = now.subtract(1, 'month').startOf('month');
      to = from.endOf('month');
      prevFrom = from.subtract(1, 'month').startOf('month');
      prevTo = prevFrom.endOf('month');
      break;

    case 'thisYear':
      from = now.startOf('year');
      to = now.endOf('day');
      prevFrom = from.subtract(1, 'year').startOf('year');
      prevTo = prevFrom.endOf('year');
      break;

    default:
      from = now.startOf('day');
      to = now.endOf('day');
      prevFrom = from;
      prevTo = to;
  }

  return {
    from: from.toDate(),
    to: to.toDate(),
    prevFrom: prevFrom.toDate(),
    prevTo: prevTo.toDate(),
  };
}
