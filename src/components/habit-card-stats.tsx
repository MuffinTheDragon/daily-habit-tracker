import { HabitType } from "@/data/HabitType";
import { diffInDaysFromNow, getActiveDays } from "@/lib/utils";
import { Stat } from "./stat";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

export const HabitCardStats = ({ habit }: { habit: HabitType }) => {
	const user = useLiveQuery(() => db.user.toArray());

	if (!user) return null;

	return (
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
										How many times your streak can break
										before it resets. Complete your daily
										habit to reset freezes
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
				<Stat
					title="Consistency %"
					number={
						~~(
							(habit.checks /
								(getActiveDays(user[0], habit) + 0)) *
							100
						)
					}
				/>
			</div>
		</>
	);
};
