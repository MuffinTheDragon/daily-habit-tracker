import { getCurrentDate, isHabitDoneForToday } from "@/lib/utils";
import { addDays } from "date-fns";
import { expect, test } from "vitest";

const now = getCurrentDate();

test("Test with undefined date", () => {
	const isDone = isHabitDoneForToday(undefined);

	expect(isDone).toBe(false);
});

test("Test where date is < today", () => {
	const previous = addDays(now, -5);

	const isDone = isHabitDoneForToday(previous);

	expect(isDone).toBe(false);
});

test("Test where date is today", () => {
	const isDone = isHabitDoneForToday(now);

	expect(isDone).toBe(true);
});
