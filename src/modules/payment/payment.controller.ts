import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";
import config from "../../config";


export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    console.log('hit the webhook')
    const signature = req.headers["stripe-signature"]!;
    console.log(signature, 'singn')

    if (!signature) {
        return res.status(400).send("Missing stripe signature");
    }

    let event: Stripe.Event = req.body;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.stripe_webhook_secret
        );
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            const paymentId = session.metadata?.paymentId;

            if (!paymentId) break;

            const payment = await prisma.payment.findUnique({
                where: {
                    id: paymentId,
                },
            });

            if (!payment) break;

            if (payment.status === PaymentStatus.COMPLETED) break;

            await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: PaymentStatus.COMPLETED,
                    transactionId: session.payment_intent as string,
                    paidAt: new Date(),
                },
            });

            await prisma.rentalRequest.update({
                where: {
                    id: payment.rentalRequestId,
                },
                data: {
                    status: RentalRequestStatus.COMPLETED,
                },
            });

            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            await prisma.payment.updateMany({
                where: {
                    transactionId: paymentIntent.id,
                },
                data: {
                    status: PaymentStatus.FAILED,
                },
            });

            break;
        }
    }

    res.status(200).json({
        received: true,
    });
});



const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.createPayment(req.user?.id as string, req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Checkout completed successfully',
        data: result
    })
})



// --
// export const handleWebhook = catchAsync(async (req: Request, res: Response) => {

//     console.log("🔥 WEBHOOK HIT");

//     const signature = req.headers["stripe-signature"] as string;

//     console.log("Signature:", signature);

//     if (!signature) {
//         console.log("❌ Missing stripe signature");
//         return res.status(400).send("Missing stripe signature");
//     }

//     let event: Stripe.Event;

//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             signature,
//             config.stripe_webhook_secret
//         );

//         console.log("✅ Event received:", event.type);

//     } catch (err: any) {

//         console.log("❌ Webhook Error:", err.message);

//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     switch (event.type) {

//         case "checkout.session.completed": {

//             console.log("🔥 checkout.session.completed");

//             const session = event.data.object as Stripe.Checkout.Session;

//             console.log("Session ID:", session.id);
//             console.log("Metadata:", session.metadata);

//             const paymentId = session.metadata?.paymentId;

//             if (!paymentId) {
//                 console.log("❌ paymentId missing from metadata");
//                 break;
//             }

//             console.log("Payment ID:", paymentId);

//             const payment = await prisma.payment.findUnique({
//                 where: {
//                     id: paymentId,
//                 },
//             });

//             console.log("Payment from DB:", payment);

//             if (!payment) {
//                 console.log("❌ Payment not found");
//                 break;
//             }

//             if (payment.status === PaymentStatus.COMPLETED) {
//                 console.log("⚠️ Payment already completed");
//                 break;
//             }

//             await prisma.payment.update({
//                 where: {
//                     id: payment.id,
//                 },
//                 data: {
//                     status: PaymentStatus.COMPLETED,
//                     transactionId: session.payment_intent as string,
//                     paidAt: new Date(),
//                 },
//             });

//             console.log("✅ Payment updated");

//             await prisma.rentalRequest.update({
//                 where: {
//                     id: payment.rentalRequestId,
//                 },
//                 data: {
//                     status: RentalRequestStatus.COMPLETED,
//                 },
//             });

//             console.log("✅ Rental request updated");

//             break;
//         }

//         case "payment_intent.payment_failed": {

//             console.log("❌ payment_intent.payment_failed");

//             const paymentIntent =
//                 event.data.object as Stripe.PaymentIntent;

//             console.log("Payment Intent:", paymentIntent.id);

//             const result = await prisma.payment.updateMany({
//                 where: {
//                     transactionId: paymentIntent.id,
//                 },
//                 data: {
//                     status: PaymentStatus.FAILED,
//                 },
//             });

//             console.log("Failed payment update:", result);

//             break;
//         }

//         default:
//             console.log("ℹ️ Unhandled event:", event.type);
//     }

//     return res.status(200).json({
//         received: true,
//     });
// });

const getUserPaymentHistory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await paymentService.getUserPaymentHistory(req.user?.id as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment history retrieved successfully.",
            data: result,
        });
    }
);
const getPaymentDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await paymentService.getPaymentDetails(
            req.params.id as string,
            req.user?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment details retrieved successfully.",
            data: result,
        });
    }
);
export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getUserPaymentHistory,
    getPaymentDetails
}