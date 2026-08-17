import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../config";

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
    return token;
}

const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        }
    } catch (error: unknown) {
        console.error('Error verification failed');

        return {
            success: false,
            error: error instanceof Error ? error.message:"error during verify token"
        }
    }
}


export const jwtUtils = {
    createToken,
    verifyToken
}