export type UserType = {
	id: string;
	created: Date;
	pauseStreaks?: boolean;
	pauseEndDate?: Date;
	pauseStartDate?: Date;
	pauses: { year: number; time: { start: Date; end: Date }[] }[];
	collapsed?: boolean;
};
