import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id
    const property = await landlordService.createPropertyIntoDB(req.body, id as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'property created successfully',
        data: property
    })
})

export const landlordController = {
    createProperty
}