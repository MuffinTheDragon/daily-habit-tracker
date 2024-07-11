import { HabitType } from "@/data/HabitType";
import { getCurrentDate, isHabitDoneForToday } from "@/lib/utils";
import { addDays, startOfDay } from "date-fns";
import { beforeEach, expect, test } from "vitest";

const now = getCurrentDate();
const year = now.getFullYear();

let habit: HabitType;

beforeEach(() => {
	habit = {
		id: "1",
		created: new Date(),
		name: "Test habit",
		description: "",
		streak: 0,
		longestStreak: 0,
		checks: 0,
		archived: false,
		archivedDate: null,
		streakFreezes: 0,
		graph: [{ year, daysChecked: [], manualDaysChecked: [] }],
		longestStreakDateSet: now,
	};
});

test("Test with new habit", () => {
	const isDone = isHabitDoneForToday(habit);

	expect(isDone).toBe(false);
});

test("Test where habit was checked before today", () => {
	habit.graph[0].daysChecked.push(addDays(now, -5));

	const isDone = isHabitDoneForToday(habit);

	expect(isDone).toBe(false);
});

test("Test where date is today", () => {
	habit.graph[0].daysChecked.push(startOfDay(now));

	const isDone = isHabitDoneForToday(habit);

	expect(isDone).toBe(true);
});
