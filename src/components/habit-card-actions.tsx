import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { addDays, format, getDayOfYear } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import {
	Credenza,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "./responsive-dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

enum Dialogs {
	"deleteHabit",
	"addCheck",
}

export const HabbitCardActions = ({
	model,
	setModel,
	paused,
}: {
	model: HabitType;
	setModel: Dispatch<SetStateAction<HabitType>>;
	paused: boolean;
}) => {
	const [dialog, setDialog] = useState(Dialogs.addCheck);

	return (
		<Credenza>
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={paused}>
					<Button variant="ghost" size="icon">
						<EllipsisVerticalIcon className="w-5 h-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<CredenzaTrigger
						asChild
						onClick={() => setDialog(Dialogs.addCheck)}
					>
						<DropdownMenuItem>
							<span className="flex items-center">
								<CalendarDaysIcon className="w-4 h-4 me-2" />
								Add check
							</span>
						</DropdownMenuItem>
					</CredenzaTrigger>
					<CredenzaTrigger
						asChild
						onClick={() => setDialog(Dialogs.deleteHabit)}
					>
						<DropdownMenuItem>
							<span className="flex items-center">
								<TrashIcon className="w-4 h-4 me-2" />
								Delete
							</span>
						</DropdownMenuItem>
					</CredenzaTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			{dialog === Dialogs.deleteHabit ? (
				<DeleteHabit model={model} />
			) : (
				<FillPreviousDays model={model} setModel={setModel} />
			)}
		</Credenza>
	);
};

const FillPreviousDays = ({
	model,
	setModel,
}: {
	model: HabitType;
	setModel: Dispatch<SetStateAction<HabitType>>;
}) => {
	const [date, setDate] = useState<Date | undefined>(undefined);

	const currentYear = new Date().getFullYear();

	const addDay = async () => {
		if (!date) return;

		const dayNumber = getDayOfYear(date);

		const graph = [...model.graph];

		if (graph.at(-1)!.daysChecked.includes(dayNumber)) return;

		graph.at(-1)!.daysChecked.push(dayNumber);

		setModel({ ...model, graph, checks: model.checks + 1 });

		setDate(undefined);
	};

	const isDayDisabled = (day: Date) => {
		if (day < addDays(model.created, -1)) {
			return true;
		}

		const dayNumber = getDayOfYear(day);

		if (model.graph.at(-1)!.daysChecked.includes(dayNumber)) return true;
		return day >= addDays(new Date(), -1);
	};

	return (
		<CredenzaContent>
			<CredenzaHeader>
				<CredenzaTitle>Add missed days</CredenzaTitle>
				<CredenzaDescription>
					They will not change your streak counter.
				</CredenzaDescription>
			</CredenzaHeader>
			<Popover>
				<PopoverTrigger asChild>
					<div className="px-4 md:p-0">
						<Button
							variant={"outline"}
							className={cn(
								"font-normal justify-start w-full",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarDaysIcon className="mr-2 h-4 w-4" />
							{date ? (
								format(date, "PPP")
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						disabled={isDayDisabled}
						fromMonth={new Date(currentYear, 0)}
						toMonth={new Date(currentYear, 11, 31)}
						selected={date}
						onSelect={setDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<CredenzaFooter>
				<CredenzaClose asChild>
					<Button onClick={addDay}>Add</Button>
				</CredenzaClose>
			</CredenzaFooter>
		</CredenzaContent>
	);
};

const DeleteHabit = ({ model }: { model: HabitType }) => {
	const deleteHabit = () => {
		db.habits.delete(model.id);
	};
	return (
		<CredenzaContent>
			<CredenzaHeader>
				<CredenzaTitle>Are you absolutely sure?</CredenzaTitle>
				<CredenzaDescription>
					This will permanently delete this habit.
				</CredenzaDescription>
			</CredenzaHeader>
			<CredenzaFooter>
				<CredenzaClose asChild>
					<Button variant="secondary">Cancel</Button>
				</CredenzaClose>
				<CredenzaClose asChild>
					<Button onClick={deleteHabit}>Delete</Button>
				</CredenzaClose>
			</CredenzaFooter>
		</CredenzaContent>
	);
};
