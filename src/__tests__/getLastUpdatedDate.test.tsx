import { GraphType } from "@/data/HabitType";
import { getCurrentDate, getLastUpdatedDate } from "@/lib/utils";
import { addDays, addYears } from "date-fns";
import { expect, test } from "vitest";

const now = getCurrentDate();
const year = now.getFullYear();

test("Habit was checked today", () => {
	const created = addDays(now, -10);
	const graph: GraphType[] = [
		{ year, daysChecked: [now], manualDaysChecked: [] },
	];

	const date = getLastUpdatedDate(graph, created, undefined);

	expect(date).toEqual(now);
});

test("Newly created habit", () => {
	const graph: GraphType[] = [
		{ year, daysChecked: [], manualDaysChecked: [] },
	];

	const date = getLastUpdatedDate(graph, now, undefined);

	// update date would fallback to created
	expect(date).toEqual(now);
});

test("Habit with multiple checks and retro checks", () => {
	const created = addDays(now, -10);

	const graph: GraphType[] = [
		{
			year,
			daysChecked: [addDays(now, -5), addDays(now, -3)],
			manualDaysChecked: [now],
		},
	];

	const date = getLastUpdatedDate(graph, created, undefined);

	// since manual (i.e. retro) checks don't impact streaks, should be most recent daysChecked
	expect(date).toEqual(addDays(now, -3));
});

test("Habit that was recently paused", () => {
	const created = addDays(now, -10);

	const graph: GraphType[] = [
		{
			year,
			daysChecked: [addDays(now, -5), addDays(now, -3)],
			manualDaysChecked: [now],
		},
	];

	// pause date is more recent than checks
	const date = getLastUpdatedDate(graph, created, now);

	expect(date).toEqual(now);
});

test("Habit that was paused a while ago", () => {
	const created = addDays(now, -10);

	const graph: GraphType[] = [
		{
			year,
			daysChecked: [addDays(now, -5), addDays(now, -3)],
			manualDaysChecked: [now],
		},
	];

	// pause date is less recent than checks
	const date = getLastUpdatedDate(graph, created, addDays(now, -15));

	expect(date).toEqual(addDays(now, -3));
});

test("Test habit in new year", () => {
	const created = addYears(now, -1);
	const graph: GraphType[] = [
		{
			year: year - 1,
			daysChecked: [created],
			manualDaysChecked: [addDays(created, 5)],
		},
		{
			year,
			daysChecked: [],
			manualDaysChecked: [],
		},
	];

	// pause is most recent
	let date = getLastUpdatedDate(graph, created, now);
	expect(date).toEqual(now);

	date = getLastUpdatedDate(graph, created, undefined);
	expect(date).toEqual(created);

	date = getLastUpdatedDate(graph, created, addDays(created, 1));
	expect(date).toEqual(addDays(created, 1));
});
