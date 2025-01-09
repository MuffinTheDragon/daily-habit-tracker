"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

import { HabitType } from "@/data/HabitType";
import { UserType } from "@/data/userType";
import { db } from "@/db";
import { cn, diffInDaysFromNow, getLastUpdatedDate } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Graph } from "./graph";
import { HabitCardDescription } from "./habit-card-description";
import { HabitCardHeader } from "./habit-card-header";
import { HabitCardStats } from "./habit-card-stats";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export const BaseNumberOfFreezes = 3;

type Props = {
	habit: HabitType;
	user: UserType;
	showMap: boolean;
};

export const HabitCard = ({ ...props }: Props) => {
	const { habit, user, showMap } = props;

	const [model, setModel] = useState<HabitType>(habit);

	const [initialFreezes, setInitialFreezes] = useState(BaseNumberOfFreezes);

	const hasPageBeenRendered = useRef(false);

	const paused = user.pauseStreaks || model.archived;

	/**
	 * if the model updates outside of inital page render, write to db
	 */
	useEffect(() => {
		const updateDb = async () => {
			if (hasPageBeenRendered.current) {
				await db.habits.put(model, model.id);
			}

			hasPageBeenRendered.current = true;
		};
		updateDb();
	}, [model]);

	/**
	 * if the data from db doesn't match model, update model
	 * used when data is mutated outside this component
	 */
	useEffect(() => {
		if (JSON.stringify(habit) !== JSON.stringify(model)) {
			setModel(habit);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [habit]);

	// compute streak freezes
	useEffect(() => {
		if (paused) return;

		if (model.streak < 1) return;

		// compute last active date
		const lastUpdated = getLastUpdatedDate(
			model.graph,
			model.created,
			user.pauseEndDate
		);

		const diff = diffInDaysFromNow(lastUpdated);

		if (diff <= 1) return;

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
						Your habit <b className="underline">{habit.name}</b> ran
						out of streak freezes. Your streak has been reset.
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
						<b className="underline">{habit.name}</b> habit and used
						up a streak freeze. If you run out, your streak will
						reset.
					</p>
				),
			});
			setInitialFreezes(newStreakFreezes);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [model.streak]);

	return (
		<Card className="relative min-w-[90vw] sm:min-w-96 flex flex-col">
			{habit.archived && (
				<Badge
					variant="secondary"
					className="absolute rounded-full top-0 end-0 inline-flex -mt-2"
				>
					Archived
				</Badge>
			)}

			<CardHeader
				className={cn("flex-1", { "px-4 py-2": user.collapsed })}
			>
				<HabitCardHeader
					model={model}
					setModel={setModel}
					initialFreezes={initialFreezes}
					paused={paused}
				/>

				{!user.collapsed && (
					<CardDescription>
						<HabitCardDescription {...{ model, setModel }} />
						<div className="flex mt-2 justify-between">
							<HabitCardStats habit={model} />
						</div>
					</CardDescription>
				)}
				{user.collapsed && (
					<div className="text-sm flex space-x-4 items-center text-muted-foreground">
						<div>Streak: {model.streak}</div>
						<Separator orientation="vertical" className="h-4" />
						<div>Checks: {habit.checks}</div>
					</div>
				)}
			</CardHeader>

			{showMap && (
				<CardContent>
					<Graph graph={habit.graph} habit={habit} />
				</CardContent>
			)}

			{!user.collapsed && (
				<CardFooter className="mt-4">
					<div className="flex flex-col space-y-1 text-xs text-muted-foreground">
						<p>Created: {model.created.toDateString()}</p>
						{model.archivedDate && (
							<p>Archived: {model.archivedDate.toDateString()}</p>
						)}
						{/* <p>Last update: {model.lastChecked.toDateString()}</p> */}
					</div>
				</CardFooter>
			)}
		</Card>
	);
};
