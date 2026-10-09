import dayjs from '../config/dayjs.js';

export interface MonthRange {
  label: string;
  start: number;
  end: number;
}

const buildMonths = (): MonthRange[] => {
  const now = dayjs().tz();
  return Array.from({ length: 6 }, (_, i) => {
    const start = now.subtract(5 - i, 'month').startOf('month');
    return {
      label: start.format('MMM'),
      start: start.valueOf(),
      end: start.add(1, 'month').valueOf(),
    };
  });
};
export const months = buildMonths();

/*-----------------------------------------*
 * sums a numeric field per month
 *-----------------------------------------*/
export const sumByMonth = (items: any[], field: string): number[] => {
  return months.map(({ start, end }) => {
    const filtered = items.filter(item => {
      const time = new Date(item.createdAt).getTime();
      return time >= start && time < end;
    });
    return filtered.reduce((sum, item) => sum + Number(item[field]), 0);
  });
};
