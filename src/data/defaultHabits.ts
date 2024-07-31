import { getCurrentDate } from "@/lib/utils";
import { HabitType } from "./HabitType";

export const defaultHabits: HabitType[] = [
	{
		id: "1",
		created: new Date("2019 01 05"),
		name: "Walk daily",
		description: "",
		streak: 432,
		longestStreak: 450,
		longestStreakDateSet: new Date(),
		checks: 503,
		archived: false,
		archivedDate: null,
		streakFreezes: 1,
		graph: [
			{
				year: 2024,
				daysChecked: [getCurrentDate()],
				manualDaysChecked: [],
			},
		],
	},
	{
		id: "2",
		created: new Date("2024 01 01"),
		name: "Read for 10 minutes",
		description: "",
		streak: 11,
		longestStreak: 12,
		longestStreakDateSet: new Date(),
		checks: 14,
		archived: false,
		archivedDate: null,
		streakFreezes: 3,
		graph: [
			{
				year: 2024,
				daysChecked: [
					new Date("2024 01 07"),
					new Date("2024 01 09"),
					new Date("2024 01 10"),
					new Date("2024 01 11"),
					new Date("2024 01 14"),
					new Date("2024 01 15"),
					new Date("2024 01 18"),
					new Date("2024 01 19"),
					new Date("2024 01 20"),
					new Date("2024 01 21"),
					new Date("2024 01 23"),
					new Date("2024 01 29"),
				],
				manualDaysChecked: [
					new Date("2024 01 12"),
					new Date("2024 01 13"),
				],
			},
		],
	},
];
