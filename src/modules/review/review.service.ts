import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

const createReview = async (tenantId: string, payload: IReview) => {
  // rental status must completed
  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: "COMPLETED"
    }
  });

  if (!completedRental) {
    throw new Error("You can only review properties you have completely rented");
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
      tenantId
    }
  });

  return review;
};

export const reviewService = {
  createReview
};