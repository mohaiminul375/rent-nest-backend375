import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"

const getAllUsersFromDB = async () => {
    const result = await prisma.user.findMany({
        omit: {
            password: true
        }
    })
    return result
}

const updateUserStatus = async (id: string, payload: { status: "UNBANNED" | "BANNED" }) => {
    const user = await prisma.user.update({
        where: { id },
        data: { status: payload.status },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        }
    });
    return user;
};


const getAllPropertiesFromDB = async () => {
    const result = await prisma.property.findMany({
        include: {
            landlord: {
                omit: {
                    password: true
                }
            },
            RentalRequest: true
            // Todo: may review added
        }
    })
    return result
}
const getAllRentalReqFromDB = async () => {
    const result = await prisma.rentalRequest.findMany({
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true
                }
            }

        }
    })
    return result
}

export const adminService = {
    getAllUsersFromDB,
    updateUserStatus,
    getAllPropertiesFromDB,
    getAllRentalReqFromDB
}