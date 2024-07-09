export type UserType = {
	id: string;
	pauseStreaks: boolean;
	pauseStartDate: Date | null;
	pauseEndDate: Date | null;
	pauses: { start: Date; end: Date }[];
};
