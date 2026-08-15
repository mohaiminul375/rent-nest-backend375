import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";

const registerUserToDB = async (payload: any) => {
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


export const userService = {
    registerUserToDB
}