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
import {
	cn,
	diffInDaysFromNow,
	getCurrentDate,
	getLastUpdatedDate,
	getStreakFreezes,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Graph } from "./graph";
import { HabitCardDescription } from "./habit-card-description";
import { HabitCardHeader } from "./habit-card-header";
import { HabitCardStats } from "./habit-card-stats";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { isEqual } from "date-fns";

export const BaseNumberOfFreezes = 3;

type Props = {
	habit: HabitType;
	user: UserType;
	showMap: boolean;
};

export const HabitCard = ({ ...props }: Props) => {
	const { habit, user, showMap } = props;

	const initalFreezes = getStreakFreezes(habit.streak);
	const [initialFreezes, setInitialFreezes] = useState(initalFreezes);

	const paused = user.pauseStreaks || habit.archived;

	// compute streak freezes
	useEffect(() => {
		const updateStreaks = async () => {
			if (paused || habit.streak < 1 || habit.streaksDisabled) return;

			// compute last active date
			const lastUpdated = getLastUpdatedDate(
				habit.graph,
				habit.created,
				user.pauseEndDate
			);

			const diff = diffInDaysFromNow(lastUpdated);

			if (diff <= 1) return;

			// don't consider today in the calculation => we do -1
			const newStreakFreezes = initalFreezes - (diff - 1);

			const showWarningAlert =
				!user.warningDismissDate ||
				!isEqual(user.warningDismissDate, getCurrentDate());

			if (newStreakFreezes < 0) {
				await db.habits.update(habit.id, {
					streak: 0,
					streakFreezes: getStreakFreezes(0),
				});

				toast.error("Attention!", {
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
				await db.habits.update(habit.id, {
					streakFreezes: newStreakFreezes,
				});

				if (showWarningAlert)
					toast.warning("Careful!", {
						closeButton: true,
						onDismiss: async () =>
							await db.user.update(user.id, {
								// @ts-ignore
								warningDismissDate: getCurrentDate(),
							}),
						description: (
							<p>
								You missed {diff - 1} day(s) for your{" "}
								<b className="underline">{habit.name}</b> habit
								and used up some of your streak freezes. If you
								run out, your streak will reset.
							</p>
						),
					});
				setInitialFreezes(newStreakFreezes);
			}
		};

		updateStreaks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Card className="relative min-w-[90vw] sm:min-w-96 flex flex-col h-full">
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
					model={habit}
					initialFreezes={initialFreezes}
					paused={paused}
				/>

				{!user.collapsed && (
					<CardDescription>
						<HabitCardDescription model={habit} />
						<div className="flex mt-2 justify-between">
							<HabitCardStats habit={habit} />
						</div>
					</CardDescription>
				)}
				{user.collapsed && (
					<div className="text-sm flex space-x-2 items-center text-muted-foreground">
						{!habit.streaksDisabled && (
							<>
								<div>Streak: {habit.streak}</div>
								<Separator
									orientation="vertical"
									className="h-4"
								/>
							</>
						)}
						<div>Checks: {habit.checks}</div>
						{!habit.streaksDisabled && (
							<>
								<Separator
									orientation="vertical"
									className="h-4"
								/>

								<div>Freezes: {habit.streakFreezes}</div>
							</>
						)}
					</div>
				)}
			</CardHeader>

			{showMap && (
				<CardContent>
					<Graph graph={habit.graph} habit={habit} user={user} />
				</CardContent>
			)}

			{!user.collapsed && (
				<CardFooter className="mt-4">
					<div className="flex flex-col space-y-1 text-xs text-muted-foreground">
						{habit.streaksDisabled && (
							<p>Streak tracking is disabled</p>
						)}
						<p>Created: {habit.created.toDateString()}</p>
						{habit.archivedDate && (
							<p>Archived: {habit.archivedDate.toDateString()}</p>
						)}
						{/* <p>Last update: {model.lastChecked.toDateString()}</p> */}
					</div>
				</CardFooter>
			)}
		</Card>
	);
};
