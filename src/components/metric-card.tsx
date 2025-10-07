"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	progress?: number;
	trend?: "up" | "down" | "neutral";
	trendValue?: string;
	icon?: React.ReactNode;
	className?: string;
}

export const MetricCard = ({
	title,
	value,
	subtitle,
	progress,
	trend,
	trendValue,
	icon,
	className,
}: MetricCardProps) => {
	const getTrendColor = () => {
		switch (trend) {
			case "up":
				return "text-green-600";
			case "down":
				return "text-red-600";
			default:
				return "text-muted-foreground";
		}
	};

	const getTrendIcon = () => {
		switch (trend) {
			case "up":
				return "↗";
			case "down":
				return "↘";
			default:
				return "→";
		}
	};

	return (
		<Card className={cn("hover:shadow-sm transition-shadow", className)}>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{title}
						</p>
						<div className="flex items-center gap-2">
							<p className="text-2xl font-bold">{value}</p>
							{trend && trendValue && (
								<Badge
									variant="secondary"
									className={cn("text-xs", getTrendColor())}
								>
									{getTrendIcon()} {trendValue}
								</Badge>
							)}
						</div>
						{subtitle && (
							<p className="text-xs text-muted-foreground">
								{subtitle}
							</p>
						)}
					</div>
					{icon && (
						<div className="text-muted-foreground w-6 h-6">
							{icon}
						</div>
					)}
				</div>
				{progress !== undefined && (
					<div className="mt-4">
						<Progress value={progress} className="h-2" />
					</div>
				)}
			</CardContent>
		</Card>
	);
};
