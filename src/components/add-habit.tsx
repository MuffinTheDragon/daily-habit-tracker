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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	description: z.string(),
	streaksDisabled: z.boolean().default(false).optional(),
});

export const AddHabit = ({ paused }: { paused: boolean }) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			streaksDisabled: false,
		},
	});

	const addHabit = async (values: z.infer<typeof formSchema>) => {
		const year = new Date().getFullYear();

		const now = getCurrentDate();
		console.log(values);
		const habit: HabitType = {
			id: uuidv4(),
			created: new Date(), // store time for sorting purposes
			name: values.name,
			description: values.description,
			streaksDisabled: values.streaksDisabled,
			streak: 0,
			longestStreak: 0,
			longestStreakDateSet: now,
			checks: 0,
			archived: false,
			archivedDate: null,
			streakFreezes: 3,
			graph: [{ year, daysChecked: [], manualDaysChecked: [] }],
		};

		await db.habits.add(habit);
		setOpen(false);
	};

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaTrigger asChild>
				<Button
					disabled={paused}
					className="h-8 rounded-md px-3 text-xs md:h-9 md:px-4 md:py-2 md:text-sm"
				>
					Add habit
				</Button>
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
										<FormLabel>Habit name</FormLabel>
										<FormControl>
											<Input
												placeholder="E.g. read for 10 minutes"
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
										<FormLabel>
											Habit description (optional)
										</FormLabel>
										<FormControl>
											<AutoGrowTextArea
												placeholder="E.g. spend 10 minutes each day reading to relax, learn, and unwind."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="streaksDisabled"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl className="mt-0.5">
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Disable streak tracking?
											</FormLabel>
											<FormDescription>
												<p>
													If you don&apos;t want to
													worry about building streaks
													and want to track your habit
													manually.{" "}
													<span className="font-bold">
														This can&apos;t be
														undone.
													</span>
												</p>
											</FormDescription>
										</div>
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
