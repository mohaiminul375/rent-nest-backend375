import { Router } from "express";
import { propertiesController } from "./properties.controller";

const router = Router();



router.get('/properties', propertiesController.getAllProperty)
router.get('/properties/:id', propertiesController.getPropertyById)
router.get('/categories', propertiesController.getAllPropertyCategory)

export const propertiesRouter = router;