"use client";

import { AnalyticsChart } from "@/components/analytics-chart";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitType } from "@/data/HabitType";
import { db } from "@/db";
import {
	analyzeDayOfWeek,
	analyzeHabitBuildingProgress,
	analyzeStreakPatterns,
	analyzeTimePeriods,
	calculateConsistencyMetrics,
	getOverallAnalytics,
} from "@/lib/analytics";
import {
	ArrowTrendingDownIcon,
	ArrowTrendingUpIcon,
	CalendarIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ChevronLeftIcon,
	FireIcon,
	MinusIcon,
	PauseIcon,
	TrophyIcon,
} from "@heroicons/react/24/outline";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useState } from "react";

export default function Trends() {
	const habits = useLiveQuery(() =>
		db.habits.orderBy("created").reverse().toArray()
	);

	const user = useLiveQuery(() => db.user.orderBy("created").first());
	const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [analysisTab, setAnalysisTab] = useState("consistency");

	if (!habits || !user) return null;

	try {
		const activeHabits = habits.filter((habit) => !habit.archived);
		const overallAnalytics = getOverallAnalytics(activeHabits);

		const handleHabitSelection = (habit: HabitType) => {
			setSelectedHabit(habit);
		};

		return (
			<>
				<div className="min-h-screen bg-background">
					{/* Header */}
					<div className="border-b bg-card">
						<div className="flex h-16 items-center justify-between px-4 sm:px-6">
							<div className="flex items-center gap-4">
								<Button variant="ghost" size="sm" asChild>
									<Link href="/habits">
										<ChevronLeftIcon className="h-4 w-4 mr-2" />
									</Link>
								</Button>
								<div className="hidden sm:block">
									<h1 className="text-xl font-semibold">
										Analytics
									</h1>
								</div>
							</div>
						</div>
					</div>

					{/* Mobile-Optimized Content */}
					<div className="px-4 py-4 sm:px-6 sm:py-6">
						{/* Main Tabs */}
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="space-y-4"
						>
							<ScrollArea className="w-full">
								<TabsList className="grid w-full grid-cols-2 h-auto p-1">
									<TabsTrigger
										value="overview"
										className="text-sm py-2"
									>
										Overview
									</TabsTrigger>
									<TabsTrigger
										value="analyze"
										className="text-sm py-2"
									>
										Analyze
									</TabsTrigger>
								</TabsList>
							</ScrollArea>

							{/* Overview Tab */}
							<TabsContent
								value="overview"
								className="space-y-4 mt-4"
							>
								<OverviewTab
									overallAnalytics={overallAnalytics}
								/>
							</TabsContent>

							{/* Analyze Tab */}
							<TabsContent
								value="analyze"
								className="space-y-4 mt-4"
							>
								{/* Habit Selector */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<ChartBarIcon className="h-5 w-5" />
											Select Habit to Analyze
										</CardTitle>
										<CardDescription className="text-sm">
											Choose a habit to view detailed
											analytics
										</CardDescription>
									</CardHeader>
									<CardContent>
										{/* Desktop: Button grid */}
										<div className="hidden sm:block">
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
												{activeHabits.map((habit) => {
													const progress =
														analyzeHabitBuildingProgress(
															habit
														);
													const isSelected =
														selectedHabit?.id ===
														habit.id;
													return (
														<div
															key={habit.id}
															className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
																isSelected
																	? "bg-primary/10 border-primary/30 shadow-sm"
																	: "hover:bg-muted/50"
															}`}
															onClick={() =>
																handleHabitSelection(
																	habit
																)
															}
														>
															<div className="flex items-center justify-between mb-2">
																<h4 className="font-medium text-sm truncate">
																	{habit.name}
																</h4>
																<div className="flex items-center gap-1">
																	{progress.trendDirection ===
																		"improving" && (
																		<ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
																	)}
																	{progress.trendDirection ===
																		"declining" && (
																		<ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
																	)}
																	{progress.trendDirection ===
																		"stable" && (
																		<MinusIcon className="h-4 w-4 text-gray-500" />
																	)}
																	{isSelected && (
																		<div className="w-2 h-2 bg-primary rounded-full"></div>
																	)}
																</div>
															</div>
															<div className="flex items-center justify-between text-xs text-muted-foreground">
																<span>
																	{
																		progress.completionRate
																	}
																	% completion
																</span>
																<span>
																	{
																		habit.streak
																	}
																	d streak
																</span>
															</div>
														</div>
													);
												})}
											</div>
										</div>

										{/* Mobile: Drawer trigger */}
										<div className="sm:hidden">
											<Drawer>
												<DrawerTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-between h-12"
													>
														<span className="truncate">
															{selectedHabit
																? selectedHabit.name
																: "Select a habit"}
														</span>
														<ChartBarIcon className="h-5 w-5 ml-2 flex-shrink-0" />
													</Button>
												</DrawerTrigger>
												<DrawerContent>
													<DrawerHeader>
														<DrawerTitle>
															Select Habit to
															Analyze
														</DrawerTitle>
													</DrawerHeader>
													<div className="p-4 space-y-3">
														{activeHabits.map(
															(habit) => {
																const progress =
																	analyzeHabitBuildingProgress(
																		habit
																	);
																const isSelected =
																	selectedHabit?.id ===
																	habit.id;
																return (
																	<div
																		key={
																			habit.id
																		}
																		className={`p-4 rounded-lg border cursor-pointer transition-colors ${
																			isSelected
																				? "bg-primary/10 border-primary/20"
																				: "hover:bg-muted/50"
																		}`}
																		onClick={() => {
																			handleHabitSelection(
																				habit
																			);
																			// Close drawer after selection
																			const drawer =
																				document.querySelector(
																					'[data-state="open"]'
																				) as HTMLElement;
																			if (
																				drawer
																			)
																				drawer.click();
																		}}
																	>
																		<div className="flex items-center justify-between mb-2">
																			<h4 className="font-medium text-sm truncate">
																				{
																					habit.name
																				}
																			</h4>
																			<div className="flex items-center gap-1">
																				{progress.trendDirection ===
																					"improving" && (
																					<ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
																				)}
																				{progress.trendDirection ===
																					"declining" && (
																					<ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
																				)}
																				{progress.trendDirection ===
																					"stable" && (
																					<MinusIcon className="h-4 w-4 text-gray-500" />
																				)}
																				{isSelected && (
																					<div className="w-2 h-2 bg-primary rounded-full"></div>
																				)}
																			</div>
																		</div>
																		<div className="flex items-center justify-between text-xs text-muted-foreground">
																			<span>
																				{
																					progress.completionRate
																				}

																				%
																				completion
																			</span>
																			<span>
																				{
																					habit.streak
																				}

																				d
																				streak
																			</span>
																		</div>
																	</div>
																);
															}
														)}
													</div>
												</DrawerContent>
											</Drawer>
										</div>
									</CardContent>
								</Card>

								{/* Habit Analysis - Only when habit is selected */}
								{selectedHabit ? (
									<div className="space-y-4">
										{/* Analysis Tabs */}
										<Tabs
											value={analysisTab}
											onValueChange={setAnalysisTab}
											className="space-y-4"
										>
											<ScrollArea className="w-full">
												<TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1">
													<TabsTrigger
														value="consistency"
														className="text-xs sm:text-sm py-2"
													>
														Consistency
													</TabsTrigger>
													<TabsTrigger
														value="patterns"
														className="text-xs sm:text-sm py-2"
													>
														Patterns
													</TabsTrigger>
													<TabsTrigger
														value="progress"
														className="text-xs sm:text-sm py-2"
													>
														Progress
													</TabsTrigger>
												</TabsList>
											</ScrollArea>

											<TabsContent
												value="consistency"
												className="space-y-4 mt-4"
											>
												<ConsistencyTab
													selectedHabit={
														selectedHabit
													}
												/>
											</TabsContent>

											<TabsContent
												value="patterns"
												className="space-y-4 mt-4"
											>
												<PatternsTab
													selectedHabit={
														selectedHabit
													}
												/>
											</TabsContent>

											<TabsContent
												value="progress"
												className="space-y-4 mt-4"
											>
												<ProgressTab
													selectedHabit={
														selectedHabit
													}
												/>
											</TabsContent>
										</Tabs>
									</div>
								) : (
									<div className="text-center py-12">
										<ChartBarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											Select a Habit
										</h3>
										<p className="text-muted-foreground">
											Choose a habit above to view
											detailed analytics
										</p>
									</div>
								)}
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</>
		);
	} catch (error) {
		console.error("Trends component error:", error);
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center p-8">
					<h1 className="text-2xl font-bold text-red-500 mb-4">
						Error Loading Analytics
					</h1>
					<p className="text-muted-foreground mb-4">
						There was an error loading the analytics data. Please
						try refreshing the page.
					</p>
					<Button asChild>
						<Link href="/habits">Back to Habits</Link>
					</Button>
				</div>
			</div>
		);
	}
}

// Overview Tab Component
const OverviewTab = ({
	overallAnalytics,
}: {
	overallAnalytics: ReturnType<typeof getOverallAnalytics>;
}) => {
	return (
		<div className="space-y-6">
			{/* All Habits Summary */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<MetricCard
					title="Total Habits"
					value={overallAnalytics.totalHabits}
					icon={<ChartBarIcon />}
				/>
				<MetricCard
					title="Average Rate"
					value={`${overallAnalytics.averageCompletionRate}%`}
					icon={<CheckCircleIcon />}
				/>
				<MetricCard
					title="Total Completions"
					value={overallAnalytics.totalCompletions}
					icon={<FireIcon />}
				/>
				<MetricCard
					title="Needs Attention"
					value={overallAnalytics.needsAttention.length}
					icon={<PauseIcon />}
				/>
			</div>

			{/* Best Performing Habit */}
			{overallAnalytics.bestPerformingHabit && (
				<div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<TrophyIcon className="h-5 w-5 text-green-600" />
						<h3 className="font-semibold text-green-900 dark:text-green-100">
							Best Performing Habit
						</h3>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-green-900 dark:text-green-100">
								{overallAnalytics.bestPerformingHabit.habitName}
							</p>
							<p className="text-sm text-green-700 dark:text-green-300">
								{
									overallAnalytics.bestPerformingHabit
										.completionRate
								}
								% completion rate
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Habits Needing Attention */}
			{overallAnalytics.needsAttention.length > 0 && (
				<div className="border rounded-lg p-4">
					<div className="flex items-center gap-2 mb-3">
						<PauseIcon className="h-5 w-5 text-red-600" />
						<h3 className="font-semibold text-red-900 dark:text-red-100">
							Habits Needing Attention
						</h3>
					</div>
					<div className="space-y-2">
						{overallAnalytics.needsAttention
							.slice(0, 2)
							.map((habit) => (
								<div
									key={habit.habitId}
									className="flex items-center justify-between p-4 rounded-lg border transition-colors"
								>
									<div>
										<p className="font-medium text-red-900 dark:text-red-100">
											{habit.habitName}
										</p>
										<p className="text-sm text-red-700 dark:text-red-300">
											{habit.completionRate}% completion
											rate
										</p>
									</div>
									<div className="flex items-center gap-2">
										{habit.trendDirection ===
											"declining" && (
											<ArrowTrendingDownIcon className="h-4 w-4 me-4 text-red-500" />
										)}
									</div>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

// Consistency Tab Component
const ConsistencyTab = ({
	selectedHabit,
}: {
	selectedHabit: HabitType | null;
}) => {
	if (!selectedHabit) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-64">
					<div className="text-center">
						<ChartBarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							Select a Habit
						</h3>
						<p className="text-muted-foreground">
							Choose a habit to view consistency analytics
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const metrics = calculateConsistencyMetrics(selectedHabit);
	const dayAnalysis = analyzeDayOfWeek(selectedHabit);
	const dayChartData = dayAnalysis.map((day) => ({
		name: day.day,
		value: day.completionRate,
	}));

	return (
		<div className="space-y-4">
			{/* Consistency Metrics */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<MetricCard
					title="Completion Rate"
					value={`${metrics.completionRate}%`}
					icon={<CheckCircleIcon />}
				/>
				<MetricCard
					title="Current Streak"
					value={`${selectedHabit.streak} days`}
					icon={<FireIcon />}
				/>
				<MetricCard
					title="Longest Streak"
					value={`${selectedHabit.longestStreak} days`}
					icon={<TrophyIcon />}
				/>
				<MetricCard
					title="Average Streak"
					value={`${metrics.averageStreak} days`}
					icon={<ChartBarIcon />}
				/>
			</div>

			{/* Day of Week Performance */}
			<Card>
				<CardHeader>
					<CardTitle>Completion Rate by Day of Week</CardTitle>
					<CardDescription className="text-xs pb-4">
						Percentage of times you completed this habit on each day
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AnalyticsChart
						data={dayChartData}
						type="bar"
						color="#3b82f6"
						height={250}
						valueLabel="Completion Rate"
						valueSuffix="%"
					/>
					<div className="mt-3 text-xs text-muted-foreground">
						💡 <strong>Tip:</strong> Look for patterns - are you
						more consistent on certain days?
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

// Patterns Tab Component
const PatternsTab = ({
	selectedHabit,
}: {
	selectedHabit: HabitType | null;
}) => {
	if (!selectedHabit) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-64">
					<div className="text-center">
						<ChartBarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							Select a Habit
						</h3>
						<p className="text-muted-foreground">
							Choose a habit to view pattern analytics
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const timeAnalysis = analyzeTimePeriods(selectedHabit);
	const weeklyChartData = timeAnalysis.weekly.slice(-8).map((week) => ({
		name: week.period,
		value: week.completionRate,
	}));
	const monthlyChartData = timeAnalysis.monthly.map((month) => ({
		name: month.period,
		value: month.completionRate,
	}));

	return (
		<div className="space-y-4">
			{/* Weekly Trends */}
			<Card>
				<CardHeader>
					<CardTitle>Last 8 Weeks</CardTitle>
					<CardDescription className="text-xs pb-4">
						Percentage of days you completed this habit each week
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AnalyticsChart
						data={weeklyChartData}
						type="line"
						color="#10b981"
						height={200}
						valueLabel="Weekly Completion Rate"
						valueSuffix="%"
					/>
					<div className="mt-3 text-xs text-muted-foreground">
						💡 <strong>Example:</strong> 85% means you completed the
						habit on 6 out of 7 days that week
					</div>
				</CardContent>
			</Card>

			{/* Monthly Trends */}
			<Card>
				<CardHeader>
					<CardTitle>Last 6 Months</CardTitle>
					<CardDescription className="text-xs pb-4">
						Percentage of days you completed this habit each month
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AnalyticsChart
						data={monthlyChartData}
						type="bar"
						color="#f59e0b"
						height={200}
						valueLabel="Monthly Completion Rate"
						valueSuffix="%"
					/>
					<div className="mt-3 text-xs text-muted-foreground">
						💡 <strong>Example:</strong> 70% means you completed the
						habit on 21 out of 30 days that month
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

// Progress Tab Component
const ProgressTab = ({
	selectedHabit,
}: {
	selectedHabit: HabitType | null;
}) => {
	if (!selectedHabit) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-64">
					<div className="text-center">
						<ChartBarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							Select a Habit
						</h3>
						<p className="text-muted-foreground">
							Choose a habit to view progress analytics
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const progress = analyzeHabitBuildingProgress(selectedHabit);
	const streakAnalysis = analyzeStreakPatterns(selectedHabit);

	return (
		<div className="space-y-4">
			{/* Progress Overview */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<MetricCard
					title="Days Since Start"
					value={progress.daysSinceStart}
					icon={<CalendarIcon />}
				/>
				<MetricCard
					title="Recent Performance"
					value={`${progress.recentPerformance}%`}
					icon={<ChartBarIcon />}
				/>
				<MetricCard
					title="Average Streak"
					value={`${streakAnalysis.averageStreakLength} days`}
					icon={<FireIcon />}
				/>
				<MetricCard
					title="Average Break"
					value={`${streakAnalysis.averageBreakLength} days`}
					icon={<PauseIcon />}
				/>
			</div>

			{/* Trend Analysis */}
			<Card>
				<CardHeader>
					<CardTitle>Progress Analysis</CardTitle>
					<CardDescription className="pb-4">
						How you&apos;re doing with building this habit
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">
								Overall Progress
							</span>
							<div className="flex items-center gap-2">
								{progress.trendDirection === "improving" && (
									<ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
								)}
								{progress.trendDirection === "declining" && (
									<ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
								)}
								{progress.trendDirection === "stable" && (
									<MinusIcon className="h-4 w-4 text-gray-500" />
								)}
								<span className="text-sm capitalize">
									{progress.trendDirection}
								</span>
							</div>
						</div>

						<Separator />

						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Completion Rate</span>
								<span>{progress.completionRate}%</span>
							</div>
							<Progress
								value={progress.completionRate}
								className="h-2"
							/>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Recent Performance (30 days)</span>
								<span>{progress.recentPerformance}%</span>
							</div>
							<Progress
								value={progress.recentPerformance}
								className="h-2"
							/>
						</div>

						{/* Trend Messages */}
						{progress.trendDirection === "improving" && (
							<p className="text-xs text-green-600">
								🎉 Great job! Your recent performance is
								improving. Keep up the momentum!
							</p>
						)}
						{progress.trendDirection === "declining" && (
							<p className="text-xs text-red-600">
								⚠️ Recent performance is below average. Consider
								adjusting your approach.
							</p>
						)}
						{progress.trendDirection === "stable" && (
							<p className="text-xs text-gray-600">
								📊 Consistent performance. Consider pushing for
								improvement.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
