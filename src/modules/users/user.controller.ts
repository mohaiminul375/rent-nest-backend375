import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/cathAsync"
import { userService } from "./user.service"
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.registerUserToDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message:"User created successfully",
        data:result
    })
})

export const userController = {
    registerUser
}