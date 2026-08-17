import { prisma } from "../../lib/prisma"
import { ICreateProperty } from "./landlord.interface";

const createPropertyIntoDB = async (payload: ICreateProperty, id: string) => {
    const result = await prisma.property.create({
        data: { ...payload, landlordId: id }
    });
    return result;
}



export const landlordService = {
    createPropertyIntoDB,
}