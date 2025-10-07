"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ChartData {
	name: string;
	value: number;
	[key: string]: any;
}

interface AnalyticsChartProps {
	data: ChartData[];
	type: "line" | "bar" | "pie";
	title?: string;
	description?: string;
	dataKey?: string;
	color?: string;
	height?: number;
	valueLabel?: string; // Custom label for the value (e.g., "Completion Rate", "Days")
	valueSuffix?: string; // Suffix for the value (e.g., "%", " days")
}

const COLORS = [
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#06b6d4",
];

// Custom tooltip component
const CustomTooltip = ({
	active,
	payload,
	label,
	valueLabel,
	valueSuffix,
}: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-card border border-border rounded-lg p-3 shadow-lg">
				<p className="font-medium text-foreground">{label}</p>
				<p className="text-sm text-muted-foreground">
					{valueLabel}:{" "}
					<span className="font-medium text-foreground">
						{payload[0].value}
						{valueSuffix}
					</span>
				</p>
			</div>
		);
	}
	return null;
};

export const AnalyticsChart = ({
	data,
	type,
	title,
	description,
	dataKey = "value",
	color = "#3b82f6",
	height = 300,
	valueLabel = "Value",
	valueSuffix = "",
}: AnalyticsChartProps) => {
	const renderChart = () => {
		switch (type) {
			case "line":
				return (
					<ResponsiveContainer width="100%" height={height}>
						<LineChart
							data={data}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e5e7eb"
							/>
							<XAxis
								dataKey="name"
								stroke="#6b7280"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#6b7280"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								domain={[0, 100]}
							/>
							<Tooltip
								content={
									<CustomTooltip
										valueLabel={valueLabel}
										valueSuffix={valueSuffix}
									/>
								}
							/>
							<Line
								type="monotone"
								dataKey={dataKey}
								stroke={color}
								strokeWidth={2}
								dot={{ fill: color, strokeWidth: 2, r: 4 }}
								activeDot={{
									r: 6,
									stroke: color,
									strokeWidth: 2,
								}}
							/>
						</LineChart>
					</ResponsiveContainer>
				);

			case "bar":
				return (
					<ResponsiveContainer width="100%" height={height}>
						<BarChart
							data={data}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e5e7eb"
							/>
							<XAxis
								dataKey="name"
								stroke="#6b7280"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#6b7280"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								domain={[0, 100]}
							/>
							<Tooltip
								content={
									<CustomTooltip
										valueLabel={valueLabel}
										valueSuffix={valueSuffix}
									/>
								}
							/>
							<Bar
								dataKey={dataKey}
								fill={color}
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				);

			case "pie":
				return (
					<ResponsiveContainer width="100%" height={height}>
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }: any) =>
									`${name} ${(
										(percent as number) * 100
									).toFixed(0)}%`
								}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								content={
									<CustomTooltip
										valueLabel={valueLabel}
										valueSuffix={valueSuffix}
									/>
								}
							/>
						</PieChart>
					</ResponsiveContainer>
				);

			default:
				return null;
		}
	};

	if (!data || data.length === 0) {
		return (
			<div
				className="flex items-center justify-center"
				style={{ height }}
			>
				<p className="text-muted-foreground">No data available</p>
			</div>
		);
	}

	return <div>{renderChart()}</div>;
};
