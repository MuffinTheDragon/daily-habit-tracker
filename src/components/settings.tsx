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
import { v4 as uuidv4 } from "uuid";

export const Settings = ({ user }: { user?: UserType }) => {
	const userId = db.cloud.currentUserId;

	const currentYear = new Date().getFullYear();
	const currentDate = getCurrentDate();

	const updatePause = async (value: boolean) => {
		db.transaction("rw", [db.habits, db.user], async () => {
			if (user) {
				// start pause
				if (value) {
					const pauses = [...user.pauses];

					if (pauses.at(-1)?.year !== currentYear) {
						pauses.push({ year: currentYear, time: [] });
					}

					await db.user.where({ id: user.id }).modify((i) => {
						i.pauseStreaks = value;
						i.pauseStartDate = currentDate;
						i.pauses = pauses;
					});
				}

				// end pause
				else {
					const pauses = [...user.pauses];

					pauses.at(-1)?.time.push({
						start: user.pauseStartDate!,
						end: currentDate,
					});

					await db.user.where({ id: user.id }).modify((i) => {
						i.pauseStreaks = value;
						i.pauseEndDate = currentDate;
						i.pauses = pauses;
					});
				}
			} else {
				await db.user.add({
					id: uuidv4(),
					created: new Date(),
					pauseStreaks: value,
					pauseStartDate: currentDate,
					pauses: [{ year: currentYear, time: [] }],
				});
			}
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
