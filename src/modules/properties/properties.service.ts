import { prisma } from "../../lib/prisma";
// Todo: filter search
const getAllPropertyFromDB = async () => {
    const result = await prisma.property.findMany({
        include: {
            landlord: {
                omit: {
                    id: true,
                    password: true,
                    role: true,
                    status: true
                },
            },
        },
    });;
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