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
		? user.license.validUntil < new Date(Date.now() + 7 * DAYS)
		: user.license.evalDaysLeft
		? user.license.evalDaysLeft <= 7
		: false;

	const evalDaysLeft = user.license.evalDaysLeft;

	if (!evalDaysLeft) return null;

	const format = rtf1.formatToParts(evalDaysLeft, "days");

	return (
		showLicenseWarning && (
			<Alert className="rounded-none text-center bg-destructive/40 border-0">
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
								TLDR: Upgrade your account to continue syncing
								your data
							</CredenzaDescription>
						</CredenzaHeader>
						<div className="space-y-2 px-4 md:px-0 pb-2">
							<p>
								Once you run out of eval days, your data will no
								longer be able to sync with the cloud and will
								only be available on this device.
							</p>
							<p>
								If you would like to continue syncing, you can
								upgrade your account in the settings.
							</p>
							<p>
								<b>Note:</b> If, after your eval period, you
								would like to use the app offline, please
								continue using it on the same device. If you
								switch devices and login, your data will not be
								available.
							</p>
						</div>
					</CredenzaContent>
				</Credenza>
			</Alert>
		)
	);
};
