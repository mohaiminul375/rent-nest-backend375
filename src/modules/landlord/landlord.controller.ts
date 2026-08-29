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

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params?.id
    const landlordId = req.user?.id;
    const isLandlord = req.user?.role === "LANDLORD";
    const payload = req.body;

    const updatedProperty = await landlordService.updatePropertyIntoDB(propertyId as string, payload, landlordId as string, isLandlord)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'property updated successfully',
        data: updatedProperty
    })
})

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params?.id
    const landlordId = req.user?.id;
    const isLandlord = req.user?.role === "LANDLORD";

    await landlordService.deletePropertyIntoDB(propertyId as string, landlordId as string, isLandlord)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'property delete successfully',
        data: null
    })



})

const getLandlordRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await landlordService.getLandLordRentalReqFromDB(req.user?.id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'property get for landlord successfully',
        data: result
    })
})

const updateRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // do letter
    const id = req.params.id;
    const result = await landlordService.updateRentalReqIntoDB(id as string, req.user?.id as string, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request status updated successfully",
        data: result,
    });

})

export const landlordController = {
    createProperty,
    updateProperty,
    deleteProperty,
    getLandlordRentalRequest,
    updateRentalRequest
}