import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.createReview(req.user?.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: result,
    });
});


export const reviewController = {
    createReview
}