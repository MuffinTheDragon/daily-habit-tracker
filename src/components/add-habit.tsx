import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import { getCurrentDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import AutoGrowTextArea from "./auto-grow-textarea";
import {
	Credenza,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "./responsive-dialog";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	description: z.string(),
});

export const AddHabit = ({ paused }: { paused: boolean }) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const addHabit = async (values: z.infer<typeof formSchema>) => {
		const year = new Date().getFullYear();

		const now = getCurrentDate();

		const habit: HabitType = {
			id: uuidv4(),
			created: new Date(), // store time for sorting purposes
			lastChecked: now,
			name: values.name,
			description: values.description,
			streak: 0,
			longestStreak: 0,
			longestStreakDateSet: now,
			checks: 0,
			archived: false,
			archivedDate: null,
			streakFreezes: 3,
			graph: [{ year, daysChecked: [] }],
		};

		await db.habits.add(habit);
		setOpen(false);
	};

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaTrigger asChild>
				<Button disabled={paused}>Add habit</Button>
			</CredenzaTrigger>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Add a new daily habit</CredenzaTitle>
					<CredenzaDescription>
						You can change this anytime.
					</CredenzaDescription>
				</CredenzaHeader>
				<div className="px-4 md:p-0">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(addHabit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<AutoGrowTextArea
												placeholder="Description"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="float-right">
								Add
							</Button>
						</form>
					</Form>
				</div>
			</CredenzaContent>
		</Credenza>
	);
};
