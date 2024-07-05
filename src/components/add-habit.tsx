import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import AutoGrowTextArea from "./auto-grow-textarea";
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

		const habit: HabitType = {
			id: uuidv4(),
			created: new Date(),
			lastChecked: new Date(),
			name: values.name,
			description: values.description,
			streak: 0,
			checks: 0,
			streakFreezes: 3,
			graph: [{ year, daysChecked: [] }],
		};

		await db.habits.add(habit);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger disabled={paused}>
				<div
					className={cn(
						"flex border-4 border-dashed rounded-xl min-h-96 min-w-96",
						{
							"hover:bg-muted": !paused,
							"hover:cursor-not-allowed": paused,
						}
					)}
				>
					<div className="m-auto text-muted-foreground">
						<PlusCircleIcon className="w-8 h-8 mx-auto" />
						<p className="mt-1">Add habit</p>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new daily habit</DialogTitle>
					<DialogDescription>
						Fill in the fields below to create a new habit. You can
						change this anytime.
					</DialogDescription>
				</DialogHeader>
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
										<Input placeholder="Name" {...field} />
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
			</DialogContent>
		</Dialog>
	);
};
