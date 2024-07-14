import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
	typescript: true,
});

export async function POST(request: NextRequest) {
	let data = await request.json();
	let userId = data.userId;

	// fetch customer, create if one doesn't exist
	let customer;

	const allCustomers = (await stripe.customers.list({ email: userId })).data;

	if (allCustomers.length > 0) customer = allCustomers[0].id;
	else {
		const newCustomer = await stripe.customers.create({ email: userId });
		customer = newCustomer.id;
	}

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: process.env.PRICE_ID,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: process.env.SUCCESS_URL,
		cancel_url: process.env.CANCEL_URL,
		customer,
	});

	return NextResponse.json(session.url);
}
