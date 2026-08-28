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
import { paymentController } from "./modules/payment/payment.controller";
const app: Application = express();

// middleware
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))


app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

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