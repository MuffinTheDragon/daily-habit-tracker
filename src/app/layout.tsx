import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Daily habit tracker - Simple & Minimalist tracker",
	description:
		"Try this habit tracker app with streaks, freezes to protect streaks, and a visual map to see consistency. Track your habits effortlessly!",
	manifest: "/manifest.json",
	openGraph: {
		type: "website",
		url: "https://www.dailyhabits.dev",
		images: [
			"https://www.dailyhabits.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhabits-light.ee373f59.png&w=1080&q=75",
		],
		title: "Daily habit tracker - Simple & Minimalist tracker",
		description:
			"Try this habit tracker app with streaks, freezes to protect streaks, and a visual map to see consistency. Track your habits effortlessly!",
	},
	alternates: {
		canonical: "https://www.dailyhabits.dev",
	},
	other: {
		"google-site-verification":
			"iLTcI7uI0LeziF2sMHXi2Md64ULLsFf5oPld-5rBWxA",
	},
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Suspense>{children}</Suspense>
					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
