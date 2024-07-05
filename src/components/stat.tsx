export const Stat = ({
	title,
	number,
}: {
	title: React.ReactNode;
	number: number;
}) => {
	return (
		<div className="items-center flex flex-col">
			<div className="text-sm text-muted-foreground">{title}</div>
			<div className="text-2xl font-semibold text-foreground">
				{number}
			</div>
		</div>
	);
};
