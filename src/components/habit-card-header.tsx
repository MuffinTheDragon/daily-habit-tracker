import { CardTitle } from "@/components/ui/card";
import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import {
	cn,
	getCurrentDate,
	getLongestStreak,
	getStreakFreezes,
	isHabitDoneForToday,
} from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckedState } from "@radix-ui/react-checkbox";
import confetti from "canvas-confetti";
import { useState } from "react";
import { BaseNumberOfFreezes } from "./habit-card";
import { HabbitCardActions } from "./habit-card-actions";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

type Props = {
	model: HabitType;
	initialFreezes: number;
	paused: boolean;
};

export const HabitCardHeader = ({ ...props }: Props) => {
	const { model, initialFreezes, paused } = props;

	const [editingTitle, setEditingTitle] = useState(false);

	const isDoneForToday = isHabitDoneForToday(model);

	const markHabit = async (v: CheckedState) => {
		if (paused) return;

		const checked = v ? true : false;

		const graph = [...model.graph];

		const currentYear = new Date().getFullYear();
		const currentDate = getCurrentDate();

		// create new graph since current year doesn't exist
		if (graph.at(-1)?.year != currentYear) {
			graph.push({
				year: currentYear,
				daysChecked: [currentDate],
				manualDaysChecked: [],
			});
		} else {
			// checking
			if (checked) {
				graph.at(-1)!.daysChecked.push(currentDate);
			}

			// unchecking
			else {
				graph.at(-1)!.daysChecked.pop();
			}
		}

		const newStreak = checked ? model.streak + 1 : model.streak - 1;

		const { longestStreak, longestStreakDateSet } = getLongestStreak(
			model,
			newStreak
		);

		await db.habits.update(model.id, {
			graph,
			streak: newStreak,
			longestStreak,
			longestStreakDateSet,
			streakFreezes: checked
				? getStreakFreezes(newStreak)
				: initialFreezes,
			checks: checked ? model.checks + 1 : model.checks - 1,
		});
	};

	const onCheckChange = (value: CheckedState) => {
		if (value) {
			const audio = new Audio("/complete-sound.mp3");
			audio.play();
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}

		markHabit(value);
	};

	const updateName = async (val: string) => {
		await db.habits.update(model.id, { name: val });
	};

	return (
		<>
			{editingTitle ? (
				<div className="flex items-center space-x-2">
					<Input
						autoFocus
						value={model.name}
						onChange={(v) => updateName(v.target.value)}
					/>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setEditingTitle(false)}
					>
						<CheckCircleIcon className="h-6 w-6 text-green-600" />
					</Button>
				</div>
			) : (
				<div className="flex items-center space-x-2 min-w-full sm:max-w-sm">
					<CardTitle
						className={cn(
							"hover:cursor-text border border-background hover:border-border py-1 rounded w-full md:text-xl truncate",
							{ "line-through": isDoneForToday }
						)}
						onClick={() => setEditingTitle(true)}
					>
						{model.name}
					</CardTitle>
					<div className="flex space-x-2 items-center">
						<Checkbox
							disabled={paused}
							checked={isDoneForToday}
							className="rounded-full h-5 w-5 md:w-6 md:h-6 border-gray-500"
							onCheckedChange={onCheckChange}
						/>
						<HabbitCardActions model={model} paused={paused} />
					</div>
				</div>
			)}
		</>
	);
};
