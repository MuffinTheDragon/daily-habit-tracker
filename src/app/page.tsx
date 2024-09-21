"use client";

import githubLight from "@/app/assets/github-mark-white.png";
import githubDark from "@/app/assets/github-mark.png";
import habitsDark from "@/app/assets/habits-dark.png";
import habitsLight from "@/app/assets/habits-light.png";
import logo from "@/app/favicon.ico";
import { ThemePicker } from "@/components/theme-picker";
import { Trail } from "@/components/trail";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { HabitCard } from "@/components/habit-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultHabits } from "@/data/defaultHabits";
import { UserType } from "@/data/userType";
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

const user: UserType = {
	id: "user",
	created: new Date(),
	pauseStreaks: true,
	pauses: [
		[new Date("2024 01 08"), new Date("2024 01 08")],
		[new Date("2024 01 16"), new Date("2024 01 17")],
		[new Date("2024 01 23"), new Date("2024 01 28")],
	],
};

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
				<div className="bg-secondary justify-center flex w-full rounded-lg">
					<div className="px-4 items-center">
						<h1 className="scroll-m-20 space-y-4 text-4xl font-extrabold tracking-wide lg:text-5xl my-10 text-center">
							<Trail open>
								<p>Daily habit tracker</p>
							</Trail>
							<Trail open>
								<p className="text-base tracking-normal font-normal">
									Focus on building good habits while
									eliminating all the stress
								</p>
							</Trail>
							<Trail open>
								<Link href="/habits">
									<Button>Track your habits</Button>
								</Link>
								<p className="underline text-xs underline-offset-4 mt-4">
									No account required
								</p>
							</Trail>
							<Trail open>
								<a
									href="https://www.producthunt.com/posts/daily-habit-tracker?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-daily&#0045;habit&#0045;tracker"
									target="_blank"
									className="flex justify-center"
								>
									<img
										src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=473513&theme=light"
										alt="Daily&#0032;habit&#0032;tracker - Minimalist&#0032;daily&#0032;habit&#0032;tracker | Product Hunt"
										width="200"
										height="54"
									/>
								</a>
							</Trail>
						</h1>
						<div className="-mt-4 mb-2 justify-center flex">
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
				<div className="max-w-2xl md:text-center">
					<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						Everything you need to effortlessly track all your
						habits
					</h2>
					<p className="leading-7 [&:not(:first-child)]:mt-6">
						The perfect habit tracker to motivate and help you build
						good habits, while being flexible enough to suit your
						daily life.
					</p>
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
				<div className="max-w-2xl md:text-center">
					<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						Available on all of your devices
					</h2>
					<p className="leading-7 [&:not(:first-child)]:mt-6">
						This app is a fully functional progressive web app,
						which means it works seamlessly on both your laptop and
						mobile device, just like any native app. To install it
						on your mobile device, simply follow the instructions
						provided here:{" "}
					</p>
					<br />
					<a
						href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
						className="underline underline-offset-2"
						target="_blank"
					>
						https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/
					</a>
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
				<div className="bg-muted flex flex-col w-full md:items-center p-10 rounded-lg">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Get started now!
					</h3>
					<p className="leading-7 [&:not(:first-child)]:mt-6">
						Start tracking your habits for free, no account
						required!
					</p>
					<Link href="/habits">
						<Button className="mt-4" size="lg">
							Start now
						</Button>
					</Link>
				</div>
				<div className="w-full p-4 md:p-10 space-y-4 pb-16">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Frequently asked questions
					</h3>
					<p className="text-muted-foreground">
						For other questions or concerns, send us an email at
						rdht.contact@gmail.com
					</p>
					<Accordion type="single" collapsible className="space-y-4">
						<AccordionItem value="item-1">
							<AccordionTrigger className="text-left">
								How does offline mode work?
							</AccordionTrigger>
							<AccordionContent>
								The data is always stored locally in your{" "}
								<b>browser&apos;s cache</b> and the habits page
								is cached, so the app will always work offline.
								When you go back online, the changes you made
								will sync with the cloud (assuming your account
								can sync). For more information on syncing,{" "}
								<Link
									href="https://dexie.org/cloud/docs/consistency"
									target="_blank"
									className="underline underline-offset-4"
								>
									see the docs
								</Link>
								.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2">
							<AccordionTrigger className="text-left">
								What happens if my cache is erased?
							</AccordionTrigger>
							<AccordionContent>
								Any changes you made after the last time your
								data synced will be lost. If this happens, you
								can reach out to us and we will be happy to help
								you restore your data.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger className="text-left">
								When do the habits go to the next day?
							</AccordionTrigger>
							<AccordionContent>
								You have until midnight each day to check off
								your habit for that day.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4">
							<AccordionTrigger className="text-left">
								How do the streak freezes work?
							</AccordionTrigger>
							<AccordionContent>
								Each habit has 3 streak freezes. Everyime you
								check a habit for the day, your freezes reset.
								You can miss up to 3 days before you lose your
								streak.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-5">
							<AccordionTrigger className="text-left">
								What happens after 30 days of sync?
							</AccordionTrigger>
							<AccordionContent>
								After the 30 days, your data will no longer sync
								with our server. You can continue to use the app
								on your device. If you login to another device,
								your data will not be available. If you want to
								switch to another device, you can export your
								data from the settings on your current device.
								Then, import on your new device and login. You
								can also upgrade to premium to continue syncing
								between devices.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-6">
							<AccordionTrigger className="text-left">
								What happens if I completed a habit but forgot
								to check it off?
							</AccordionTrigger>
							<AccordionContent>
								This will count as a missed day. You can use the
								calendar option for each habit to check off
								previously missed days. This will not update
								your streaks or freezes and is simply there to
								help track your consistency.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-7">
							<AccordionTrigger className="text-left">
								What happens if I need a break or will be away?
							</AccordionTrigger>
							<AccordionContent>
								The app is flexible to your needs. If you need
								some time off, you can pause the app from the
								settings. This will freeze the app in its
								current state and you can pick up where you left
								off when you get back.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
				<div className="bg-muted p-10 w-full space-y-4 rounded-lg">
					<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
						Daily habit tracker
					</h4>
					<p>A simple and minimalistic daily habit tracker app</p>
					<p className="text-muted-foreground">
						&copy; dailyhabits.dev
					</p>
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
						The data is stored in your browser&apos;s cache, meaning
						this app can be fully used offline for however long you
						want! You can sign in with your email if you want to
						sync your data between devices
					</p>
				</div>
				<div className="w-full flex justify-center">
					<Card className="w-[500px] space-y-2 pointer-events-none">
						<CardHeader>
							<CardTitle>Enter email address</CardTitle>
							<CardDescription>
								We support passwordless authentication. Just
								enter an email, paste the verification code and
								you are logged in!
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Label htmlFor="email">Email</Label>
							<Input placeholder="you@somedomain.com" />
						</CardContent>
						<CardFooter className="float-right space-x-2">
							<Button variant="secondary">Cancel</Button>
							<Button>Submit</Button>
						</CardFooter>
					</Card>
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
						automatically be used in case you miss a few days. The
						longer your streak, the more freezes you get
					</p>
				</div>
				<div className="w-full flex justify-center pointer-events-none">
					<HabitCard
						showMap={false}
						habit={defaultHabits[0]}
						user={user}
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
					<Card className="w-[500px] space-y-2 pointer-events-none">
						<CardHeader>
							<CardTitle>Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center">
								<div>
									<p>Pause app</p>
									<p className="text-xs text-muted-foreground pe-24">
										If you are away or need a break, you can
										pause the app. This will also stop your
										streaks from breaking
									</p>
								</div>
								<Switch />
							</div>
						</CardContent>
					</Card>
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
				<div className="w-full flex justify-center pointer-events-none">
					<HabitCard
						habit={defaultHabits[1]}
						user={user}
						showMap={true}
					/>
				</div>
			</div>
		</animated.div>
	),
];
