"use client";

import { GraphType, HabitType } from "@/data/HabitType";
import { daysInYear, getDateByDayNumber } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getDayOfYear, isAfter, isBefore, isFuture } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

export const Graph = ({
	graph,
	habit,
}: {
	graph: GraphType[];
	habit: HabitType;
}) => {
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
				<p>{graph[index].year}</p>
				<Button
					variant="outline"
					size="icon"
					disabled={isNextDisabled}
					onClick={() => setIndex(index + 1)}
				>
					<ChevronRightIcon className="w-4 h-4" />
				</Button>
			</div>
			<div className="flex overflow-x-auto overflow-y-hidden">
				<GetGraph graph={graph[index]} habit={habit} />
			</div>
		</div>
	);
};

const GetGraph = ({ graph, habit }: { graph: GraphType; habit: HabitType }) => {
	const user = useLiveQuery(() => db.user.toArray());

	if (!user) return null;

	const graphYear = graph.year;
	const pauseTimes = user[0]?.pauses.find((i) => i.year === graphYear);

	const numberOfDays = daysInYear(graph.year);

	const arr: number[] = Array(numberOfDays).fill(0);

	pauseTimes?.time.forEach((time) => {
		const startDay = getDayOfYear(time.start);
		const endDay = getDayOfYear(time.end);

		for (let i = startDay; i < endDay; i++) {
			const pausedDate = getDateByDayNumber(i);

			const pausedAfterCreated = isAfter(pausedDate, habit.created);

			const pausedBeforeArchived = habit.archivedDate
				? isBefore(pausedDate, habit.archivedDate)
				: true;

			if (pausedAfterCreated && pausedBeforeArchived) arr[i - 1] = 1;
		}
	});

	graph.daysChecked.forEach((date) => {
		const dayNumber = getDayOfYear(date);
		arr[dayNumber - 1] = 2;
	});

	graph.manualDaysChecked.forEach((date) => {
		const dayNumber = getDayOfYear(date);
		arr[dayNumber - 1] = 2;
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
						className="w-4 h-4 rounded-[5px] me-1"
					/>
					Missed
				</div>
				<div className="flex items-center">
					<div
						data-level={1}
						className="w-4 h-4 rounded-[5px] me-1"
					/>
					Paused
				</div>
				<div className="flex items-center">
					<div
						data-level={2}
						className="w-4 h-4 rounded-[5px] me-1"
					/>
					Checked
				</div>
			</div>
		</div>
	);
};
