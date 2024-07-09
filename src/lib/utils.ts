import { GraphType, HabitType } from "@/data/HabitType";
import { UserType } from "@/data/userType";
import { type ClassValue, clsx } from "clsx";
import {
	differenceInDays,
	differenceInHours,
	format,
	isEqual,
	max,
	parse,
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
	console.log(parsedDate);
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

export function diffInDaysBetween(dateLeft: Date, dateRight: Date) {
	// const diff = differenceInDays(dateLeft, dateRight);
	const diff = Math.trunc(differenceInHours(dateLeft, dateRight) / 24) | 0;

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

export function getActiveDays(user: UserType, habit: HabitType) {
	// calculate total available days

	// if archived, the total span would be between created - archived
	// otherwise it would be created - now

	const now = getCurrentDate();

	let totalDays = 0;
	if (habit.archived) {
		totalDays = diffInDaysBetween(habit.created, habit.archivedDate!);

		if (isEqual(habit.archivedDate!, habit.lastChecked)) totalDays += 1;
	} else {
		totalDays = diffInDaysFromNow(habit.created);
		if (isEqual(now, habit.lastChecked)) totalDays += 1;
	}

	// calculate total number of paused days
	let totalPausedDays = 0;
	user?.pauses.forEach((pause) => {
		console.log(totalPausedDays);
		const daysPaused = diffInDaysBetween(pause.start, pause.end);
		totalPausedDays += daysPaused;

		if (isEqual(habit.lastChecked, pause.start) && daysPaused > 0) {
			console.log("less 1");
			totalPausedDays -= 1;
		}

		if (isEqual(habit.lastChecked, pause.end) && daysPaused > 0) {
			console.log("less 2");
			totalPausedDays -= 1;
		}
		console.log(pause);
		console.log(totalPausedDays);
	});

	// if currently paused, also ignore days from when pause started to now
	if (user?.pauseStreaks && !habit.archived) {
		totalPausedDays += diffInDaysFromNow(user.pauseStartDate!);

		if (isEqual(habit.lastChecked, user.pauseStartDate!))
			totalPausedDays -= 1;
	}

	console.log(totalDays, totalPausedDays);
	// subtract total paused days
	const activeDays = totalDays - Math.max(totalPausedDays, 0);

	return activeDays;
}
