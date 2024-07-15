import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { Button } from "./ui/button";
import Link from "next/link";
import { PricingUpdate } from "./pricing-update";

export const License = () => {
	const user = useObservable(db.cloud.currentUser);

	if (!user || !user.license) return null; // Backward compat.

	const handleUpgrade = async () => {
		const response = await fetch("/api/stripe/payment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId: user.userId }),
		});
		const url = await response.json();
		window.location.assign(url);
	};

	const licenseType = user.license.type === "eval" ? "Free" : "Premium";

	return (
		<div className="flex justify-between items-center">
			<div>
				<p>Tier: {licenseType}</p>
				{licenseType === "Free" && (
					<p className="text-xs text-muted-foreground pe-24">
						<PricingUpdate evalDays={user.license.evalDaysLeft} />
						{/* Eval days left: {user.license.evalDaysLeft} */}
					</p>
				)}
			</div>
			{licenseType === "Free" && (
				<Button size="sm" onClick={handleUpgrade}>
					Upgrade
				</Button>
			)}
			{licenseType === "Premium" && (
				<Link
					href={process.env.NEXT_PUBLIC_STRIPE_PORTAL!}
					target="_blank"
				>
					<Button size="sm">Manage</Button>
				</Link>
			)}
		</div>
	);
};
