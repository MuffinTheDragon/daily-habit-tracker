import { db } from "@/db";
import {
	Credenza,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "./responsive-dialog";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const Logout = () => {
	const logout = async () => {
		await db.cloud.logout({ force: true });
		await db.user.add({
			id: uuidv4(),
			created: new Date(),
			pauseStreaks: false,
			pauses: [],
		});
		toast.success("Success! You are logged out", {
			closeButton: true,
		});
	};
	return (
		<Credenza>
			<CredenzaTrigger asChild>
				<Button variant="secondary" size="sm" className="mt-4 w-full">
					Logout
				</Button>
			</CredenzaTrigger>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>
						Are you sure you want to logout?
					</CredenzaTitle>
					<CredenzaDescription>
						<p>
							This will erase all of your local data. Unless your
							data synced with the cloud,{" "}
							<b>you will lose any changes you made</b>
						</p>
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaFooter>
					<CredenzaClose asChild>
						<Button onClick={logout}>Confirm</Button>
					</CredenzaClose>
					<CredenzaClose asChild>
						<Button variant="secondary">Cancel</Button>
					</CredenzaClose>
				</CredenzaFooter>
			</CredenzaContent>
		</Credenza>
	);
};
