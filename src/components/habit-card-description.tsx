import { CardTitle } from "@/components/ui/card";
import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import AutoGrowTextArea from "./auto-grow-textarea";
import { Button } from "./ui/button";

type Props = {
	model: HabitType;
};
export const HabitCardDescription = ({ ...props }: Props) => {
	const { model } = props;

	const [editingDescription, setEditingDescription] = useState(false);

	const updateDescription = async (val: string) => {
		await db.habits.update(model.id, { description: val });
	};

	return (
		<>
			{editingDescription ? (
				<div className="flex items-center space-x-2">
					<AutoGrowTextArea
						autoFocus
						value={model.description}
						onChange={(v) => updateDescription(v.target.value)}
					/>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setEditingDescription(false)}
					>
						<CheckCircleIcon className="h-6 w-6 text-green-600" />
					</Button>
				</div>
			) : (
				<div className="flex items-center space-x-2 min-w-full sm:max-w-sm">
					<CardTitle
						className="truncate text-pretty hover:cursor-text border border-background hover:border-border py-1 rounded w-full text-sm"
						onClick={() => setEditingDescription(true)}
					>
						{model.description
							? model.description
							: "Add a description"}
					</CardTitle>
				</div>
			)}
		</>
	);
};
