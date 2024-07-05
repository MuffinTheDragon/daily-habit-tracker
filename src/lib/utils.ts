import { GraphType } from "@/data/HabitType";
import { type ClassValue, clsx } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Given a year, calculate how many days are in it
 * @param year
 * @returns number of days. either 365 or 366 (for leap year)
 */
export function daysInYear(year: number) {
	return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}

/**
 * Given a day number (e.g. 250th day of the year), return its readable format
 * @param dayNumber
 * @returns Readable format: DDD MMM dd
 */
export function getMonthAndDayOfWeek(dayNumber: number) {
	var date = new Date(new Date().getFullYear(), 0);

	date.setDate(dayNumber);

	// Get month and day
	var month = date.toLocaleString("default", { month: "short" });
	var dayOfWeek = date.toLocaleString("default", { weekday: "short" });
	var dayOfMonth = date.getDate();

	var result = `${dayOfWeek} ${month} ${dayOfMonth}`;

	return result;
}

/**
 * Given a day number (e.g. 250th day of the year), return its full date (MMMM dd YYYY)
 * @param dayNumber
 * @returns full date
 */
export function getDateByDayNumber(dayNumber: number) {
	const parsedDate = parse(dayNumber.toString(), "DDD", new Date());
	return parsedDate;
}

/**
 * Given a date (or today if no date), return its day number of the year
 * @param date
 * @returns day number of the year
 */
export function getDayOfYear(date?: Date) {
	const now = date ? date : new Date();

	const dayOfYear = format(now, "DDD");
	return parseInt(dayOfYear);
}

/**
 * Get the difference between now and a previous date
 * @param date
 * @returns
 */
export function getDaysDifference(date: Date) {
	const start = getDayOfYear();

	const end = getDayOfYear(date);

	return start - end;
}

/**
 * Get absolute difference a given date and today. Ceil the result for consistency calculation
 * @param givenDate
 * @returns
 */
export function daysBetweenDatesAbsolute(givenDate: Date) {
	const start = getDayOfYear();

	const end = getDayOfYear(givenDate);

	return start - end;
}
