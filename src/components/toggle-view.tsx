"use client";

import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserType } from "@/data/userType";
import { db } from "@/db";
import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

export const ToggleView = ({ user }: { user?: UserType }) => {
	const currentYear = new Date().getFullYear();

	const onToggleChange = async (collapsed: boolean) => {
		if (user) {
			db.user.where({ id: user.id }).modify((i) => {
				i.collapsed = collapsed;
			});
		} else {
			await db.user.add({
				id: "user",
				pauseStreaks: false,
				pauses: [{ year: currentYear, time: [] }],
				collapsed,
			});
		}
	};

	return (
		<ToggleGroup
			value={user?.collapsed ? "0" : "1"}
			type="single"
			className="rounded-lg border"
		>
			<ToggleGroupItem
				value="0"
				onClick={() => onToggleChange(true)}
				title="Collapse habits"
			>
				<ArrowsPointingInIcon className="w-4 h-4" />
			</ToggleGroupItem>
			<Separator orientation="vertical" className="h-4 bg-border" />
			<ToggleGroupItem
				value="1"
				onClick={() => onToggleChange(false)}
				title="Expand habits"
			>
				<ArrowsPointingOutIcon className="w-4 h-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
};
