"use client";

import { AddHabit } from "@/components/add-habit";
import { HabitCard } from "@/components/habit-card";
import { Login } from "@/components/login";
import { Settings } from "@/components/settings";
import { ToggleView } from "@/components/toggle-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export default function Home() {
	const habits = useLiveQuery(() =>
		db.habits.orderBy("created").reverse().toArray()
	);

	const user = useLiveQuery(() => db.user.toCollection().first());
	const [showMap, setShowMap] = useState(false);

	if (!habits) return null;

	return (
		<>
			<Login />
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

						<Settings user={user} />
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

					{user?.pauseStreaks && (
						<Alert className="w-fut col-span-1 md:col-span-2">
							<AlertDescription>
								The app is currently paused. Change in settings
								to resume habit tracking
							</AlertDescription>
						</Alert>
					)}
					{habits.map((habit, i) => {
						const spanClass =
							i === habits.length - 1 && habits.length % 2
								? "md:col-span-2"
								: "";
						return (
							<div key={habit.id} className={spanClass}>
								<HabitCard
									key={habit.id}
									habit={habit}
									user={user}
									showMap={showMap}
									paused={
										user?.pauseStreaks || habit.archived
									}
								/>
							</div>
						);
					})}
				</div>
			</main>
		</>
	);
}
