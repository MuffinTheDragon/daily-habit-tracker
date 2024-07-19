import { db } from "../db";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "./responsive-dialog";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";

export const ServiceWorkerAlert = () => {
	const userId = db.cloud.currentUserId;

	if (userId === "unauthorized") return null;

	return (
		<Alert className="rounded-none flex items-center justify-center py-1.5">
			New background sync capability
			<Credenza>
				<CredenzaTrigger className="flex justify-center" asChild>
					<Button size="sm" variant="secondary" className="ms-2">
						More info
					</Button>
				</CredenzaTrigger>
				<CredenzaContent>
					<CredenzaHeader>
						<CredenzaTitle>Background sync support</CredenzaTitle>
					</CredenzaHeader>
					<div className="space-y-2 px-4 md:px-0 pb-2">
						<p>
							Your data will now sync with the cloud even if the
							app is closed. An icon will also appear if cloud
							syncing is disabled.
						</p>
						<p>
							This should help resolve any other syncing issues.
							You may need to refresh / re-install the app for
							this to work.
						</p>
						<p>
							If you run into any problems, you can report an
							issue or send an email from the settings.
						</p>
					</div>
				</CredenzaContent>
			</Credenza>
		</Alert>
	);
};
