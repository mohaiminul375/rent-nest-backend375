import { Router } from "express";
import { rentalRequestController } from "./rentalReq.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();

router.post('/', auth(UserRole.TENANT), rentalRequestController.createRentalReq)
router.get('/', rentalRequestController.getAllRentalReq)
router.get('/:id', rentalRequestController.getRentalReqDetails)

export const rentalRequest = router