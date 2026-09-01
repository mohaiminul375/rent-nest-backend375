import { Categories } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface IPostQuery extends PropertyWhereInput {
    searchTerm?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    category?: Categories;
}