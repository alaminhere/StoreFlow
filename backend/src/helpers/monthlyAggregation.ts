import dayjs from 'dayjs';

export interface MonthRange {
  label: string;
  start: number;
  end: number;
}
const now = dayjs().tz();
export const months = Array.from({ length: 6 }, (_, i) => {
  const start = now.subtract(5 - i, 'month').startOf('month');
  return {
    label: start.format('MMM'),
    start: start.valueOf(),
    end: start.add(1, 'month').valueOf(),
  };
});

export const sumByMonth = (items: any[], field: string) =>
  months.map(({ start, end }) =>
    items
      .filter(d => {
        const t = new Date(d.createdAt).getTime();
        return t >= start && t < end;
      })
      .reduce((s, d) => s + Number(d[field]), 0),
  );
