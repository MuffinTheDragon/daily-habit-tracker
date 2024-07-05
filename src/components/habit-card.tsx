"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import {
	diffInDaysFromNow,
	getCurrentDate,
	getDateByDayNumber,
	getDayOfYear,
} from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { isEqual } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Graph } from "./graph";
import { HabitCardDescription } from "./habit-card-description";
import { HabitCardStats } from "./habit-card-stats";
import { HabitCardTitle } from "./habit-card-title";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";

export const BaseNumberOfFreezes = 3;

export const HabitCard = ({
	habit,
	showMap,
	paused,
}: {
	habit: HabitType;
	showMap: boolean;
	paused: boolean;
}) => {
	const [model, setModel] = useState<HabitType>(habit);
	const [editingTitle, setEditingTitle] = useState(false);
	const [editingDescription, setEditingDescription] = useState(false);

	const [showAlert, setShowAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");

	const [initialFreezes, setInitialFreezes] = useState(BaseNumberOfFreezes);

	const hasPageBeenRendered = useRef(false);

	useEffect(() => {
		if (JSON.stringify(habit) !== JSON.stringify(model)) {
			setModel(habit);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [habit]);

	// compute streak
	useEffect(() => {
		if (paused) return;

		if (model.streak < 1) return;

		const diff = diffInDaysFromNow(model.lastChecked);

		if (diff > 1) {
			// don't consider today in the calculation => we do -1
			const newStreakFreezes = BaseNumberOfFreezes - (diff - 1);

			if (newStreakFreezes < 0) {
				setModel({
					...model,
					streak: 0,
					streakFreezes: BaseNumberOfFreezes,
				});
				toast.error("Attention!", {
					duration: Infinity,
					description: (
						<p>
							Your habit <b className="underline">{habit.name}</b>{" "}
							ran out of streak freezes. Your streak has been
							reset.
						</p>
					),
					closeButton: true,
				});
			} else {
				setModel({
					...model,
					streakFreezes: newStreakFreezes,
				});
				toast.warning("Careful!", {
					duration: Infinity,
					closeButton: true,
					description: (
						<p>
							You missed {diff - 1} day(s) for your{" "}
							<b className="underline">{habit.name}</b> habit and
							used up a streak freeze. If you run out, your streak
							will reset.
						</p>
					),
				});
				setInitialFreezes(newStreakFreezes);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (hasPageBeenRendered.current) {
			db.habits.put(model, model.id);
		}

		hasPageBeenRendered.current = true;
	}, [model]);

	const markHabit = (v: CheckedState) => {
		if (paused) return;

		const checked = v ? true : false;

		const graph = [...model.graph];
		setShowAlert(!checked);

		const currentYear = new Date().getFullYear();
		const dayOfYear = getDayOfYear();

		// create new graph since current year doesn't exist
		if (graph.at(-1)?.year != currentYear) {
			graph.push({ year: currentYear, daysChecked: [dayOfYear] });
		} else {
			// checking
			if (checked) {
				graph.at(-1)!.daysChecked.push(dayOfYear);
			}

			// unchecking
			else {
				graph.at(-1)!.daysChecked.pop();
			}
		}

		// compute lastChecked date
		// its either the day just pushed or when the habit was created
		const lastCheckedDay = graph.at(-1)?.daysChecked.at(-1);

		const lastCheckedDate = lastCheckedDay
			? getDateByDayNumber(lastCheckedDay)
			: model.created;

		const newStreak = checked ? model.streak + 1 : model.streak - 1;

		let longestStreak = model.longestStreak;
		let longestStreakDateSet = model.longestStreakDateSet;

		const now = getCurrentDate();

		if (newStreak > model.longestStreak) {
			longestStreak = newStreak;
			longestStreakDateSet = now;
		} else if (isEqual(longestStreakDateSet, now)) {
			longestStreak -= 1;
		}

		setModel({
			...model,
			graph,
			streak: newStreak,
			longestStreak,
			longestStreakDateSet,
			streakFreezes: checked ? BaseNumberOfFreezes : initialFreezes,
			checks: checked ? model.checks + 1 : model.checks - 1,
			lastChecked: lastCheckedDate,
		});
	};

	return (
		<Card className="relative min-w-80 sm:min-w-96 flex flex-col">
			{habit.archived && (
				<Badge
					variant="secondary"
					className="absolute rounded-full top-0 end-0 inline-flex -mt-2"
				>
					Archived
				</Badge>
			)}
			<CardHeader className="flex-1">
				<HabitCardTitle
					props={{
						editingTitle,
						setEditingTitle,
						model,
						setModel,
						markHabit,
						paused,
					}}
				/>
				<CardDescription>
					<HabitCardDescription
						props={{
							editingDescription,
							setEditingDescription,
							model,
							setModel,
						}}
					/>
					{showAlert && alertMsg && (
						<Alert className="my-4" variant="destructive">
							<AlertTitle>Careful!</AlertTitle>
							<AlertDescription className="text-sm">
								{alertMsg}
							</AlertDescription>
						</Alert>
					)}
					<div className="flex mt-2 justify-between">
						<HabitCardStats habit={model} />
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				{showMap && (
					<div className="mt-8">
						<Graph graph={habit.graph} />
					</div>
				)}
			</CardContent>
			<CardFooter>
				<div className="flex flex-col space-y-1 text-xs text-muted-foreground">
					<p>Created: {model.created.toDateString()}</p>
					{/* <p>Last checked: {model.lastChecked.toDateString()}</p> */}
				</div>
			</CardFooter>
		</Card>
	);
};
