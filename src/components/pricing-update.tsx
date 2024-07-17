import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/db";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const PricingUpdate = ({ evalDays }: { evalDays?: number }) => {
	const userId = db.cloud.currentUserId;

	if (userId === "unauthorized") return null;

	return (
		<Popover>
			<PopoverTrigger>
				<p className="underline underline-offset-2 flex items-center">
					Eval days left: {evalDays}
					<InformationCircleIcon className="w-4 h-4 ms-2" />
				</p>
			</PopoverTrigger>
			<PopoverContent>
				<div className="space-y-2">
					<h4 className="font-medium leading-none">
						What are eval days?
					</h4>
					<p>
						How long you can continue syncing your data for free.
						Once this period ends, your data will <b>only</b> be
						available on this device. You can upgrade to Premium to
						resume syncing between devices.
					</p>
				</div>
			</PopoverContent>
		</Popover>
	);
};
