import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
	Credenza,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "@/components/responsive-dialog";

export const PricingUpdate = () => {
	return (
		<Alert className="flex justify-center rounded-none py-2">
			<AlertDescription className="flex items-center space-x-2">
				<p>Important updating about pricing</p>
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
						<div className="px-4 md:p-0 space-y-4">
							<p>
								This update strictly concerns the ability to
								sync data between devices.
							</p>
							<p>
								Since this is something I need to pay for per
								user, those who would like to continue to sync
								their data can upgrade to premium for{" "}
								<b>$0.99 USD per month</b>
							</p>
							<p>
								Each new user has a certain number of eval days,
								during which your data will sync for free (you
								can see how many eval days you have left in the
								settings). After which, you will need to upgrade
								if you want to continue syncing your data.
							</p>
						</div>
						<CredenzaFooter>
							<CredenzaClose asChild>Delete</CredenzaClose>
						</CredenzaFooter>
					</CredenzaContent>
				</Credenza>
			</AlertDescription>
		</Alert>
	);
};
