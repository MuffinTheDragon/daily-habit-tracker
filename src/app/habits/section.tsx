import { HabitType } from "@/data/HabitType";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { HabitCard } from "@/components/habit-card";
import { UserType } from "@/data/userType";

type Props = {
	title: string;
	array: HabitType[];
	user: UserType;
	showMap: boolean;
};

export const Section = ({ ...props }: Props) => {
	const { title, array, user, showMap } = props;

	if (array.length < 1) return null;

	return (
		<Accordion
			type="single"
			collapsible
			className="col-span-1 md:col-span-2 relative min-w-[90vw] sm:min-w-96"
		>
			<AccordionItem value="item-1">
				<AccordionTrigger>{title}</AccordionTrigger>
				<AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
					{array.map((habit, i) => {
						const spanClass =
							i === array.length - 1 && array.length % 2
								? "md:col-span-2"
								: "";
						return (
							<div key={habit.id} className={spanClass}>
								<HabitCard
									key={habit.id}
									habit={habit}
									user={user}
									showMap={showMap}
								/>
							</div>
						);
					})}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
