import { GraphType, HabitType } from "@/data/HabitType";
import { type ClassValue, clsx } from "clsx";
import {
	differenceInHours,
	isAfter,
	isBefore,
	isEqual,
	max,
	parse,
	startOfDay,
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
 * @param year corresponding year
 * @returns full date
 */
export function getDateByDayNumber(year: number, dayNumber: number) {
	const parsedDate = parse(dayNumber.toString(), "DDD", new Date(year, 0, 1));
	return parsedDate;
}

/**
 * Get the difference between now and a previous date
 * @param date
 * @returns
 */
export function diffInDaysFromNow(date: Date) {
	const now = startOfDay(new Date());

	const diff = Math.trunc(differenceInHours(now, date) / 24) | 0;

	return Math.abs(diff);
}

export function getCurrentDate() {
	return startOfDay(new Date());
}

/**
 * compute the last time a habit was marked as completed.
 * if none, return date of creation as default
 *
 * @param graph contains list of checked dates
 * @param created when habit was created
 * @returns
 */
function getLastCheckedDateDefault(graph: GraphType[], created: Date) {
	let lastCheckedDate;
	for (let i = graph.length - 1; i >= 0; i--) {
		const daysArray = graph[i].daysChecked;

		if (daysArray.length > 0) {
			lastCheckedDate = daysArray[daysArray.length - 1];
			break;
		}
	}

	if (!lastCheckedDate) return startOfDay(created);

	return lastCheckedDate;
}

/**
 * compute the last updated date for this habit.
 * "Last updated" could mean:
 * 		- when the habit was last checked
 * 		- when it was created
 * 		- or when the last pause ended
 *
 * @param graph contains list of checked dates
 * @param created when habit was created
 * @param pauseEndDate when the last pause ended
 * @returns
 */
export function getLastUpdatedDate(
	graph: GraphType[],
	created: Date,
	pauseEndDate: Date | undefined
) {
	const lastCheckedDate = getLastCheckedDateDefault(graph, created);

	// if the app was paused, the last active date would be
	// max(last manual check, pause end) because we want to ignore any computations during a pause
	const lastUpdated = pauseEndDate
		? max([lastCheckedDate, pauseEndDate])
		: lastCheckedDate;

	return lastUpdated;
}

/**
 * compute the longest streak for a habit.
 * @param model
 * @param newStreak
 * @returns
 */
export function getLongestStreak(model: HabitType, newStreak: number) {
	const currentDate = getCurrentDate();

	let longestStreak = model.longestStreak;
	let longestStreakDateSet = model.longestStreakDateSet;

	if (newStreak > model.longestStreak) {
		longestStreak = newStreak;
		longestStreakDateSet = currentDate;
	} else if (isEqual(longestStreakDateSet, currentDate)) {
		longestStreak -= 1;
	}

	return { longestStreak, longestStreakDateSet };
}

/**
 * get the last date for when a habit was checked
 * if none, don't return a default value; just return undefined
 * @param graph
 * @returns
 */
export function getLastCheckedDateNoDefault(graph: GraphType[]) {
	return graph.at(-1)?.daysChecked.at(-1);
}

export function isHabitDoneForToday(habit: HabitType) {
	const lastCheckedDate = getLastCheckedDateNoDefault(habit.graph);

	if (!lastCheckedDate) return false;

	const now = getCurrentDate();

	return isEqual(lastCheckedDate, now);
}

export function isAfterOrEqual(date1: Date, date2: Date) {
	return isAfter(date1, date2) || isEqual(date1, date2);
}

export function isBeforeOrEqual(date1: Date, date2: Date) {
	return isBefore(date1, date2) || isEqual(date1, date2);
}

/**
 * get the base number of streak freezes given a streak
 * award more freezes for longer streaks so that its less discouraging if a streak breaks
 * @param streaks
 * @returns base number of freezes
 */
export function getStreakFreezes(streaks: number) {
	if (streaks <= 7) return 3;

	if (streaks <= 14) return 5;

	if (streaks <= 21) return 7;

	if (streaks <= 30) return 10;

	if (streaks <= 45) return 12;

	if (streaks <= 60) return 15;

	return 20;
}
