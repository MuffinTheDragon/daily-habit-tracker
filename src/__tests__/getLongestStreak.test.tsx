import { HabitType } from "@/data/HabitType";
import { getCurrentDate, getLongestStreak } from "@/lib/utils";
import { addDays } from "date-fns";
import { beforeEach, expect, test } from "vitest";

const now = getCurrentDate();

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
		graph: [],
		longestStreakDateSet: now,
	};
});

test("Get longest streak on initial check", () => {
	const { longestStreak, longestStreakDateSet } = getLongestStreak(habit, 1);

	// streak increments by 1 => longest streak should update
	expect(longestStreak).toBe(1);
	expect(longestStreakDateSet).toEqual(now);
});

test("Get longest streak increments properly", () => {
	habit.longestStreak = 1;
	habit.longestStreakDateSet = addDays(now, -3);

	const { longestStreak, longestStreakDateSet } = getLongestStreak(habit, 2);

	// streak increments by 1 => longest should update
	expect(longestStreak).toBe(2);
	expect(longestStreakDateSet).toEqual(now);
});

test("Current streak is less than longest streak", () => {
	expect(habit.longestStreak).toBe(0);

	const previousDate = addDays(now, -3);

	habit.longestStreak = 10;
	habit.longestStreakDateSet = previousDate;

	const { longestStreak, longestStreakDateSet } = getLongestStreak(habit, 3);

	// streak increments but is < longest => no update
	expect(longestStreak).toBe(10);
	expect(longestStreakDateSet).toEqual(previousDate);
});
