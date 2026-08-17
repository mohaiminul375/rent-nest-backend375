import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { landLordRouter } from "./modules/landlord/landlord.route";
import { propertiesRouter } from "./modules/properties/properties.route";
const app: Application = express();

// middleware
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello! form Rent-nest')
})
// routers
// auth router
app.use('/api/auth', authRouter)

// Landlord API's
app.use('/api/landlord', landLordRouter)
// Public api's Properties
app.use('/api', propertiesRouter)

export default app;