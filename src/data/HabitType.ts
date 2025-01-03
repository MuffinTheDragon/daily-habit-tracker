export type GraphType = {
	year: number;
	daysChecked: number[];
	manualDaysChecked: number[];
};

export type HabitType = {
	id: string;
	created: Date;
	name: string;
	description: string;
	streak: number;
	longestStreak: number;
	longestStreakDateSet: Date;
	checks: number;
	archived: boolean;
	archivedDate: Date | null;
	streakFreezes: number;
	lastChecked: Date;
	graph: GraphType[];
};
