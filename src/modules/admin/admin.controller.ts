import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsersFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'users data retrieved',
        data: result
    })
})
const getAllProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllPropertiesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Properties data retrieved',
        data: result
    })
})
const getAllRentalReq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalReqFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Rental data retrieved',
        data: result
    })
})

export const adminController = {
    getAllUsers,
    getAllProperty,
    getAllRentalReq
}