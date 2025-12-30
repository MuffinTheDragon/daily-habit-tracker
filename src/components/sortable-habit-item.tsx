"use client";

import { HabitType } from "@/data/HabitType";
import { UserType } from "@/data/userType";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { HabitCard } from "./habit-card";

type Props = {
	habit: HabitType;
	user: UserType;
	showMap: boolean;
};

export const SortableHabitItem = ({ habit, user, showMap }: Props) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: habit.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="relative h-full group cursor-grab active:cursor-grabbing"
			title="Drag to reorder"
		>
			{/* Optional visible drag handle for affordance */}
			<div
				className="
          absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center
          pointer-events-none border-r border-border/30 opacity-100 md:opacity-0
          group-hover:opacity-100 transition-opacity duration-200
        "
			>
				<div className="flex flex-col gap-1.5">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70"
						/>
					))}
				</div>
			</div>

			{/* Card content */}
			{/* No pointer-events-none here, so buttons etc. inside work normally */}
			<HabitCard habit={habit} user={user} showMap={showMap} />
		</div>
	);
};
