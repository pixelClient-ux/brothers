import * as ethiopianDate from "ethiopian-date";
const toEthiopian = (ethiopianDate as any).toEthiopian;
const toGregorian = (ethiopianDate as any).toGregorian;

export function gregToEth(date: Date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const [ey, em, ed] = toEthiopian(y, m, d);
  return { year: ey, month: em, day: ed };
}

export function ethToGreg(eth: { year: number; month: number; day: number }) {
  const [gy, gm, gd] = toGregorian(eth.year, eth.month, eth.day);
  return new Date(Date.UTC(gy, gm - 1, gd));
}

export function addEthMonths(
  eth: { year: number; month: number; day: number },
  months: number
) {
  let year = eth.year;
  let month = eth.month + months;

  while (month > 13) {
    month -= 13;
    year++;
  }

  const maxDay = month === 13 ? 6 : 30;
  return { year, month, day: Math.min(eth.day, maxDay) };
}

export function ethDaysBetween(start: Date, end: Date) {
  const s = gregToEth(start);
  const e = gregToEth(end);
  const d1 = ethToGreg(s).getTime();
  const d2 = ethToGreg(e).getTime();
  return Math.ceil((d2 - d1) / (1000 * 3600 * 24));
}
