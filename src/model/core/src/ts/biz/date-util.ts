import { EntityUtil } from './entity';

const dateCache: Record<string, Date> = {}

export const isNumeric = (value: any): boolean => {
  return (!isNaN(parseFloat(value)));
}

export class DateUtil {
  public static toDate(dateString: string): Date {
    const dataStringVal = (dateString || DateUtil.MIN_DATE_STRING);

    if (dateCache[dataStringVal]) {
      return dateCache[dataStringVal];
    }

    if (isNumeric(dataStringVal)) {
      return (dateCache[dataStringVal] = new Date(parseInt(dataStringVal)));
    }

    return (dateCache[dataStringVal] = new Date(dataStringVal));
  }

  public static currentDateTime = (): Date => {
    return DateUtil.toDate(EntityUtil.generate('timestamp'));
  }

  public static toStartOfDay = (date?: Date): Date => {
    const value = ((date) ? new Date(date) : new Date());
    value.setHours(0, 0, 0, 0);
    return value;
  }

  public static toEndOfDay = (date?: Date): Date => {
    const value = ((date) ? new Date(date) : new Date());
    value.setHours(23, 59, 59);
    return value;
  }

  public static toTimestamp = (date: (Date | string)): string => {
    if (typeof date === 'string') {
      return DateUtil.toDate(date).toString()
    }

    return date.toString();
  }

  public static readonly MIN_DATE = DateUtil.toDate(new Date(0).toString());
  public static readonly MAX_DATE = DateUtil.toDate(new Date(3000, 12, 31).toString());
  public static readonly MIN_DATE_STRING = DateUtil.toTimestamp(DateUtil.MIN_DATE);

}

