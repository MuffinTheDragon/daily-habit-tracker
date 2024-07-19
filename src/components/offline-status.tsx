import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { SignalSlashIcon } from "@heroicons/react/24/outline";

export const OfflineStatus = () => {
	const syncStatus = useObservable(db.cloud.syncState);
	if (syncStatus?.status !== "offline") return null;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon" variant="outline">
					<SignalSlashIcon className="w-5 h-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				Cloud sync is disabled. Your network may be offline or your
				evaluation period has expired. Any changes you make are only
				available on this device until you go back online.
			</PopoverContent>
		</Popover>
	);
};
