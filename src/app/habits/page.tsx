"use client";

import { Spinner } from "@/components/spinner";
import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Habits } from "./habits";

export default function Home() {
	db.open();

	const syncState = useObservable(db.cloud.syncState);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const sync = async () => {
			if (syncState?.status === "connected") {
				try {
					await db.cloud.sync({ purpose: "pull", wait: true });
				} catch (error) {
					console.log(error);
				} finally {
					setLoading(false);
				}
			} else if (syncState?.status === "offline") setLoading(false);
		};

		sync();
	}, [syncState?.status]);

	if (loading) return <Spinner />;

	return <Habits />;
}
