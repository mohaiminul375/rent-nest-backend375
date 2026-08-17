import { Categories, PropertyStatus } from "../../../generated/prisma/enums";

export interface ICreateProperty {
    title: string;
    description: string;
    bedrooms: number;
    category:Categories;
    bathrooms: number;
    thumbnail?: string;
    images?: string[];
    address: string;
    city: string;
    price: number;
    status: PropertyStatus;
    landlordId: string;
}