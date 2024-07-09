import { db } from "@/db";
import { DXCInputField, resolveText } from "dexie-cloud-addon";
import { useObservable } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Credenza,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "./responsive-dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const Login = () => {
	const userId = db.cloud.currentUserId;
	const ui = useObservable(db.cloud.userInteraction);

	const [params, setParams] = useState<{ [param: string]: string }>({});
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (userId !== "unauthorized") {
			toast.success("Success! You are logged in", {
				description: (
					<p>
						Current user: <b>{userId}</b>
					</p>
				),
				closeButton: true,
			});
		}
	}, [userId]);

	if (userId !== "unauthorized") {
		return null;
	}

	const login = () => {
		db.cloud.login();
	};

	const cancelLogin = () => {
		ui?.onCancel();
		setOpen(false);
	};

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaTrigger asChild>
				<Alert className="rounded-none text-center flex justify-center items-center space-x-2 border-s-0 border-e-0">
					<p className="text-sm">
						To sync between devices, please sign in
					</p>
					<Button variant="secondary" size="sm" onClick={login}>
						Login
					</Button>
				</Alert>
			</CredenzaTrigger>
			{ui && (
				<CredenzaContent>
					<CredenzaHeader>
						<CredenzaTitle>{ui.title}</CredenzaTitle>
						<CredenzaDescription>
							{ui.type === "otp" && (
								<>
									Look for an email sent from{" "}
									<b className="underline">Dexie Cloud</b>
								</>
							)}
							{ui.type === "email" && (
								<>
									We support passwordless authentication. Just
									enter an email, paste the verification code
									and you are logged in!
								</>
							)}
						</CredenzaDescription>
					</CredenzaHeader>
					<div className="px-4 md:p-0 space-y-2">
						{ui.alerts?.map((alert, i) => (
							<Alert
								key={i}
								variant={
									alert.type === "error"
										? "destructive"
										: "default"
								}
							>
								<AlertDescription>
									{resolveText(alert)}
								</AlertDescription>
							</Alert>
						))}
					</div>
					<form
						className="px-4 md:p-0"
						onSubmit={(ev) => {
							ev.preventDefault();
							ui.onSubmit(params);
						}}
					>
						{(
							Object.entries(ui.fields) as [
								string,
								DXCInputField
							][]
						).map(
							(
								[fieldName, { type, label, placeholder }],
								idx
							) => (
								<Label key={idx}>
									{label ? label : "Email"}
									<Input
										autoFocus={false}
										type={type}
										name={fieldName}
										placeholder={placeholder}
										value={params[fieldName] || ""}
										onChange={(ev) => {
											const value = ev.target.value;
											let updatedParams = {
												...params,
												[fieldName]: value,
											};
											setParams(updatedParams);
										}}
									/>
								</Label>
							)
						)}
					</form>
					<CredenzaFooter>
						<Button onClick={() => ui.onSubmit(params)}>
							{ui.submitLabel}
						</Button>
						<Button variant="secondary" onClick={cancelLogin}>
							{ui.cancelLabel}
						</Button>
					</CredenzaFooter>
				</CredenzaContent>
			)}
		</Credenza>
	);
};
