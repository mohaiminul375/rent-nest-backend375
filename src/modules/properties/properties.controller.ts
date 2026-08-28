import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { propertiesService } from "./properties.service";

const getAllProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const property = await propertiesService.getAllPropertyFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'data retrieved successfully',
        data: property
    })
})

const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const property = await propertiesService.getSinglePropertyFromDB(req.params.id as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'single data retrieved successfully',
        data: property
    })
})

const getAllPropertyCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryList = await propertiesService.getPropertyCategoryFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'category list retrieved successfully',
        data: categoryList
    })
})

export const propertiesController = {
getAllProperty,
getPropertyById,
getAllPropertyCategory
}