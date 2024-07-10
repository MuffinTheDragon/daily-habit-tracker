import { diffInDaysFromNow, getCurrentDate } from "@/lib/utils";
import { addDays } from "date-fns";
import { expect, test } from "vitest";

const now = getCurrentDate();

test("Test where date is today", () => {
	const diff = diffInDaysFromNow(now);

	expect(diff).toBe(0);
});

test("Test where date is yesterday", () => {
	const previous = addDays(now, -1);

	const diff = diffInDaysFromNow(previous);

	expect(diff).toBe(1);
});

test("Test where date is 3 days ago", () => {
	const previous = addDays(now, -3);

	const diff = diffInDaysFromNow(previous);

	expect(diff).toBe(3);
});

test("Test where date is 3 days ago", () => {
	const previous = addDays(now, -3);

	const diff = diffInDaysFromNow(previous);

	expect(diff).toBe(3);
});
