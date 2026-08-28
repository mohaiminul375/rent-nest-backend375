import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cathAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUserToDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: result
    })
})
// login
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken, accessToken } = await authService.loginUserToDB(req.body);

    // set tokens to cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 //1day or 24 hours
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 //7day
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: { refreshToken, accessToken }
    })
})
// me route (user details)
const loginUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUserProfileFromDB(req.user?.id as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User data retrieved successfully",
        data: result
    })
})

export const authController = {
    registerUser,
    loginUser,
    loginUserProfile
}