import { HabitType } from "@/data/HabitType";
import { Stat } from "./stat";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

export const HabitCardStats = ({ habit }: { habit: HabitType }) => (
	<>
		<div className="space-y-4">
			<Stat title="Streak" number={habit.streak} />
			<Stat
				title={
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger>
								<p className="underline underline-offset-4">
									Freezes
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-sm">
									How many times your streak can break before
									it resets. Complete your daily habit to
									reset freezes
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
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
