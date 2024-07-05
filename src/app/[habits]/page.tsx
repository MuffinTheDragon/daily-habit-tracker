"use client";

import { AddHabit } from "@/components/add-habit";
import { BaseNumberOfFreezes, HabitCard } from "@/components/habit-card";
import { Login } from "@/components/login";
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "@/components/responsive-dialog";
import { ThemePicker } from "@/components/theme-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { db } from "@/db";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export default function Home() {
	const habits = useLiveQuery(() => db.habits.orderBy("created").toArray());
	const user = useLiveQuery(() => db.user.toArray());
	const [showMap, setShowMap] = useState(false);

	if (!habits || !user) return null;

	const updatePause = async (value: boolean) => {
		db.transaction("rw", [db.habits, db.user], async () => {
			await db.user.where({ id: user[0].id }).modify((i) => {
				i.pauseStreaks = value;
			});
		});

		// if unpausing, reset freezes and last checked for all habits
		if (!value) {
			const allHabits = await db.habits.toArray();

			const modifiedHabits = allHabits.map((habit) => ({
				...habit,
				streakFreezes: BaseNumberOfFreezes,
				lastChecked: new Date(),
			}));

			await db.habits.bulkPut(modifiedHabits);
		}
	};

	return (
		<>
			<Login />
			<main className="flex flex-col items-center justify-between p-4 md:py-24 space-y-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="flex w-50 justify-between items-center col-span-1 lg:col-span-2">
						<div className="space-y-4">
							<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
								My habits
							</h1>
							<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
								{new Date().toDateString()}
							</h3>
						</div>

						<Credenza>
							<CredenzaTrigger asChild>
								<Button variant="outline" size="icon">
									<Cog6ToothIcon className="w-4 h-4" />
								</Button>
							</CredenzaTrigger>
							<CredenzaContent>
								<CredenzaHeader>
									<CredenzaTitle>Settings</CredenzaTitle>
								</CredenzaHeader>
								<div className="px-4 pb-4 md:p-0">
									<div className="flex justify-between items-center">
										<div>
											<p>Pause app</p>
											<p className="text-xs text-muted-foreground pe-24">
												If you are away or need a break,
												you can pause the app. This will
												also stop your streaks from
												breaking
											</p>
										</div>
										<Switch
											checked={user[0].pauseStreaks}
											onCheckedChange={updatePause}
										/>
									</div>
									<div className="flex justify-between items-center">
										<p>Theme</p>
										<ThemePicker />
									</div>
								</div>
							</CredenzaContent>
						</Credenza>
					</div>
					<Button
						variant="outline"
						onClick={() => setShowMap(!showMap)}
						className="w-fit col-span-1 lg:col-span-2"
					>
						{showMap ? "Hide map" : "Show map"}
					</Button>

					{user[0].pauseStreaks && (
						<Alert className="w-fut col-span-1 lg:col-span-2">
							<AlertDescription>
								The app is currently paused. Change in settings
								to resume habit tracking
							</AlertDescription>
						</Alert>
					)}
					{habits.map((habit) => (
						<HabitCard
							key={habit.id}
							habit={habit}
							showMap={showMap}
							paused={user[0].pauseStreaks}
						/>
					))}
					<AddHabit paused={user[0].pauseStreaks} />
				</div>
			</main>
		</>
	);
}
