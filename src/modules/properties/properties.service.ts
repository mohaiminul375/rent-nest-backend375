import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "./properties.interface";



const getAllPropertyFromDB = async (query: IPostQuery) => {
    const { searchTerm, city, minPrice, maxPrice, category } = query

    const whereConditions: PropertyWhereInput = {};
    if (searchTerm) {
        whereConditions.OR = [
            { title: { contains: searchTerm, mode: 'insensitive' }, },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { address: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }
    if (city) whereConditions.city = {
        equals: city as string,
        mode: "insensitive",
    };
    if (category) whereConditions.category = category;
    // price sorting
    if (minPrice || maxPrice) {
        whereConditions.price = {};
        if (minPrice) whereConditions.price.gte = parseFloat(minPrice);
        if (maxPrice) whereConditions.price.lte = parseFloat(maxPrice);
    }
    const result = await prisma.property.findMany({
        where: whereConditions,
        include: {
            landlord: {
                omit: {
                    password: true,
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