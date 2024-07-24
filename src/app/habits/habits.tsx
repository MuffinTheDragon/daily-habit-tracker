"use client";

import { AddHabit } from "@/components/add-habit";
import { HabitCard } from "@/components/habit-card";
import { LicenseWarning } from "@/components/license-warning";
import { Login } from "@/components/login";
import { Settings } from "@/components/settings";
import { ToggleView } from "@/components/toggle-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import { isHabitDoneForToday } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Section } from "./section";
import { OfflineStatus } from "@/components/offline-status";

export const Habits = () => {
	const habits = useLiveQuery(() =>
		// sorted in descending order by created date
		db.habits.orderBy("created").reverse().toArray()
	);

	// grab the first user created
	const user = useLiveQuery(() => db.user.orderBy("created").first());

	const [showMap, setShowMap] = useState(false);

	const [dailyProgress, setDailyProgress] = useState(0);

	const [incompletedHabits, setIncompletedHabits] = useState<HabitType[]>([]);
	const [completedHabits, setCompletedHabits] = useState<HabitType[]>([]);
	const [archivedHabits, setArchivedHabits] = useState<HabitType[]>([]);

	const params = useSearchParams();

	// re-sync db on payment interaction
	useEffect(() => {
		const resync = async () => {
			if (params.get("payment")) {
				// @ts-ignore
				await db.$logins
					.toCollection()
					.modify({ accessTokenExpiration: new Date() });
			}
		};

		resync();
	}, [params]);

	useEffect(() => {
		if (habits) {
			const incompleted = habits.filter(
				(i) => !i.archived && !isHabitDoneForToday(i)
			);

			const archived = habits
				.filter((i) => i.archived)
				.sort(
					(a, b) =>
						b.archivedDate!.getTime() - a.archivedDate!.getTime()
				);

			const completed = habits.filter(
				(i) => !i.archived && isHabitDoneForToday(i)
			);

			setIncompletedHabits(incompleted);
			setArchivedHabits(archived);
			setCompletedHabits(completed);

			const totalHabits = completed.length + incompleted.length;

			setDailyProgress((completed.length / totalHabits) * 100);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [habits]);

	if (!habits || !user) return null;

	return (
		<>
			<Login />
			<LicenseWarning />

			<main className="flex flex-col items-center justify-between p-4 md:py-24 space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex justify-between items-center col-span-1 md:col-span-2 gap-4">
						<div className="space-y-4">
							<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
								My habits
							</h1>
							<h3 className="scroll-m-20 text-lg md:text-2xl font-semibold tracking-tight">
								{new Date().toDateString()}
							</h3>
						</div>
						<div className="flex items-center">
							<OfflineStatus />
							<Settings user={user} />
						</div>
					</div>
					<div className="flex items-center space-x-2 col-span-1 md:col-span-2">
						<Button
							variant="outline"
							onClick={() => setShowMap(!showMap)}
							className="w-fit col-span-1 lg:col-span-2 h-8 rounded-md px-3 text-xs md:h-9 md:px-4 md:py-2 md:text-sm"
						>
							{showMap ? "Hide map" : "Show map"}
						</Button>
						<AddHabit paused={user?.pauseStreaks ?? false} />
						<Separator
							orientation="vertical"
							className="h-8 bg-border"
						/>
						<ToggleView user={user} />
					</div>

					{user.pauseStreaks && (
						<Alert className="w-fut col-span-1 md:col-span-2">
							<AlertDescription>
								The app is currently paused. Change in settings
								to resume habit tracking
							</AlertDescription>
						</Alert>
					)}
					<Progress
						value={dailyProgress}
						className="col-span-1 md:col-span-2"
					/>

					{incompletedHabits.map((habit, i) => {
						const spanClass =
							i === incompletedHabits.length - 1 &&
							incompletedHabits.length % 2
								? "md:col-span-2"
								: "";
						return (
							<div key={habit.id} className={spanClass}>
								<HabitCard
									key={habit.id}
									habit={habit}
									user={user}
									showMap={showMap}
								/>
							</div>
						);
					})}

					<Section
						title="Completed"
						array={completedHabits}
						user={user}
						showMap={showMap}
					/>

					<Section
						title="Archived"
						array={archivedHabits}
						user={user}
						showMap={showMap}
					/>
				</div>
			</main>
		</>
	);
};
