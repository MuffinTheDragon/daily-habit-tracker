import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET!;

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
	typescript: true,
});

async function getDexieToken() {
	const scopes = ["GLOBAL_READ", "GLOBAL_WRITE", "ACCESS_DB"];

	const tokenResponse = await axios.post(
		`${process.env.NEXT_PUBLIC_DBURL}/token`,
		{
			scopes,
			grant_type: "client_credentials",
			client_id: process.env.DEXIE_CLIENT_ID,
			client_secret: process.env.DEXIE_CLIENT_SECRET,
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const token = tokenResponse.data.accessToken;

	return token;
}

type DexieUserType = "eval" | "prod";

async function changeUserType(
	type: DexieUserType,
	token: string,
	userId: string
) {
	const users = [
		{
			userId,
			type,
		},
	];

	await axios.post(`${process.env.NEXT_PUBLIC_DBURL}/users`, users, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
}

export async function POST(request: NextRequest) {
	let event;

	const payload = await (await request.blob()).text();
	const signature = request.headers.get("stripe-signature") as string;

	try {
		event = stripe.webhooks.constructEvent(payload, signature, secret);
	} catch (err) {
		console.log(err);
		return NextResponse.json("Webhook signature verification failed", {
			status: 400,
		});
	}

	switch (event.type) {
		case "checkout.session.completed":
			const paymentIntent = event.data.object;

			try {
				const token = await getDexieToken();

				await changeUserType(
					"prod",
					token,
					paymentIntent.customer_details?.email as string
				);
			} catch (error) {
				console.log(error);
				await stripe.subscriptions.cancel(
					paymentIntent.subscription as string
				);

				return NextResponse.json(
					"Could not upgrade user status. A refund has been issued to the payment method used.",
					{ status: 500 }
				);
			}

			break;

		case "customer.subscription.deleted":
			const customer = await stripe.customers.retrieve(
				event.data.object.customer as string
			);

			if (customer.deleted) {
				console.log("Customer deleted");
				break;
			}

			try {
				const token = await getDexieToken();

				await changeUserType("eval", token, customer.email!);
			} catch (error) {
				console.log(error);

				return NextResponse.json(
					"Could not upgrade user status. A refund has been issued to the payment method used.",
					{ status: 500 }
				);
			}

			break;
	}

	return NextResponse.json({ message: "Success" }, { status: 200 });
}
