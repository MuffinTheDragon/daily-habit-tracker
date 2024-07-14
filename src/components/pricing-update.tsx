import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
	Credenza,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "@/components/responsive-dialog";
import { db } from "@/db";

export const PricingUpdate = () => {
	const userId = db.cloud.currentUserId;

	if (userId === "unauthorized") return null;

	return (
		<Alert className="flex justify-center rounded-none py-2 bg-[#fbf4cd] dark:bg-[#302801]">
			<AlertDescription className="flex items-center space-x-2">
				<p>Important update about pricing</p>
				<Credenza>
					<CredenzaTrigger asChild>
						<Button size="sm" variant="secondary">
							View
						</Button>
					</CredenzaTrigger>
					<CredenzaContent>
						<CredenzaHeader>
							<CredenzaTitle>Pricing update</CredenzaTitle>
							<CredenzaDescription>
								Note: the core features of the app will remain
								entirely free and useable offline!
							</CredenzaDescription>
						</CredenzaHeader>
						<div className="px-4 md:p-0 space-y-4 mb-4">
							<p>
								This update strictly concerns the ability to
								sync data between devices.
							</p>
							<p>
								Since this is something I have to pay for per
								user per month, those who would like to continue
								to sync their data can upgrade to premium for{" "}
								<b>$0.99 USD per month.</b>
							</p>
							<p>
								Each user has a certain number of eval days,
								during which your data will sync for free (you
								can see how many eval days you have left in the
								settings). After which, you will have to upgrade
								if you want to continue syncing your data.
							</p>
						</div>
					</CredenzaContent>
				</Credenza>
			</AlertDescription>
		</Alert>
	);
};
