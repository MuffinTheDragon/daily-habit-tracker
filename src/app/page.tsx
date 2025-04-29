/* eslint-disable react/no-unescaped-entities */
"use client";

import habitsDark from "@/app/assets/habits-dark.png";
import habitsLight from "@/app/assets/habits-light.png";
import logo from "@/app/favicon.ico";
import { HabitCard } from "@/components/habit-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import {
	ArrowLeftIcon,
	ArrowUpIcon,
	CheckIcon,
	FireIcon,
	MapIcon,
	PauseCircleIcon,
	WifiIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { SetStateAction, useState } from "react";

export default function Home() {
	const [activeCard, setActiveCard] = useState(0);

	const onCardClick = (index: SetStateAction<number>) => {
		setActiveCard(index);
	};

	// Mock user data for demo
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

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/95">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/40">
				<div className="container mx-auto flex justify-between items-center py-4">
					<Link className="flex items-center" href="/">
						<Image src={logo} alt="logo" width={28} height={28} />
					</Link>
					<div className="flex items-center space-x-4">
						<a
							href="https://github.com/MuffinTheDragon/daily-habit-tracker"
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground/70 hover:text-foreground transition-colors"
						>
							<svg
								className="w-6 h-6"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="currentColor"
									d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
								/>
							</svg>
						</a>
						<Link href="/habits">
							<Button variant="secondary" size="sm">
								Track your habits
							</Button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="container mx-auto pt-16 pb-24 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<div className="mb-6 inline-block">
						<span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
							Simple • Effective • Free
						</span>
					</div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent overflow-visible pb-3">
						Daily Habit Tracker
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
						Focus on building good habits while eliminating all the
						stress. A minimalist approach to tracking your daily
						routines.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
						<Button size="lg" className="rounded-full" asChild>
							<a href="#app">Track your habits</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="rounded-full"
							asChild
						>
							<a href="#features">Learn more</a>
						</Button>
					</div>
					<p className="text-sm text-muted-foreground">
						No account required to get started
					</p>

					<div className="mt-16">
						<div className="bg-card border shadow-lg rounded-xl overflow-hidden mx-auto">
							<div className="p-2 bg-muted border-b flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div className="w-3 h-3 rounded-full bg-green-500"></div>
								<div className="text-xs text-center w-full text-muted-foreground">
									daily-habits.dev
								</div>
							</div>
							<div className="mb-2 justify-center flex">
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
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl font-bold mb-4">
							Everything you need
						</h2>
						<p className="text-muted-foreground">
							The perfect habit tracker to motivate and help you
							build good habits, while being flexible enough to
							suit your daily life.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
						<div
							onClick={() => onCardClick(0)}
							className={cn(
								"border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md",
								activeCard === 0
									? "bg-card shadow-md"
									: "bg-background/50"
							)}
						>
							<WifiIcon className="w-6 h-6 mb-4 text-primary" />
							<h3 className="font-semibold mb-2">Offline Use</h3>
							<p className="text-muted-foreground text-sm">
								Use this app fully offline for as long as you
								want, with all your data securely stored.
							</p>
						</div>

						<div
							onClick={() => onCardClick(1)}
							className={cn(
								"border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md",
								activeCard === 1
									? "bg-card shadow-md"
									: "bg-background/50"
							)}
						>
							<FireIcon className="w-6 h-6 mb-4 text-primary" />
							<h3 className="font-semibold mb-2">Streaks</h3>
							<p className="text-muted-foreground text-sm">
								Track your streaks for each habit along with
								completions and longest streaks.
							</p>
						</div>

						<div
							onClick={() => onCardClick(2)}
							className={cn(
								"border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md",
								activeCard === 2
									? "bg-card shadow-md"
									: "bg-background/50"
							)}
						>
							<PauseCircleIcon className="w-6 h-6 mb-4 text-primary" />
							<h3 className="font-semibold mb-2">Pausing</h3>
							<p className="text-muted-foreground text-sm">
								Need a break? Pause the app and come back to
								pick up right where you left off.
							</p>
						</div>

						<div
							onClick={() => onCardClick(3)}
							className={cn(
								"border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md",
								activeCard === 3
									? "bg-card shadow-md"
									: "bg-background/50"
							)}
						>
							<MapIcon className="w-6 h-6 mb-4 text-primary" />
							<h3 className="font-semibold mb-2">
								Visualize Progress
							</h3>
							<p className="text-muted-foreground text-sm">
								View your daily completions on a simple to use
								visual map and track your journey.
							</p>
						</div>
					</div>

					<div className="mt-12 border rounded-xl bg-card p-6 shadow-md">
						{activeCard === 0 && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<div>
									<h3 className="text-2xl font-semibold mb-4">
										Offline Use
									</h3>
									<p className="text-muted-foreground mb-4">
										The data is stored in your browser's
										cache, meaning this app can be fully
										used offline for however long you want!
										You can sign in with your email if you
										want to sync your data between devices.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												No internet connection required
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Data stored locally and securely
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Optional cloud syncing between
												devices
											</span>
										</li>
									</ul>
								</div>
								<div className="flex justify-center">
									<Card className="w-full max-w-md">
										<CardHeader>
											<CardTitle>
												Enter email address
											</CardTitle>
											<CardDescription>
												We support passwordless
												authentication. Just enter an
												email, paste the verification
												code and you are logged in!
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Label htmlFor="email">Email</Label>
											<Input placeholder="you@example.com" />
										</CardContent>
										<CardFooter className="flex justify-end gap-2">
											<Button variant="secondary">
												Cancel
											</Button>
											<Button>Submit</Button>
										</CardFooter>
									</Card>
								</div>
							</div>
						)}

						{activeCard === 1 && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<div>
									<h3 className="text-2xl font-semibold mb-4">
										Track Your Streaks
									</h3>
									<p className="text-muted-foreground mb-4">
										Each time you complete a task, watch
										your streak counter go up. You also get
										<strong> streak freezes</strong> that
										will automatically be used in case you
										miss a few days. The longer your streak,
										the more freezes you get.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Automatic streak counting
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Streak freezes for missed days
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Track longest streaks and total
												completions
											</span>
										</li>
									</ul>
								</div>
								<div className="w-full flex justify-center pointer-events-none">
									<HabitCard
										showMap={false}
										habit={defaultHabits[0]}
										user={user}
									/>
								</div>
							</div>
						)}

						{activeCard === 2 && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<div>
									<h3 className="text-2xl font-semibold mb-4">
										Pause Your Activity
									</h3>
									<p className="text-muted-foreground mb-4">
										Need a break? Pause your activity right
										from the app. When you get back, pick up
										right where you left off without losing
										your streaks.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Pause all habits with one click
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Take breaks without losing
												progress
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Resume exactly where you left
												off
											</span>
										</li>
									</ul>
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
														Your streaks are paused
														and will not break until
														you unpause the app
													</p>
												</div>
												<Switch />
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						)}

						{activeCard === 3 && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<div>
									<h3 className="text-2xl font-semibold mb-4">
										Visualize Your Progress
									</h3>
									<p className="text-muted-foreground mb-4">
										View your completion history for each
										habit with a simple visual map. Easily
										identify patterns and track consistency
										over time.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Calendar view of all completions
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Identify patterns in your habits
											</span>
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5" />
											<span>
												Track consistency over time
											</span>
										</li>
									</ul>
								</div>
								<div className="w-full flex justify-center pointer-events-none">
									<HabitCard
										habit={defaultHabits[1]}
										user={user}
										showMap={true}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Cross-platform section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">
							Available on all your devices
						</h2>
						<p className="text-muted-foreground mb-8">
							This app is a fully functional progressive web app,
							which means it works seamlessly on both your laptop
							and mobile device, just like any native app.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
							<div className="text-center">
								<div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
									<svg
										className="w-8 h-8 text-primary"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="font-medium mb-1">Desktop</h3>
								<p className="text-sm text-muted-foreground">
									Works in any browser
								</p>
							</div>
							<div className="text-center">
								<div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
									<svg
										className="w-8 h-8 text-primary"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="font-medium mb-1">Mobile</h3>
								<p className="text-sm text-muted-foreground">
									iOS and Android
								</p>
							</div>
							<div className="text-center">
								<div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
									<svg
										className="w-8 h-8 text-primary"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="font-medium mb-1">Tablet</h3>
								<p className="text-sm text-muted-foreground">
									Full responsive design
								</p>
							</div>
						</div>
						<div className="mt-10 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
							<p>
								To install on your mobile device, simply add
								this website to your home screen.
								<a
									href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
									className="ml-1 text-primary hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									Learn how
								</a>
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing section */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold mb-12 text-center">
						Simple, transparent pricing
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<div className="border rounded-xl p-8 bg-card">
							<div className="mb-4">
								<span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
									FREE
								</span>
							</div>
							<h3 className="text-2xl font-bold mb-2">
								Free Plan
							</h3>
							<p className="text-muted-foreground mb-6">
								All the core features included
							</p>
							<div className="border-t pt-6 mb-8">
								<ul className="space-y-4">
									<li className="flex items-start gap-3">
										<CheckIcon className="w-5 h-5 mt-0.5" />
										<span>Track unlimited habits</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckIcon className="w-5 h-5 mt-0.5" />
										<span>Offline use</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckIcon className="w-5 h-5 mt-0.5" />
										<span>Track streaks</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckIcon className="w-5 h-5 mt-0.5" />
										<span>Pause the app</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckIcon className="w-5 h-5 mt-0.5" />
										<span>Sync data for 30 days</span>
									</li>
								</ul>
							</div>
						</div>

						<div className="border rounded-xl p-8 bg-card relative shadow-md">
							<div className="mb-4">
								<span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
									PREMIUM
								</span>
							</div>
							<h3 className="text-2xl font-bold mb-2">
								Premium Plan
							</h3>
							<p className="text-muted-foreground mb-6">
								<span className="text-lg font-bold">$0.99</span>{" "}
								USD per month
							</p>
							<div className="border-t pt-6 mb-8">
								<ul className="space-y-4">
									<li className="flex items-start gap-3">
										<div className="mt-0.5">
											<ArrowLeftIcon className="w-5 h-5 hidden md:block" />
											<ArrowUpIcon className="w-5 h-5 md:hidden" />
										</div>
										<span>Everything in free plan</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckIcon className="w-5 h-5 mt-0.5" />
										<span>Sync data forever</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA section */}
			<section id="app" className="py-16">
				<div className="container mx-auto px-4">
					<div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto">
						<h2 className="text-3xl font-bold mb-4">
							Get started now!
						</h2>
						<p className="text-muted-foreground mb-8 max-w-lg mx-auto">
							Start tracking your habits for free, no account
							required. Build better habits today and unlock your
							full potential.
						</p>
						<Button size="lg" className="rounded-full px-8" asChild>
							<a href="/habits">Start now</a>
						</Button>
					</div>
				</div>
			</section>

			{/* FAQ section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold mb-4">
							Frequently asked questions
						</h2>
						<p className="text-muted-foreground mb-8">
							For other questions or concerns, send us an email at
							rdht.contact@gmail.com
						</p>

						<Accordion
							type="single"
							collapsible
							className="space-y-4"
						>
							<AccordionItem
								value="item-1"
								className="border rounded-lg px-6"
							>
								<AccordionTrigger className="text-left">
									How does offline mode work?
								</AccordionTrigger>
								<AccordionContent>
									The data is stored in your browser's cache,
									meaning this app can be fully used offline
									for however long you want! You can sign in
									with your email if you want to sync your
									data between devices.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem
								value="item-2"
								className="border rounded-lg px-6"
							>
								<AccordionTrigger className="text-left">
									What happens if I miss a day?
								</AccordionTrigger>
								<AccordionContent>
									If you miss a day, your streak will be
									frozen using one of your streak freezes.
									Each habit comes with 3 streak freezes that
									automatically get used when you miss a day.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem
								value="item-3"
								className="border rounded-lg px-6"
							>
								<AccordionTrigger className="text-left">
									Can I use this app without an internet
									connection?
								</AccordionTrigger>
								<AccordionContent>
									Yes! This app is designed to work fully
									offline. Your data is stored in your
									browser's local storage, and the app is
									cached for offline use.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem
								value="item-4"
								className="border rounded-lg px-6"
							>
								<AccordionTrigger className="text-left">
									Is there a mobile app?
								</AccordionTrigger>
								<AccordionContent>
									This is a progressive web app (PWA) that can
									be installed on your mobile device's home
									screen and used just like a native app. See
									the "Available on all your devices" section
									for instructions.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem
								value="item-5"
								className="border rounded-lg px-6"
							>
								<AccordionTrigger className="text-left">
									How do I track multiple habits?
								</AccordionTrigger>
								<AccordionContent>
									You can track as many habits as you want!
									Simply create a new habit for each activity
									you want to track, and they'll all be
									displayed on your dashboard.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 bg-muted/30">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="flex flex-col md:flex-row justify-between gap-8">
						<div>
							<div className="flex items-center space-x-2">
								<span className="font-medium">
									Daily habit tracker
								</span>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								A simple and minimalist daily habit tracker
							</p>
						</div>
					</div>

					<div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
						<p className="text-sm text-muted-foreground">
							© dailyhabits.dev
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
