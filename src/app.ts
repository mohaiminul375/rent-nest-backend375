import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { landLordRouter } from "./modules/landlord/landlord.route";
import { propertiesRouter } from "./modules/properties/properties.route";
import { rentalRequest } from "./modules/RentalRequest/rentalReq.route";
import { paymentRoute } from "./modules/payment/payment.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { stripe } from "./lib/stripe";
import Stripe from "stripe";
const app: Application = express();

// middleware
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

const endpointSecret = config.stripe_webhook_secret;
// webhook stripe
// app.post('/api/payments/webhook', express.raw({ type: "application/json" }), (request, response) => {
//     let event: Stripe.Event;

//     event = request.body;

//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//         // Get the signature sent by Stripe
//         const signature = request.headers['stripe-signature'];
//         try {
//             event = stripe.webhooks.constructEvent(
//                 request.body,
//                 signature as string,
//                 endpointSecret
//             );
//         } catch (err: any) {
//             console.log(`⚠️  Webhook signature verification failed.`, err.message);
//             return response.status(400).json({
//                 message: err.message
//             });
//         }
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'payment_intent.succeeded':
//             const paymentIntent = event.data.object;
//             console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//             // Then define and call a method to handle the successful payment intent.
//             // handlePaymentIntentSucceeded(paymentIntent);
//             break;
//         case 'payment_method.attached':
//             const paymentMethod = event.data.object;
//             // Then define and call a method to handle the successful attachment of a PaymentMethod.
//             // handlePaymentMethodAttached(paymentMethod);
//             break;
//         default:
//             // Unexpected event type
//             console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
// })
app.use('/api/payments/confirm', express.raw({ type: "application/json" }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello! form Rent-nest')
})
// routers
// auth router
app.use('/api/auth', authRouter)

// Landlord Management API's
app.use('/api/landlord', landLordRouter)
// Public api's Properties
app.use('/api', propertiesRouter)
// Rental Requests
app.use('/api/rentals', rentalRequest)
// todo: ADmin 
// app.use('/api/admin')

// Payment Stripe
app.use('/api/payments', paymentRoute)


// global error handle
app.use(globalErrorHandler)
export default app;