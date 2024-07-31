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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/data/userType";
import { db } from "@/db";
import { getCurrentDate } from "@/lib/utils";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useObservable } from "dexie-react-hooks";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DataBackup } from "./data-backup";
import { BaseNumberOfFreezes } from "./habit-card";
import { License } from "./license";
import { Logout } from "./logout";
import { Separator } from "./ui/separator";

export const Settings = ({ user }: { user: UserType }) => {
	const userId = db.cloud.currentUserId;

	const syncStatus = useObservable(db.cloud.syncState);
	const currentDate = getCurrentDate();

	const [loadingSync, setLoadingSync] = useState(false);

	const updatePause = async (value: boolean) => {
		db.transaction("rw", [db.habits, db.user], async () => {
			if (value) await startPause(value);
			else await endPause(value);
		});
	};

	const startPause = async (value: boolean) => {
		if (!user) return;

		await db.user.update(user.id, {
			// @ts-ignore
			pauseStreaks: value,
			// @ts-ignore
			pauseStartDate: currentDate,
		});
	};

	const endPause = async (value: boolean) => {
		if (!user) return;

		const pauses = [...user.pauses];

		pauses.push([user.pauseStartDate!, currentDate]);

		await db.user.update(user.id, {
			// @ts-ignore
			pauseStreaks: value,
			// @ts-ignore
			pauseEndDate: currentDate,
			// @ts-ignore
			pauses,
		});

		// after a pause ends, reset streak freezes
		// this avoids the issue where before pause you have < 3 freezes
		// but after pause its treated as if you have 3
		await db.habits.toCollection().modify((i) => {
			i.streakFreezes = BaseNumberOfFreezes;
		});
	};

	const sync = async () => {
		setLoadingSync(true);
		try {
			// @ts-ignore
			await db.$logins
				.toCollection()
				.modify({ accessTokenExpiration: new Date() });
			await db.cloud.sync();
		} catch (error) {
			toast.error(
				"Sync error. If you are out of eval days, upgrade to continue syncing"
			);
		}
		setLoadingSync(false);
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
					<Tabs
						defaultValue="account"
						className="w-full flex flex-col"
					>
						<TabsList>
							<TabsTrigger value="general">General</TabsTrigger>
							<TabsTrigger value="account">Account</TabsTrigger>
						</TabsList>
						<TabsContent value="general" className="space-y-4 mt-4">
							<div className="flex justify-between items-center">
								<div>
									<p>Pause app</p>
									<p className="text-xs text-muted-foreground pe-24">
										If you are away or need a break, you can
										pause the app. This will also stop your
										streaks from breaking
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
							<div className="w-full flex space-x-4">
								<Link
									href="https://github.com/MuffinTheDragon/daily-habit-tracker/issues"
									target="_blank"
									className="underline underline-offset-4 text-sm"
								>
									Report an issue
								</Link>
								<Link
									href="mailto:rdht.contact@gmail.com"
									target="_blank"
									className="underline underline-offset-4 text-sm"
								>
									Send an email
								</Link>
							</div>
						</TabsContent>

						<TabsContent value="account">
							{userId !== "unauthorized" && (
								<div className="flex justify-between items-center mt-2">
									<p className="text-sm">Sync your data</p>
									<Button
										size="sm"
										variant="outline"
										onClick={sync}
										disabled={loadingSync}
									>
										{loadingSync ? "Syncing..." : "Sync"}
									</Button>
								</div>
							)}
							<Separator className="my-2" />
							<DataBackup />
							{userId !== "unauthorized" && (
								<div className="text-sm">
									<Separator className="my-4" />
									<License />
									<Logout />
									<p className="text-center text-sm mt-1">
										Logged in as: {userId}
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</CredenzaContent>
		</Credenza>
	);
};
