import { HabitType } from "@/data/HabitType";
import { Stat } from "./stat";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export const HabitCardStats = ({ habit }: { habit: HabitType }) => {
	if (habit.streaksDisabled) {
		return (
			<div className="space-y-4">
				<p>Checks: {habit.checks}</p>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4">
				<Stat title="Streak" number={habit.streak} />
				<Stat
					title={
						<Popover>
							<PopoverTrigger>
								<p className="underline underline-offset-4">
									Freezes
								</p>
							</PopoverTrigger>
							<PopoverContent>
								<p className="text-sm">
									How many times your streak can break before
									it resets. Complete your daily habit to
									reset freezes
								</p>
							</PopoverContent>
						</Popover>
					}
					number={habit.streakFreezes}
				/>
			</div>
			<div className="space-y-4">
				<Stat title="Checks" number={habit.checks} />
				<Stat title="Longest streak" number={habit.longestStreak} />
			</div>
		</>
	);
};
