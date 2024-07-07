"use client";

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
import githubDark from "@/app/assets/github-mark.png";
import githubLight from "@/app/assets/github-mark-white.png";
import logo from "@/app/favicon.ico";
import { ThemePicker } from "@/components/theme-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	FireIcon,
	MapIcon,
	PauseCircleIcon,
	WifiIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	const [activeCard, setActiveCard] = useState(1);

	return (
		<div>
			<div className="sticky backdrop-blur-md top-0">
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

			<div className="flex flex-col md:items-center justify-between p-4 md:py-24 space-y-8">
				<div className="bg-secondary w-screen justify-center flex">
					<div className="grid md:grid-cols-3 px-4 items-center">
						<h1 className="scroll-m-20 space-y-4 text-4xl font-extrabold tracking-wide lg:text-5xl ps-10 my-10 md:mt-0 md:w-48 md:col-span-1">
							Track all your daily habits
							<div>
								<Link href="/habits">
									<Button>Track your habits</Button>
								</Link>
								<p className="underline text-xs underline-offset-4 mt-4">
									No account required
								</p>
							</div>
						</h1>
						<div className="md:col-span-2 items-center hidden md:flex">
							<Separator
								orientation="vertical"
								className="h-[34rem] mx-4"
							/>
							<Image
								src={habitsDark}
								alt="habits"
								className="rounded-3xl hidden dark:block"
							/>
							<Image
								src={habitsLight}
								alt="habits"
								className="rounded-3xl dark:hidden"
							/>
						</div>
					</div>
				</div>
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Features
				</h2>
				<div className="flex flex-col">
					<div className="relative z-10 flex gap-x-4 overflow-x-auto pb-4 whitespace-nowrap px-4 sm:whitespace-normal">
						<div
							onClick={() => setActiveCard(1)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 1 }
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
							onClick={() => setActiveCard(2)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 2 }
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
							onClick={() => setActiveCard(3)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 3 }
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
							onClick={() => setActiveCard(4)}
							className={cn(
								"border max-w-sm cursor-pointer md:hover:bg-muted/40 rounded-lg p-2 sm:p-6",
								{ "bg-muted": activeCard === 4 }
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

					<div className="mt-12 overflow-y-visible">
						{activeCard === 1 && (
							<div className="grid grid-cols-1 md:grid-cols-2 items-center">
								<div className="md:px-12 mb-4 ms-4">
									<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
										Offline use
									</h3>
									<p className="text-xl text-muted-foreground max-w-3xl">
										This app can be fully used offline for
										however long you want! You can sign in
										with your email if you want to sync your
										data between devices
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
						)}

						{activeCard === 2 && (
							<div className="grid grid-cols-1 md:grid-cols-2 items-center">
								<div className="md:px-12 mb-4 ms-4">
									<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
										Track your streaks
									</h3>
									<p className="text-xl text-muted-foreground max-w-3xl">
										Each time you complete a task, watch
										your streak counter go up. You also get{" "}
										<b>streak freezes</b> that will
										automatically be used in case you miss a
										day
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
						)}

						{activeCard === 3 && (
							<div className="grid grid-cols-1 md:grid-cols-2 items-center">
								<div className="md:px-12 mb-4 ms-4">
									<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
										Pause your activity
									</h3>
									<p className="text-xl text-muted-foreground max-w-3xl">
										Need a break? Pause your activity right
										from the app. When you get back, pick up
										right where you left off without losing
										your streaks
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
						)}

						{activeCard === 4 && (
							<div className="grid grid-cols-1 md:grid-cols-2 items-center">
								<div className="md:px-12 mb-4 ms-4">
									<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
										Visualize your progress
									</h3>
									<p className="text-xl text-muted-foreground max-w-3xl">
										View your completion history for each
										habit with a simple visual map
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
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
