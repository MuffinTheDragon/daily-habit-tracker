import { GraphType, HabitType } from "@/data/HabitType";
import {
	differenceInDays,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	getDay,
	isAfter,
	isBefore,
	isEqual,
	isWithinInterval,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from "date-fns";

export interface ConsistencyMetrics {
	completionRate: number; // Percentage of days completed
	averageStreak: number;
	longestStreak: number;
	totalCompletions: number;
	daysTracked: number;
}

export interface DayOfWeekAnalysis {
	day: string;
	dayNumber: number;
	completionRate: number;
	totalDays: number;
	completedDays: number;
}

export interface TimePeriodAnalysis {
	period: string;
	completionRate: number;
	totalDays: number;
	completedDays: number;
	averageStreak: number;
}

export interface HabitBuildingProgress {
	habitId: string;
	habitName: string;
	currentStreak: number;
	longestStreak: number;
	completionRate: number;
	trendDirection: "improving" | "declining" | "stable";
	daysSinceStart: number;
	recentPerformance: number; // Last 30 days completion rate
}

export interface StreakAnalysis {
	currentStreak: number;
	longestStreak: number;
	averageStreakLength: number;
	streakBreaks: number;
	averageBreakLength: number;
	streakConsistency: number; // How consistent streaks are
}

/**
 * Calculate consistency metrics for a habit
 */
export function calculateConsistencyMetrics(
	habit: HabitType
): ConsistencyMetrics {
	const allCheckedDays = habit.graph.flatMap((year) => [
		...year.daysChecked,
		...year.manualDaysChecked,
	]);

	const daysTracked = differenceInDays(new Date(), habit.created) + 1;
	const totalCompletions = allCheckedDays.length;
	const completionRate =
		daysTracked > 0 ? (totalCompletions / daysTracked) * 100 : 0;

	return {
		completionRate: Math.round(completionRate * 100) / 100,
		averageStreak: calculateAverageStreak(habit),
		longestStreak: habit.longestStreak,
		totalCompletions,
		daysTracked,
	};
}

/**
 * Analyze which days of the week are most/least successful
 */
export function analyzeDayOfWeek(habit: HabitType): DayOfWeekAnalysis[] {
	const allCheckedDays = habit.graph.flatMap((year) => [
		...year.daysChecked,
		...year.manualDaysChecked,
	]);

	const dayStats = Array.from({ length: 7 }, (_, i) => ({
		day: format(new Date(2024, 0, i + 1), "EEEE"), // Get day name
		dayNumber: i,
		totalDays: 0,
		completedDays: 0,
	}));

	// Count total days and completed days for each day of week
	const startDate = habit.created;
	const endDate = new Date();

	eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
		const dayOfWeek = getDay(date);
		dayStats[dayOfWeek].totalDays++;

		// Compare dates by date only, not time
		if (
			allCheckedDays.some(
				(checkedDate) =>
					checkedDate.getFullYear() === date.getFullYear() &&
					checkedDate.getMonth() === date.getMonth() &&
					checkedDate.getDate() === date.getDate()
			)
		) {
			dayStats[dayOfWeek].completedDays++;
		}
	});

	return dayStats.map((stat) => ({
		...stat,
		completionRate:
			stat.totalDays > 0
				? Math.round(
						(stat.completedDays / stat.totalDays) * 100 * 100
				  ) / 100
				: 0,
	}));
}

/**
 * Analyze performance over different time periods
 */
export function analyzeTimePeriods(habit: HabitType): {
	weekly: TimePeriodAnalysis[];
	monthly: TimePeriodAnalysis[];
} {
	const allCheckedDays = habit.graph.flatMap((year) => [
		...year.daysChecked,
		...year.manualDaysChecked,
	]);

	const weeklyAnalysis: TimePeriodAnalysis[] = [];
	const monthlyAnalysis: TimePeriodAnalysis[] = [];

	// Get last 12 weeks
	for (let i = 11; i >= 0; i--) {
		const currentDate = new Date();
		const weekStart = startOfWeek(subWeeks(currentDate, i));
		const weekEnd = endOfWeek(weekStart);

		const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
		const completedDays = weekDays.filter((day) =>
			allCheckedDays.some(
				(checkedDate) =>
					checkedDate.getFullYear() === day.getFullYear() &&
					checkedDate.getMonth() === day.getMonth() &&
					checkedDate.getDate() === day.getDate()
			)
		).length;

		weeklyAnalysis.push({
			period: format(weekStart, "MMM dd"),
			completionRate:
				Math.round((completedDays / weekDays.length) * 100 * 100) / 100,
			totalDays: weekDays.length,
			completedDays,
			averageStreak: calculateStreakForPeriod(habit, weekStart, weekEnd),
		});
	}

	// Get last 6 months
	for (let i = 5; i >= 0; i--) {
		const currentDate = new Date();
		const monthStart = startOfMonth(subMonths(currentDate, i));
		const monthEnd = endOfMonth(monthStart);

		const monthDays = eachDayOfInterval({
			start: monthStart,
			end: monthEnd,
		});
		const completedDays = monthDays.filter((day) =>
			allCheckedDays.some(
				(checkedDate) =>
					checkedDate.getFullYear() === day.getFullYear() &&
					checkedDate.getMonth() === day.getMonth() &&
					checkedDate.getDate() === day.getDate()
			)
		).length;

		monthlyAnalysis.push({
			period: format(monthStart, "MMM yyyy"),
			completionRate:
				Math.round((completedDays / monthDays.length) * 100 * 100) /
				100,
			totalDays: monthDays.length,
			completedDays,
			averageStreak: calculateStreakForPeriod(
				habit,
				monthStart,
				monthEnd
			),
		});
	}

	return { weekly: weeklyAnalysis, monthly: monthlyAnalysis };
}

/**
 * Analyze habit building progress and trends
 */
export function analyzeHabitBuildingProgress(
	habit: HabitType
): HabitBuildingProgress {
	const metrics = calculateConsistencyMetrics(habit);
	const daysSinceStart = differenceInDays(new Date(), habit.created);

	// Calculate recent performance (last 30 days)
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	const recentCheckedDays = habit.graph
		.flatMap((year) => [...year.daysChecked, ...year.manualDaysChecked])
		.filter((date) => isAfter(date, thirtyDaysAgo));

	// For habits that are very new (less than 7 days), don't calculate trends
	const recentPerformance =
		daysSinceStart < 7
			? metrics.completionRate // Use overall rate for very new habits
			: Math.round((recentCheckedDays.length / 30) * 100 * 100) / 100;

	// Determine trend direction - be more conservative for new habits
	let trendDirection: "improving" | "declining" | "stable" = "stable";
	if (daysSinceStart >= 7) {
		// Only calculate trends for habits older than a week
		if (recentPerformance > metrics.completionRate + 10) {
			// Increased threshold
			trendDirection = "improving";
		} else if (recentPerformance < metrics.completionRate - 10) {
			// Increased threshold
			trendDirection = "declining";
		}
	}

	return {
		habitId: habit.id,
		habitName: habit.name,
		currentStreak: habit.streak,
		longestStreak: habit.longestStreak,
		completionRate: metrics.completionRate,
		trendDirection,
		daysSinceStart,
		recentPerformance,
	};
}

/**
 * Analyze streak patterns and consistency
 */
export function analyzeStreakPatterns(habit: HabitType): StreakAnalysis {
	const allCheckedDays = habit.graph
		.flatMap((year) => [...year.daysChecked, ...year.manualDaysChecked])
		.sort((a, b) => a.getTime() - b.getTime());

	const streaks: number[] = [];
	const breaks: number[] = [];
	let currentStreak = 0;
	let currentBreak = 0;
	let inStreak = false;

	const startDate = habit.created;
	const endDate = new Date();

	eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
		const isCompleted = allCheckedDays.some(
			(checkedDate) =>
				checkedDate.getFullYear() === date.getFullYear() &&
				checkedDate.getMonth() === date.getMonth() &&
				checkedDate.getDate() === date.getDate()
		);

		if (isCompleted) {
			if (inStreak) {
				currentStreak++;
			} else {
				if (currentBreak > 0) {
					breaks.push(currentBreak);
				}
				currentStreak = 1;
				inStreak = true;
			}
			currentBreak = 0;
		} else {
			if (inStreak) {
				streaks.push(currentStreak);
				currentStreak = 0;
				inStreak = false;
			}
			currentBreak++;
		}
	});

	// Add final streak if we ended in a streak
	if (inStreak && currentStreak > 0) {
		streaks.push(currentStreak);
	}

	const averageStreakLength =
		streaks.length > 0
			? streaks.reduce((a, b) => a + b, 0) / streaks.length
			: 0;
	const averageBreakLength =
		breaks.length > 0
			? breaks.reduce((a, b) => a + b, 0) / breaks.length
			: 0;

	// Calculate streak consistency (lower standard deviation = more consistent)
	const streakVariance =
		streaks.length > 1
			? streaks.reduce(
					(sum, streak) =>
						sum + Math.pow(streak - averageStreakLength, 2),
					0
			  ) /
			  (streaks.length - 1)
			: 0;
	const streakConsistency = Math.max(0, 100 - Math.sqrt(streakVariance) * 10);

	return {
		currentStreak: habit.streak,
		longestStreak: habit.longestStreak,
		averageStreakLength: Math.round(averageStreakLength * 100) / 100,
		streakBreaks: breaks.length,
		averageBreakLength: Math.round(averageBreakLength * 100) / 100,
		streakConsistency: Math.round(streakConsistency * 100) / 100,
	};
}

/**
 * Helper function to calculate average streak length
 */
function calculateAverageStreak(habit: HabitType): number {
	const streakAnalysis = analyzeStreakPatterns(habit);
	return streakAnalysis.averageStreakLength;
}

/**
 * Helper function to calculate streak for a specific period
 */
function calculateStreakForPeriod(
	habit: HabitType,
	startDate: Date,
	endDate: Date
): number {
	const allCheckedDays = habit.graph
		.flatMap((year) => [...year.daysChecked, ...year.manualDaysChecked])
		.filter((date) =>
			isWithinInterval(date, { start: startDate, end: endDate })
		)
		.sort((a, b) => b.getTime() - a.getTime()); // Sort descending

	if (allCheckedDays.length === 0) return 0;

	let streak = 0;
	let currentDate = new Date(endDate);

	for (const checkedDate of allCheckedDays) {
		if (
			currentDate.getFullYear() === checkedDate.getFullYear() &&
			currentDate.getMonth() === checkedDate.getMonth() &&
			currentDate.getDate() === checkedDate.getDate()
		) {
			streak++;
			currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
		} else {
			break;
		}
	}

	return streak;
}

/**
 * Get overall analytics summary for all habits
 */
export function getOverallAnalytics(habits: HabitType[]): {
	totalHabits: number;
	averageCompletionRate: number;
	totalCompletions: number;
	bestPerformingHabit: HabitBuildingProgress | null;
	needsAttention: HabitBuildingProgress[];
} {
	if (habits.length === 0) {
		return {
			totalHabits: 0,
			averageCompletionRate: 0,
			totalCompletions: 0,
			bestPerformingHabit: null,
			needsAttention: [],
		};
	}

	const habitProgresses = habits
		.filter((habit) => !habit.archived)
		.map((habit) => analyzeHabitBuildingProgress(habit));

	const averageCompletionRate =
		habitProgresses.length > 0
			? Math.round(
					(habitProgresses.reduce(
						(sum, h) => sum + h.completionRate,
						0
					) /
						habitProgresses.length) *
						100
			  ) / 100
			: 0;

	const totalCompletions = habits.reduce(
		(sum, habit) => sum + habit.checks,
		0
	);

	const bestPerformingHabit =
		habitProgresses.length > 0
			? habitProgresses.reduce((best, current) =>
					current.completionRate > best.completionRate
						? current
						: best
			  )
			: null;

	const needsAttention = habitProgresses
		.filter((habit) => {
			// Don't flag habits that are very new (less than 7 days)
			if (habit.daysSinceStart < 7) return false;

			// Don't flag habits with high completion rates (80%+)
			if (habit.completionRate >= 80) return false;

			// Flag habits with low completion rates (below 40%) OR declining trends
			return (
				habit.completionRate < 40 ||
				habit.trendDirection === "declining"
			);
		})
		.sort((a, b) => a.completionRate - b.completionRate);

	return {
		totalHabits: habits.filter((habit) => !habit.archived).length,
		averageCompletionRate,
		totalCompletions,
		bestPerformingHabit,
		needsAttention,
	};
}
