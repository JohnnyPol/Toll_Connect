import { format, parse } from 'jsr:@std/datetime';

/**                         DATE CONVERSIONS                                  */

function set_date (date: Date) => String {
	return format(date, 'yyyy-MM-DD HH:mm');
}

function get_date (date: String) => Date {
	return parse(date, 'yyyyMMDD');
}

export { get_date, set_date };
