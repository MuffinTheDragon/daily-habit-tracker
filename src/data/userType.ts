export type UserType = {
	id: string;
	pauseStreaks: boolean;
	pauseEndDate?: Date;
	pauseStartDate?: Date;
	pauses: { year: number; time: { start: Date; end: Date }[] }[];
};
