import React from "react";
import { useObservable } from "dexie-react-hooks";
import { db } from "@/db";
import { Alert } from "./ui/alert";
import {
	Credenza,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "./responsive-dialog";
import { Button } from "./ui/button";

const DAYS = 24 * 60 * 60_000;

export const LicenseWarning = () => {
	const user = useObservable(db.cloud.currentUser);

	if (!user || !user.license) return null; // Backward compat.

	const rtf1 = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	const showLicenseWarning = user.license.validUntil
		? user.license.validUntil < new Date(Date.now() + 3 * DAYS)
		: user.license.evalDaysLeft
		? user.license.evalDaysLeft <= 3
		: false;

	const evalDaysLeft = user.license.evalDaysLeft;

	if (!evalDaysLeft) return null;

	const format = rtf1.formatToParts(evalDaysLeft, "days");

	return (
		showLicenseWarning && (
			<Alert className="rounded-none text-center bg-red-500 dark:bg-red-800 border-0 py-1.5">
				Your eval period will expire {format.map((i) => i.value)}
				<Credenza>
					<CredenzaTrigger asChild>
						<Button size="sm" variant="secondary" className="ms-2">
							View
						</Button>
					</CredenzaTrigger>
					<CredenzaContent>
						<CredenzaHeader>
							<CredenzaTitle>
								Eval period expiration
							</CredenzaTitle>
							<CredenzaDescription>
								Upgrade your account to continue syncing
							</CredenzaDescription>
						</CredenzaHeader>
						<div className="space-y-2 px-4 md:px-0 pb-2">
							<p>
								Once your eval days expire, your data will no
								longer sync with the cloud and will only be
								available on this device.
							</p>
							<p>
								To continue syncing, upgrade your account in the
								settings.
							</p>
							<p>
								<b>Note:</b> After the eval period, if you don’t
								upgrade, the app will only work on this device.
								Switching devices will result in data loss
								unless you export and import your data via
								settings.
							</p>
						</div>
					</CredenzaContent>
				</Credenza>
			</Alert>
		)
	);
};
