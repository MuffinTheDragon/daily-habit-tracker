import { CardTitle } from "@/components/ui/card";

import { HabitType } from "@/data/HabitType";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";
import AutoGrowTextArea from "./auto-grow-textarea";
import { Button } from "./ui/button";

type Props = {
	editingDescription: boolean;
	setEditingDescription: Dispatch<SetStateAction<boolean>>;
	model: HabitType;
	setModel: Dispatch<SetStateAction<HabitType>>;
};
export const HabitCardDescription = ({ props }: { props: Props }) => {
	const { editingDescription, model, setModel, setEditingDescription } =
		props;
	return (
		<>
			{editingDescription ? (
				<div className="flex items-center space-x-2">
					<AutoGrowTextArea
						autoFocus
						value={model.description}
						onChange={(v) =>
							setModel({
								...model,
								description: v.target.value,
							})
						}
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
				<div className="flex items-center space-x-2">
					<CardTitle
						className="break-words text-pretty hover:cursor-text border border-background hover:border-border py-1 rounded w-full text-sm"
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
