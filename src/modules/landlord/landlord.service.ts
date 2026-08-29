import { prisma } from "../../lib/prisma"
import { ICreateProperty } from "./landlord.interface";

const createPropertyIntoDB = async (payload: ICreateProperty, id: string) => {
    const result = await prisma.property.create({
        data: { ...payload, landlordId: id }
    });
    return result;
}

const updatePropertyIntoDB = async (propertyId: string, payload: any, landlordId: string, isLandlord: boolean) => {
    const property = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } })
    if (!isLandlord && property.landlordId !== landlordId) {
        throw new Error("You are not the owner of this post");
    }
    // Todo: may use include
    const result = await prisma.property.update({
        where: { id: propertyId }, data: payload
    })
    return result

}
const deletePropertyIntoDB = async (propertyId: string, landlordId: string, isLandlord: boolean) => {

    const property = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } })
    // console.log(landlordId, 'landlord-id')
    // console.log('role', isLandlord)
    // console.log(property)


    if (!isLandlord && property.landlordId !== landlordId) {
        console.log('error hitted',isLandlord)
        throw new Error("You are not the owner of this post");
    }

    const result = await prisma.property.delete({ where: { id: propertyId } })

    return result;
}

const getLandLordRentalReqFromDB = async (landlordId: string) => {
    const properties = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId
            },
        },
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true
                }
            }
        }
    })
    return properties
}
const updateRentalReqIntoDB = async (id: string, landlordId: string, payload: { status: "APPROVED" | "REJECTED" }) => {
    const request = await prisma.rentalRequest.findUnique({
        where: {
            id
        },
        include: {
            property: true
        },
    })


    if (!request || request.property.landlordId !== landlordId) {
        throw new Error("Rental request not found or unauthorized");
    }

    if (request.status !== "PENDING") {
        throw new Error(`Cannot update request because it is already ${request.status}`);
    }

    const updatedRequest = await prisma.rentalRequest.update({
        where: { id },
        data: { status: payload.status }
    });

    return updatedRequest;
}

export const landlordService = {
    createPropertyIntoDB,
    updatePropertyIntoDB,
    deletePropertyIntoDB,
    getLandLordRentalReqFromDB,
    updateRentalReqIntoDB
}