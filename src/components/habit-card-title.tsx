import { CardTitle } from "@/components/ui/card";
import { HabitType } from "@/data/HabitType";
import { cn, getCurrentDate, getDayOfYear } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckedState } from "@radix-ui/react-checkbox";
import confetti from "canvas-confetti";
import { Dispatch, SetStateAction } from "react";
import { HabbitCardActions } from "./habit-card-actions";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { isEqual } from "date-fns";

type Props = {
	editingTitle: boolean;
	setEditingTitle: Dispatch<SetStateAction<boolean>>;
	model: HabitType;
	setModel: Dispatch<SetStateAction<HabitType>>;
	markHabit: (v: CheckedState) => void;
	paused: boolean;
};

export const HabitCardTitle = ({ props }: { props: Props }) => {
	const currentDate = getCurrentDate();

	const {
		editingTitle,
		model,
		setModel,
		setEditingTitle,
		markHabit,
		paused,
	} = props;

	const lastCheckedDate = model.graph.at(-1)?.daysChecked.at(-1);
	const isDoneForToday = lastCheckedDate
		? isEqual(lastCheckedDate, currentDate)
		: false;

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

	return (
		<>
			{editingTitle ? (
				<div className="flex items-center space-x-2">
					<Input
						autoFocus
						value={model.name}
						onChange={(v) =>
							setModel({ ...model, name: v.target.value })
						}
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
				<div className="flex items-center space-x-2">
					<CardTitle
						className={cn(
							"hover:cursor-text border border-background hover:border-border py-1 rounded w-full text-xl",
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
							className="rounded-full w-6 h-6 border-gray-500"
							onCheckedChange={onCheckChange}
						/>
						<HabbitCardActions
							model={model}
							setModel={setModel}
							paused={paused}
						/>
					</div>
				</div>
			)}
		</>
	);
};
