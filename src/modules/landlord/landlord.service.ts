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
        where: { id: propertyId }, data: { payload }
    })
    return result


}
const deletePropertyIntoDB = async (propertyId: string, landlordId: string, isLandlord: boolean) => {
    const property = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } })

    if (!isLandlord && property.landlordId !== landlordId) {
        throw new Error("You are not the owner of this post");
    }

    const result = await prisma.property.delete({ where: { id: propertyId } })
    
    return result;
}
const getAllRentalReqFromDB = async () => {

}
const updateRentalReqIntoDB = async () => {

}

export const landlordService = {
    createPropertyIntoDB,
    updatePropertyIntoDB,
    deletePropertyIntoDB
}