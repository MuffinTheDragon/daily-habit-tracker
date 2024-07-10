"use client";

import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "@/components/responsive-dialog";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserType } from "@/data/userType";
import { db } from "@/db";
import { getCurrentDate } from "@/lib/utils";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { toast } from "sonner";
import { BaseNumberOfFreezes } from "./habit-card";

export const Settings = ({ user }: { user: UserType }) => {
	const userId = db.cloud.currentUserId;

	const currentYear = new Date().getFullYear();
	const currentDate = getCurrentDate();

	const updatePause = async (value: boolean) => {
		db.transaction("rw", [db.habits, db.user], async () => {
			if (value) await startPause(value);
			else await endPause(value);
		});
	};

	const startPause = async (value: boolean) => {
		if (!user) return;

		await db.user.where({ id: user.id }).modify((i) => {
			i.pauseStreaks = value;
			i.pauseStartDate = currentDate;
		});
	};

	const endPause = async (value: boolean) => {
		if (!user) return;

		const pauses = [...user.pauses];

		pauses.push([user.pauseStartDate!, currentDate]);

		await db.user.where({ id: user.id }).modify((i) => {
			i.pauseStreaks = value;
			i.pauseEndDate = currentDate;
			i.pauses = pauses;
		});

		// after a pause ends, reset streak freezes
		// this avoids the issue where before pause you have < 3 freezes
		// but after pause its treated as if you have 3
		await db.habits.toCollection().modify((i) => {
			i.streakFreezes = BaseNumberOfFreezes;
		});
	};

	const logout = async () => {
		await db.cloud.logout();
		// await db.user.add({ id: "user", pauseStreaks: false });

		toast.success("Success! You are logged out", {
			closeButton: true,
		});
	};

	return (
		<Credenza>
			<CredenzaTrigger asChild>
				<Button variant="outline" size="icon" className="ms-4">
					<Cog6ToothIcon className="w-4 h-4" />
				</Button>
			</CredenzaTrigger>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Settings</CredenzaTitle>
				</CredenzaHeader>
				<div className="px-4 pb-4 md:p-0">
					<div className="flex justify-between items-center">
						<div>
							<p>Pause app</p>
							<p className="text-xs text-muted-foreground pe-24">
								If you are away or need a break, you can pause
								the app. This will also stop your streaks from
								breaking
							</p>
						</div>
						<Switch
							checked={user?.pauseStreaks}
							onCheckedChange={updatePause}
						/>
					</div>
					<div className="flex justify-between items-center">
						<p>Theme</p>
						<ThemePicker />
					</div>
					<div className="w-full flex">
						<Link
							href="https://github.com/MuffinTheDragon/daily-habit-tracker/issues"
							target="_blank"
							className="underline underline-offset-4"
						>
							Report an issue
						</Link>
					</div>
					{userId !== "unauthorized" && (
						<Button
							onClick={logout}
							variant="secondary"
							size="sm"
							className="mt-4 w-full"
						>
							Logout
						</Button>
					)}
				</div>
			</CredenzaContent>
		</Credenza>
	);
};
