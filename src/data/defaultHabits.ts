import { HabitType } from "./HabitType";

const year = new Date().getFullYear();

export const defaultHabits: HabitType[] = [
	{
		id: "1",
		created: new Date(),
		lastChecked: new Date(),
		name: "Daily habit",
		description: "",
		streak: 0,
		longestStreak: 0,
		longestStreakDateSet: new Date(),
		checks: 0,
		archived: false,
		archivedDate: null,
		streakFreezes: 3,
		graph: [{ year, daysChecked: [] }],
	},
	{
		id: "2",
		created: new Date(),
		lastChecked: new Date(),
		name: "Daily habit 2",
		description: "Habit description",
		streak: 5,
		longestStreak: 0,
		longestStreakDateSet: new Date(),
		checks: 0,
		archived: false,
		archivedDate: null,
		streakFreezes: 3,
		graph: [
			{ year: 2017, daysChecked: [39, 40, 55] },
			{ year, daysChecked: [1, 18, 37] },
		],
	},
];
