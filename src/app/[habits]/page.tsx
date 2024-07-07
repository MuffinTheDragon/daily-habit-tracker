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
import { getCurrentDate } from "@/lib/utils";
import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	const userId = db.cloud.currentUserId;
	const habits = useLiveQuery(() => db.habits.orderBy("created").toArray());
	const user = useLiveQuery(() => db.user.toArray());
	const [showMap, setShowMap] = useState(false);

	const currentYear = new Date().getFullYear();
	const currentDate = getCurrentDate();

	if (!habits || !user) return null;

	const updatePause = async (value: boolean) => {
		db.transaction("rw", [db.habits, db.user], async () => {
			if (user[0]) {
				// start pause
				if (value) {
					const pauses = [...user[0].pauses];

					if (pauses.at(-1)?.year !== currentYear) {
						pauses.push({ year: currentYear, time: [] });
					}

					await db.user.where({ id: user[0].id }).modify((i) => {
						i.pauseStreaks = value;
						i.pauseStartDate = currentDate;
						i.pauses = pauses;
					});
				}

				// end pause
				else {
					const pauses = [...user[0].pauses];

					pauses.at(-1)?.time.push({
						start: user[0].pauseStartDate!,
						end: currentDate,
					});

					await db.user.where({ id: user[0].id }).modify((i) => {
						i.pauseStreaks = value;
						i.pauseEndDate = currentDate;
						i.pauses = pauses;
					});
				}
			} else {
				await db.user.add({
					id: "user",
					pauseStreaks: value,
					pauseStartDate: currentDate,
					pauses: [{ year: currentYear, time: [] }],
				});
			}
		});
	};

	const onToggleChange = async (value: string) => {
		const collapsed = value === "0" ? true : false;

		if (user[0]) {
			db.user.where({ id: user[0].id }).modify((i) => {
				i.collapsed = collapsed;
			});
		} else {
			await db.user.add({
				id: "user",
				pauseStreaks: false,
				pauses: [{ year: currentYear, time: [] }],
				collapsed,
			});
		}
	};

	const logout = async () => {
		await db.cloud.logout();
		// await db.user.add({ id: "user", pauseStreaks: false });

		toast.success("Success! You are logged out", {
			closeButton: true,
		});
	};

	return (
		<>
			<Login />
			<main className="flex flex-col items-center justify-between p-4 md:py-24 space-y-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="flex justify-between items-center col-span-1 lg:col-span-2 gap-4">
						<div className="space-y-4">
							<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
								My habits
							</h1>
							<h3 className="scroll-m-20 text-lg md:text-2xl font-semibold tracking-tight">
								{new Date().toDateString()}
							</h3>
						</div>

						<Credenza>
							<CredenzaTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="ms-4"
								>
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
											checked={user[0]?.pauseStreaks}
											onCheckedChange={updatePause}
										/>
									</div>
									<div className="flex justify-between items-center">
										<p>Theme</p>
										<ThemePicker />
									</div>
									{userId !== "unauthorized" && (
										<Button
											onClick={logout}
											variant="secondary"
											size="sm"
											className="mt-4 w-full"
										>
											Logout
										</Button>
									)}
								</div>
							</CredenzaContent>
						</Credenza>
					</div>
					<div className="flex items-center space-x-2 col-span-1 lg:col-span-2">
						<Button
							variant="outline"
							onClick={() => setShowMap(!showMap)}
							className="w-fit col-span-1 lg:col-span-2 h-8 rounded-md px-3 text-xs md:h-9 md:px-4 md:py-2 md:text-sm"
						>
							{showMap ? "Hide map" : "Show map"}
						</Button>
						<AddHabit paused={user[0]?.pauseStreaks ?? false} />
						<Separator
							orientation="vertical"
							className="h-8 bg-border"
						/>
						<ToggleGroup
							value={user[0]?.collapsed ? "0" : "1"}
							onValueChange={onToggleChange}
							type="single"
							className="rounded-lg border"
						>
							<ToggleGroupItem value="0" title="Collapse habits">
								<ArrowsPointingInIcon className="w-4 h-4" />
							</ToggleGroupItem>
							<Separator
								orientation="vertical"
								className="h-4 bg-border"
							/>
							<ToggleGroupItem value="1" title="Expand habits">
								<ArrowsPointingOutIcon className="w-4 h-4" />
							</ToggleGroupItem>
						</ToggleGroup>
					</div>

					{user[0]?.pauseStreaks && (
						<Alert className="w-fut col-span-1 lg:col-span-2">
							<AlertDescription>
								The app is currently paused. Change in settings
								to resume habit tracking
							</AlertDescription>
						</Alert>
					)}
					{habits.map((habit, i) => {
						const spanClass =
							i === habits.length - 1 && habits.length % 2
								? "lg:col-span-2"
								: "";
						return (
							<div key={habit.id} className={spanClass}>
								<HabitCard
									key={habit.id}
									habit={habit}
									user={user[0]}
									showMap={showMap}
									paused={
										user[0]?.pauseStreaks || habit.archived
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
