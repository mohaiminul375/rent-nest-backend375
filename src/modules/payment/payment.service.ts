import { PaymentProvider, PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createPayment = async (
    tenantId: string,
    payload: { rentalRequestId: string }
) => {

    const rental = await prisma.rentalRequest.findFirst({
        where: {
            id: payload.rentalRequestId,
            tenantId,
            status: RentalRequestStatus.APPROVED,
        },
        include: {
            property: true,
            payment: true,
        },
    });

    if (!rental) {
        throw new Error(
            "Approved rental request not found."
        );
    }

    if (rental.payment?.status === PaymentStatus.COMPLETED) {
        throw new Error("Payment already completed.");
    }

    let payment = rental.payment;

    if (!payment) {
        payment = await prisma.payment.create({
            data: {
                rentalRequestId: rental.id,
                userId: rental.tenantId,
                amount: rental.property.price,
                provider: PaymentProvider.STRIPE,
                status: PaymentStatus.PENDING
            },
        });
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(Number(rental.property.price) * 100),
                    product_data: {
                        name: rental.property.title,
                        description: rental.property.address,
                    },
                },
            },
        ],

        metadata: {
            paymentId: payment.id,
            rentalRequestId: rental.id,
            tenantId,
        },

        success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${config.app_url}/payment/cancel`,
    });

    return {
        checkoutUrl: session.url,
        sessionId: session.id,
    };
};

const handleWebhook = async (payload: Buffer, signature: String) => {
    const endpointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature as string,
        endpointSecret
    )


    switch (event.type) {
        case 'checkout.session.async_payment_succeeded':
            // const paymentIntent = event.data.object;
            // console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            // const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    // response.send();

}

export const paymentService = {
    createPayment,
    handleWebhook
}