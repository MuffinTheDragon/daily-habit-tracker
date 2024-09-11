export type UserType = {
	id: string;
	created: Date;
	pauseStreaks?: boolean;
	pauseEndDate?: Date;
	pauseStartDate?: Date;
	pauses: [Date, Date][];
	collapsed?: boolean;
	warningDismissDate?: Date;
};
