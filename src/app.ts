import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { userRouter } from "./modules/users/user.route";
import config from "./config";
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
app.use('/api/auth', userRouter)

export default app;