"use client";

import githubLight from "@/app/assets/github-mark-white.png";
import githubDark from "@/app/assets/github-mark.png";
import habitsDark from "@/app/assets/habits-dark.png";
import habitsLight from "@/app/assets/habits-light.png";
import mapDark from "@/app/assets/map-dark.png";
import mapLight from "@/app/assets/map-light.png";
import offlineDark from "@/app/assets/offline-dark.png";
import offlineLight from "@/app/assets/offline-light.png";
import pauseDark from "@/app/assets/pause-dark.png";
import pauseLight from "@/app/assets/pause-light.png";
import streaksDark from "@/app/assets/streaks-dark.png";
import streaksLight from "@/app/assets/streaks-light.png";
import logo from "@/app/favicon.ico";
import { ThemePicker } from "@/components/theme-picker";
import { Trail } from "@/components/trail";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	FireIcon,
	MapIcon,
	PauseCircleIcon,
	WifiIcon,
} from "@heroicons/react/24/outline";
import {
	ArrowLeftIcon,
	ArrowUpIcon,
	CheckIcon,
} from "@heroicons/react/24/solid";
import {
	animated,
	AnimatedProps,
	useSpringRef,
	useTransition,
} from "@react-spring/web";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";

export default function Home() {
	const [activeCard, setActiveCard] = useState(0);

	const transRef = useSpringRef();

	const transitions = useTransition(activeCard, {
		ref: transRef,
		keys: null,
		from: { opacity: 0, transform: "translate3d(100%,0,0)" },
		enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
	});

	const onCardClick = (index: number) => {
		setActiveCard(index);
	};

	useEffect(() => {
		transRef.start();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeCard]);

	return (
		<div>
			<div className="sticky backdrop-blur-md top-0 z-50">
				<Alert className="border-s-0 border-e-0 rounded-none bg-background/40">
					<AlertDescription className="flex justify-between items-center">
						<Link className="flex items-center" href="/">
							<Image
								src={logo}
								alt="logo"
								width={28}
								height={28}
							/>
						</Link>
						<div className="flex items-center space-x-2">
							<Link
								href="https://github.com/MuffinTheDragon/daily-habit-tracker"
								target="_blank"
							>
								<Image
									src={githubDark}
									width={28}
									height={28}
									alt="github"
									className="dark:hidden"
								/>
								<Image
									width={28}
									height={28}
									src={githubLight}
									alt="github"
									className="hidden dark:block"
								/>
							</Link>
							<ThemePicker />
							<Link href="/habits">
								<Button variant="secondary" size="sm">
									Track your habits
								</Button>
							</Link>
						</div>
					</AlertDescription>
				</Alert>
			</div>

			<div className="flex flex-col md:items-center justify-between p-4 space-y-8">
				<div className="bg-secondary justify-center flex w-full">
					<div className="px-4 items-center">
						<h1 className="scroll-m-20 space-y-4 text-4xl font-extrabold tracking-wide lg:text-5xl my-10 text-center">
							<Trail open>
								<p>Track all your</p>
								{/* <p>all</p> */}
								{/* <p>your</p> */}
								<p>daily habits</p>
								{/* <p>habits</p> */}
							</Trail>
							<Trail open>
								<Link href="/habits">
									<Button>Track your habits</Button>
								</Link>
								<p className="underline text-xs underline-offset-4 mt-4">
									No account required
								</p>
							</Trail>
						</h1>
						<div className="-mt-10 mb-2 justify-center flex">
							<Image
								src={habitsDark}
								alt="habits"
								className="rounded-lg hidden dark:block"
							/>
							<Image
								src={habitsLight}
								alt="habits"
								className="rounded-lg dark:hidden"
							/>
						</div>
					</div>
				</div>
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Features
				</h2>
				<div className="flex flex-col border-b pb-8">
					<div className="relative z-10 flex gap-x-4 overflow-x-auto pb-4 whitespace-nowrap px-4 sm:whitespace-normal sm:justify-center">
						<div
							onClick={() => onCardClick(0)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 0 }
							)}
						>
							<div>
								<WifiIcon className="w-5 h-5 mb-2 hidden md:block" />
								<p>Offline use</p>
							</div>
							<div className="mt-2 hidden md:block">
								<p>
									You can use this app fully offline for as
									long as you want!
								</p>
							</div>
						</div>
						<div
							onClick={() => onCardClick(1)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 1 }
							)}
						>
							<div>
								<FireIcon className="w-5 h-5 mb-2 hidden md:block" />
								<p>Streaks</p>
							</div>
							<div className="mt-2 hidden md:block">
								<p>
									Track your streaks for each habit. Along
									with your completions and longest streaks
								</p>
							</div>
						</div>
						<div
							onClick={() => onCardClick(2)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 2 }
							)}
						>
							<div>
								<PauseCircleIcon className="w-5 h-5 mb-2 hidden md:block" />
								<p>Pausing</p>
							</div>
							<div className="mt-2 hidden md:block">
								<p>
									Need a break? Pause the app and come back to
									pick up right where you left off
								</p>
							</div>
						</div>
						<div
							onClick={() => onCardClick(3)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 3 }
							)}
						>
							<div>
								<MapIcon className="w-5 h-5 mb-2 hidden md:block" />
								<p>Visualize your progress</p>
							</div>
							<div className="mt-2 hidden md:block">
								<p>
									View your daily completions on a simple to
									use visual map
								</p>
							</div>
						</div>
					</div>

					<div className="mt-12 overflow-hidden">
						{transitions((style, i) => {
							const CardSection = cards[i];
							return <CardSection style={style} />;
						})}
					</div>
				</div>
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Pricing
				</h2>
				<div className="flex space-y-8 flex-col md:flex-row md:space-x-8 md:space-y-0">
					<div className="border rounded-2xl p-10 md:w-[350px] space-y-4">
						<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							Free
						</h3>
						<p className="text-muted-foreground text-sm">
							All the core features included for free
						</p>
						<div className="mt-4 space-y-4">
							<div className="flex items-center">
								<CheckIcon className="w-5 h-5 me-2" />
								<p>Track unlimited habits</p>
							</div>
							<div className="flex items-center">
								<CheckIcon className="w-5 h-5 me-2" />
								<p>Offline use</p>
							</div>
							<div className="flex items-center">
								<CheckIcon className="w-5 h-5 me-2" />
								<p>Track streaks</p>
							</div>
							<div className="flex items-center">
								<CheckIcon className="w-5 h-5 me-2" />
								<p>Pause the app</p>
							</div>
							<div className="flex items-center">
								<CheckIcon className="w-5 h-5 me-2" />
								<p>Sync data for 30 days</p>
							</div>
						</div>
					</div>
					<div className="border rounded-2xl p-10 md:w-[350px] space-y-4">
						<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							Premium
						</h3>
						<p className="text-muted-foreground text-sm">
							$0.99 USD per month
						</p>
						<div className="mt-4 space-y-4">
							<div className="flex items-center">
								<ArrowLeftIcon className="w-5 h-5 me-2 hidden md:block" />
								<ArrowUpIcon className="w-5 h-5 me-2 md:hidden" />
								<p> Everything in free</p>
							</div>
							<div className="flex items-center">
								<CheckIcon className="w-5 h-5 me-2" />
								<p>Sync data forever</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const cards: ((
	props: AnimatedProps<{ style: CSSProperties }>
) => React.ReactElement)[] = [
	({ style }) => (
		<animated.div style={{ ...style }}>
			<div className="grid grid-cols-1 md:grid-cols-2 items-center">
				<div className="md:px-12 mb-4 ms-4">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Offline use
					</h3>
					<p className="text-xl text-muted-foreground max-w-3xl">
						This app can be fully used offline for however long you
						want! You can sign in with your email if you want to
						sync your data between devices
					</p>
				</div>
				<div className="w-full flex justify-center">
					<Image
						src={offlineDark}
						alt="map"
						className="rounded-3xl hidden dark:block"
					/>
					<Image
						src={offlineLight}
						alt="map"
						className="rounded-3xl dark:hidden"
					/>
				</div>
			</div>
		</animated.div>
	),
	({ style }) => (
		<animated.div style={{ ...style }}>
			<div className="grid grid-cols-1 md:grid-cols-2 items-center">
				<div className="md:px-12 mb-4 ms-4">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Track your streaks
					</h3>
					<p className="text-xl text-muted-foreground max-w-3xl">
						Each time you complete a task, watch your streak counter
						go up. You also get <b>streak freezes</b> that will
						automatically be used in case you miss a day
					</p>
				</div>
				<div className="w-full flex justify-center">
					<Image
						src={streaksDark}
						alt="map"
						className="rounded-3xl hidden dark:block"
					/>
					<Image
						src={streaksLight}
						alt="map"
						className="rounded-3xl dark:hidden"
					/>
				</div>
			</div>
		</animated.div>
	),
	({ style }) => (
		<animated.div style={{ ...style }}>
			<div className="grid grid-cols-1 md:grid-cols-2 items-center">
				<div className="md:px-12 mb-4 ms-4">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Pause your activity
					</h3>
					<p className="text-xl text-muted-foreground max-w-3xl">
						Need a break? Pause your activity right from the app.
						When you get back, pick up right where you left off
						without losing your streaks
					</p>
				</div>
				<div className="w-full flex justify-center">
					<Image
						src={pauseDark}
						alt="map"
						className="rounded-3xl hidden dark:block"
					/>
					<Image
						src={pauseLight}
						alt="map"
						className="rounded-3xl dark:hidden"
					/>
				</div>
			</div>
		</animated.div>
	),
	({ style }) => (
		<animated.div style={{ ...style }}>
			<div className="grid grid-cols-1 md:grid-cols-2 items-center">
				<div className="md:px-12 mb-4 ms-4">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Visualize your progress
					</h3>
					<p className="text-xl text-muted-foreground max-w-3xl">
						View your completion history for each habit with a
						simple visual map
					</p>
				</div>
				<div className="w-full flex justify-center">
					<Image
						src={mapDark}
						alt="map"
						className="rounded-3xl hidden dark:block"
					/>
					<Image
						src={mapLight}
						alt="map"
						className="rounded-3xl dark:hidden"
					/>
				</div>
			</div>
		</animated.div>
	),
];
