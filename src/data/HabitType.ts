export type GraphType = {
	year: number;
	daysChecked: number[];
};

export type HabitType = {
	id: string;
	created: Date;
	name: string;
	description: string;
	streak: number;
	checks: number;
	archived: boolean;
	archivedDate: Date | null;
	streakFreezes: number;
	lastChecked: Date;
	graph: GraphType[];
};
