import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.createPayment(req.user?.id as string, req.body)
    console.log(req.user?.id, req.body,'at controller')
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Checkout completed successfully',
        data: result
    })
})


const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers['stripe-signature']!;
    await paymentService.handleWebhook(event, signature as string)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'webhook triggred successfully',
        data: null
    })
})

export const paymentController = {
    createCheckoutSession,
    handleWebhook
}