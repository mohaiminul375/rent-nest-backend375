import { RentalRequestStatus } from "../../../generated/prisma/client";

export interface ICreateRentalReq {
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate?: string;
    message?: string;
    status: RentalRequestStatus,
    
}