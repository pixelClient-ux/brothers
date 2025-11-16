declare module "ethiopian-date" {
  export class EthioDate {
    constructor(date?: Date);
    toString(): string;
    toGregorian(): Date;
    // Add more methods if needed
  }

  export function ecAddMonths(date: EthioDate, months: number): EthioDate;
  export function ecDiffMonths(start: EthioDate, end: EthioDate): number;
}
