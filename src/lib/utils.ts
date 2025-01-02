import { GraphType, HabitType } from "@/data/HabitType";
import { type ClassValue, clsx } from "clsx";
import {
	addDays,
	differenceInHours,
	format,
	parse,
	startOfYear,
} from "date-fns";
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

	now.setHours(0);
	now.setMinutes(0);
	now.setSeconds(0);
	now.setMilliseconds(0);

	const dayOfYear = format(now, "DDD");
	return parseInt(dayOfYear);
}

/**
 * Get the difference between now and a previous date
 * @param date
 * @returns
 */
export function diffInDaysFromNow(date: Date) {
	const now = new Date();
	now.setHours(0);
	now.setMinutes(0);
	now.setSeconds(0);
	now.setMilliseconds(0);

	const diff = Math.trunc(differenceInHours(now, date) / 24) | 0;

	// const diff = differenceInDays(now, date);

	// const start = getDayOfYear();

	// const end = getDayOfYear(date);

	return Math.abs(diff);
}

export function getCurrentDate() {
	const newDate = new Date();
	newDate.setHours(0);
	newDate.setMinutes(0);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);

	return newDate;
}

export function getLastActiveDate(graph: GraphType[], created: Date) {
	let lastCheckedDate;
	for (let i = graph.length - 1; i >= 0; i--) {
		const daysArray = graph[i].daysChecked;

		if (daysArray.length > 0) {
			lastCheckedDate = daysArray[daysArray.length - 1];
			break;
		}
	}

	if (!lastCheckedDate) return created;

	return lastCheckedDate;
}
