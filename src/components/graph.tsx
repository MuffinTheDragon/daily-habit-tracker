"use client";

import { GraphType, HabitType } from "@/data/HabitType";
import { UserType } from "@/data/userType";
import { daysInYear, isAfterOrEqual, isBeforeOrEqual } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { addDays, getDayOfYear, isAfter, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Props = {
	graph: GraphType[];
	habit: HabitType;
	user: UserType;
};

export const Graph = ({ ...props }: Props) => {
	const { graph, user, habit } = props;

	const [index, setIndex] = useState(graph.length - 1);

	useEffect(() => setIndex(graph.length - 1), [graph]);

	const isBackDisabled = index - 1 < 0;

	const isNextDisabled = index + 1 >= graph.length;

	return (
		<div>
			<div className="flex justify-end items-center space-x-4">
				<Button
					variant="outline"
					size="icon"
					disabled={isBackDisabled}
					onClick={() => setIndex(index - 1)}
				>
					<ChevronLeftIcon className="w-4 h-4" />
				</Button>
				<p className="text-sm">{graph[index].year}</p>
				<Button
					variant="outline"
					size="icon"
					disabled={isNextDisabled}
					onClick={() => setIndex(index + 1)}
				>
					<ChevronRightIcon className="w-4 h-4" />
				</Button>
			</div>
			<div className="flex overflow-x-auto overflow-y-hidden map">
				<GetGraph graph={graph[index]} habit={habit} user={user} />
			</div>
		</div>
	);
};

const GetGraph = ({
	graph,
	habit,
	user,
}: {
	graph: GraphType;
	habit: HabitType;
	user: UserType;
}) => {
	const numberOfDays = daysInYear(graph.year);
	const arr: number[] = Array(numberOfDays).fill(0);

	const graphYear = graph.year;

	for (let i = 0; i < user.pauses.length; i++) {
		const pausePeriod = user.pauses[i];

		const pauseStart = pausePeriod[0];
		const pauseEnd = pausePeriod[1];

		let currentDate = pauseStart; // start of pause

		while (!isAfter(currentDate, pauseEnd)) {
			if (currentDate.getFullYear() !== graphYear) {
				currentDate = addDays(currentDate, 1);
				continue;
			}

			const pausedAfterCreated = isAfterOrEqual(
				currentDate,
				startOfDay(habit.created)
			);

			const pausedBeforeArchived =
				!habit.archivedDate ||
				isBeforeOrEqual(currentDate, habit.archivedDate);

			if (pausedAfterCreated && pausedBeforeArchived) {
				const index = getDayOfYear(currentDate);
				arr[index - 1] = 1;
			}

			currentDate = addDays(currentDate, 1);
		}
	}

	graph.daysChecked.forEach((date) => {
		const dayNumber = getDayOfYear(date);
		arr[dayNumber - 1] = 2;
	});

	graph.manualDaysChecked.forEach((date) => {
		const dayNumber = getDayOfYear(date);
		arr[dayNumber - 1] = 3;
	});

	return (
		<div>
			<div className="graph mt-4">
				<ul className="months">
					<li>Jan</li>
					<li>Feb</li>
					<li>Mar</li>
					<li>Apr</li>
					<li>May</li>
					<li>Jun</li>
					<li>Jul</li>
					<li>Aug</li>
					<li>Sep</li>
					<li>Oct</li>
					<li>Nov</li>
					<li>Dec</li>
				</ul>
				<ul className="days">
					<li>Mon</li>
					<li>Tue</li>
					<li>Wed</li>
					<li>Thu</li>
					<li>Fri</li>
					<li>Sat</li>
					<li>Sun</li>
				</ul>
				<ul className="squares">
					{arr.map((day, ind) => {
						const level = day.toString();
						// const text = getMonthAndDayOfWeek(ind + 1);
						return <li key={ind} data-level={level}></li>;
					})}
				</ul>
			</div>
			<div className="legend text-xs flex space-x-4 mb-2">
				<div className="flex items-center">
					<div
						data-level={0}
						className="w-3 h-3 rounded-[3px] me-1"
					/>
					Missed
				</div>
				<div className="flex items-center">
					<div
						data-level={1}
						className="w-3 h-3 rounded-[3px] me-1"
					/>
					Paused
				</div>
				<div className="flex items-center">
					<div
						data-level={3}
						className="w-3 h-3 rounded-[3px] me-1"
					/>
					Retro checked
				</div>
				<div className="flex items-center">
					<div
						data-level={2}
						className="w-3 h-3 rounded-[3px] me-1"
					/>
					Checked
				</div>
			</div>
		</div>
	);
};
