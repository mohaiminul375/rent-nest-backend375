import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/cathAsync"
import { rentalRequestService } from "./rentalReq.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status";

const createRentalReq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalRequestService.createRentalReqIntoDB(req.user?.id as string, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request submitted successfully",
        data: result,
    });

})
const getAllRentalReq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalRequestService.getAllRentalReqFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "get all rental request successfully",
        data: result,
    });
})
const getRentalReqDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalRequestService.getRentalReqDetailsFromDB(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "get rental request successfully",
        data: result,
    });
})

export const rentalRequestController = {
    createRentalReq,
    getAllRentalReq,
    getRentalReqDetails
}