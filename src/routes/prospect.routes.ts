/*
router: /api/prospects
*/
import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import { check, param } from "express-validator";
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
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("documentType", "Document type is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail(),
    check("dateBirth", "Date birth is required").not().isEmpty(),
    check("phone", "Phone is required").not().isEmpty(),
    validateFields,
  ],
  createProspects
);
router.put(
  "/:id",
  validateJWT,
  [
    param("id", "Invalid ID").isMongoId(),
    check("firstName", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail(),
    validateFields,
  ],
  updateProspects
);
router.delete("/:id", validateJWT, deleteProspects);

export default router;
