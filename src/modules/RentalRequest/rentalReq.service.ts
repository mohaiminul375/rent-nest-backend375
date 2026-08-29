import { prisma } from "../../lib/prisma";

const createRentalReqIntoDB = async (tenantId: string, payload: any) => {
    const property = await prisma.property.findUnique({ where: { id: payload.propertyId } });
    if (!property || property.status !== "AVAILABLE") {
        throw new Error("Property is not available for rent");
    }
    const rentalReq = prisma.rentalRequest.create({
        data: {
            ...payload,
            tenantId
        }
    })
    return rentalReq

}

const getAllRentalReqFromDB = async () => {
    const property = await prisma.rentalRequest.findMany({
        include: {
            tenant: {
                omit: {
                    password: true,
                    role: true,
                    status: true
                },
            }
        }
    })

    return property
}

const getRentalReqDetailsFromDB = async (id: string) => {
    const property = await prisma.rentalRequest.findUniqueOrThrow({
        where: { id },
        include: {
            tenant: {
                omit: {
                    id: true,
                    password: true,
                    role: true,
                    status: true
                },
            },
            property: {
                omit: {
                    id: true,
                    landlordId: true
                },
            }
        }
    })
    return property;
}


export const rentalRequestService = {
    createRentalReqIntoDB,
    getAllRentalReqFromDB,
    getRentalReqDetailsFromDB
} 