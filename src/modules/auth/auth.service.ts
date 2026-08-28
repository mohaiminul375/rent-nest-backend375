import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUser, IUserLogin } from "./auth.interface"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserToDB = async (payload: ICreateUser) => {
    const { name, email, password, phone, role, status, address } = payload;
    const isExistedUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isExistedUser) {
        throw new Error("User email already existed");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            status,
            address
        },
        omit: {
            password: true
        }
    })
    return createUser
}


const loginUserToDB = async (payload: IUserLogin) => {
    const { email, password } = payload;
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
        throw new Error('Password not matched')
    }
    if (user.status === "BANNED") {
        throw new Error('Your account has been banned contact support')
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role

    }
    // create token
    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions);

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions)
    return { accessToken, refreshToken };
}

const loginUserProfileFromDB = async (id: string) => {
    const profile = await prisma.user.findUniqueOrThrow({
        where: { id },
        omit: {
            password: true
        }
    })
    return profile;
}

export const authService = {
    registerUserToDB,
    loginUserToDB,
    loginUserProfileFromDB
}