"use client";
import Dexie, { Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { v4 as uuidv4 } from "uuid";
import { HabitType } from "./data/HabitType";
import { UserType } from "./data/userType";

export class Db extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	habits!: Table<HabitType>;
	user!: Table<UserType>;

	constructor() {
		super("habit", { addons: [dexieCloud], cache: "immutable" });
		this.version(2)
			.stores({
				habits: "id, created", // Primary key and indexed props
				user: "id, created",
			})
			.upgrade((tx) => {
				return tx
					.table("user")
					.toCollection()
					.modify((user) => {
						user.id = uuidv4();
						user.created = new Date();
					});
			});
		this.on("populate", () => {
			this.on("ready", () => {});
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
