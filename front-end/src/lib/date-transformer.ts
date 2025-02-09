import { format } from 'date-fns';

export function dateToURLParam(date: Date) : string {
	return format(date, 'yyyyMMdd');
}
