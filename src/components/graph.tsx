"use client";

import { GraphType } from "@/data/HabitType";
import { daysInYear } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "./ui/button";

export const Graph = ({ graph }: { graph: GraphType[] }) => {
	const [index, setIndex] = useState(graph.length - 1);

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
				<GetGraph graph={graph[index]} />
			</div>
		</div>
	);
};

const GetGraph = ({ graph }: { graph: GraphType }) => {
	const numberOfDays = daysInYear(graph.year);

	const arr = Array(numberOfDays).fill(0);

	graph.daysChecked.forEach((day) => (arr[day - 1] = 1));
	return (
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
					const level = day == 1 ? "1" : "0";
					// const text = getMonthAndDayOfWeek(ind + 1);
					return <li key={ind} data-level={level}></li>;
				})}
			</ul>
		</div>
	);
};
