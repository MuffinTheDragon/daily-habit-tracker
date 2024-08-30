import { db } from "@/db";
import download from "downloadjs";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const DataBackup = () => {
	const exportDb = async () => {
		if (typeof window !== "undefined") {
			const { exportDB } = await import("dexie-export-import");
			const blob = await exportDB(db, {
				prettyJson: true,
				filter: (table, value, key) =>
					table !== "$logins" && table !== "$syncState",
			});
			download(
				blob,
				"daily-habit-tracker-backup.json",
				"application/json"
			);
		}
	};

	const importDb = async (event: ChangeEvent<HTMLInputElement>) => {
		if (typeof window !== "undefined") {
			const { importDB } = await import("dexie-export-import");
			const file = event.target.files?.[0];
			if (!file) {
				toast("Invalid file. File must be of type json");
				return;
			}
			await db.delete();
			await importDB(file);

			location.reload();
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<p>Data control</p>
				<p className="text-xs text-muted-foreground">
					Use the buttons below to export and import your data
				</p>
			</div>
			<div className="flex space-x-4">
				<Button size="sm" className="w-fit" onClick={exportDb}>
					Export data
				</Button>
				<div>
					<Button
						size="sm"
						variant="secondary"
						onClick={() =>
							document.getElementById("input")?.click()
						}
					>
						Import data
					</Button>
					<Input
						type="file"
						className="w-[250px] mt-1 hidden"
						onChange={importDb}
						id="input"
					/>
				</div>
			</div>
		</div>
	);
};
