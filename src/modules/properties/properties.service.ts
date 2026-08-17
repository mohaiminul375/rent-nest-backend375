import { prisma } from "../../lib/prisma";

const getAllPropertyFromDB = async () => {
    const result = await prisma.property.findMany();
    return result
}
const getSinglePropertyFromDB = async (id: string) => {
    const result = await prisma.property.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result
}

const getPropertyCategoryFromDB = async () => {
    const result = await prisma.property.findMany({
        select: {
            category: true
        },
        distinct: ["category"]
    });

    return result;
}


export const propertiesService = {
    getAllPropertyFromDB,
    getSinglePropertyFromDB,
    getPropertyCategoryFromDB
}