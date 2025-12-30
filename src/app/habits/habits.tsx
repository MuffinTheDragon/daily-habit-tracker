"use client";

import { AddHabit } from "@/components/add-habit";
import { LicenseWarning } from "@/components/license-warning";
import { Login } from "@/components/login";
import { OfflineStatus } from "@/components/offline-status";
import { Settings } from "@/components/settings";
import { SortableHabitItem } from "@/components/sortable-habit-item";
import { ToggleView } from "@/components/toggle-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import { isHabitDoneForToday } from "@/lib/utils";
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Section } from "./section";

export const Habits = () => {
	const habits = useLiveQuery(async () => {
		const allHabits = await db.habits.toArray();
		// Create a copy of the array before sorting (Dexie returns read-only arrays)
		// Sort by order if available, otherwise by created date (for backward compatibility)
		return [...allHabits].sort((a, b) => {
			const orderA = a.order ?? Infinity;
			const orderB = b.order ?? Infinity;
			if (orderA !== Infinity || orderB !== Infinity) {
				const orderDiff = (orderA ?? 0) - (orderB ?? 0);
				// If orders are equal, use created date as tiebreaker for stability
				if (orderDiff === 0) {
					return b.created.getTime() - a.created.getTime();
				}
				return orderDiff;
			}
			return b.created.getTime() - a.created.getTime();
		});
	});

	// grab the first user created
	const user = useLiveQuery(() => db.user.orderBy("created").first());

	const [showMap, setShowMap] = useState(user?.showMap ?? false);

	const [dailyProgress, setDailyProgress] = useState(0);

	const [incompletedHabits, setIncompletedHabits] = useState<HabitType[]>([]);
	const [completedHabits, setCompletedHabits] = useState<HabitType[]>([]);
	const [archivedHabits, setArchivedHabits] = useState<HabitType[]>([]);

	const params = useSearchParams();

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		if (user?.showMap !== undefined) {
			setShowMap(user.showMap);
		}
	}, [user]);

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
			// Sort incompleted habits by order (they're already sorted from the query)
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

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		// Get current state to ensure we have the latest array
		setIncompletedHabits((currentHabits) => {
			const oldIndex = currentHabits.findIndex((h) => h.id === active.id);
			const newIndex = currentHabits.findIndex((h) => h.id === over.id);

			if (oldIndex === -1 || newIndex === -1) {
				return currentHabits;
			}

			// Use arrayMove to correctly handle the reordering
			const newHabits = arrayMove(currentHabits, oldIndex, newIndex);

			// Update order in database
			// Use a transaction to update all at once for better performance
			db.transaction("rw", db.habits, async () => {
				for (let i = 0; i < newHabits.length; i++) {
					await db.habits.update(newHabits[i].id, { order: i });
				}
			}).catch((error) => {
				console.error("Error updating habit order:", error);
			});

			return newHabits;
		});
	};

	if (!habits || !user) return null;

	const handleShowMap = (value: boolean) => {
		setShowMap(value);
		// @ts-ignore
		db.user.update(user.id, { showMap: value });
	};

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
							onClick={() => handleShowMap(!showMap)}
							className="w-fit col-span-1 lg:col-span-2 h-8 rounded-md px-3 text-xs md:h-9 md:px-4 md:py-2 md:text-sm"
						>
							{showMap ? "Hide map" : "Show map"}
						</Button>
						<Button
							variant="outline"
							asChild
							className="h-8 rounded-md px-3 md:h-9 md:px-4 md:py-2 md:text-sm"
						>
							<div className="relative">
								<Link
									href="/trends"
									className="inline-flex items-center rounded-md text-sm font-medium relative"
								>
									Analytics
								</Link>
								<span className="absolute -top-3 -right-2">
									<Badge
										variant="outline"
										className="bg-purple-500 text-white px-1 py-0.5 rounded-full leading-none"
									>
										Beta
									</Badge>
								</span>
							</div>
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

					<DndContext
						sensors={sensors}
						collisionDetection={closestCorners}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={incompletedHabits.map((h) => h.id)}
							strategy={rectSortingStrategy}
						>
							{incompletedHabits.map((habit, i) => {
								return (
									<SortableHabitItem
										key={habit.id}
										habit={habit}
										user={user}
										showMap={showMap}
									/>
								);
							})}
						</SortableContext>
					</DndContext>

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
