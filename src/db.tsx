"use client";
import Dexie, { Table } from "dexie";
import { HabitType } from "./data/HabitType";
import dexieCloud from "dexie-cloud-addon";
import { defaultHabits } from "./data/defaultHabits";
import { UserType } from "./data/userType";

export class Db extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	habits!: Table<HabitType>;
	user!: Table<UserType>;

	constructor() {
		super("habit", { addons: [dexieCloud], cache: "immutable" });
		this.version(1).stores({
			habits: "id, created", // Primary key and indexed props
			user: "id",
		});
		this.on("populate", () => {
			this.on("ready", () => {
				return populate(this);
			});
		});

		this.cloud.configure({
			databaseUrl: process.env.NEXT_PUBLIC_DBURL!,
			tryUseServiceWorker: true, // true!
			requireAuth: false, // optional
			customLoginGui: true,
		});
	}
}

export const db = new Db();

async function populate(db: Db) {
	// const habitsCount = await db.habits.count();
	const userCount = await db.user.count();

	// if (habitsCount == 0) {
	// await db.habits.bulkAdd(defaultHabits);
	// }

	if (userCount == 0) {
		// await db.user.add({ id: "user", pauseStreaks: false });
	}
}
