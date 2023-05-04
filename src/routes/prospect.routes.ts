/*
router: /api/customers
*/
import { Router } from "express";

import validateJWT from "../middlewares/validate-jwt";
import { body } from "express-validator";
import validateFields from "../middlewares/validate-fields";
import {
  createProspects,
  deleteProspects,
  getProspects,
  updateProspects,
} from "../controllers/prospects.controllers";

const router = Router();

router.get("/", getProspects);
router.post(
  "/",
  validateJWT,
  [
    body("email", "Email is required").not().isEmpty().isEmail(),
    validateFields,
  ],
  createProspects
);
router.put(
  "/:id",
  validateJWT,
  [
    body("firstName", "Name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty().isEmail(),
    validateFields,
  ],
  updateProspects
);
router.delete("/:id", validateJWT, deleteProspects);

export default router;
