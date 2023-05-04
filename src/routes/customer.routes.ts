/*
router: /api/customers
*/
import { Router } from "express";
import {
  createCustomers,
  deleteCustomers,
  getCustomers,
  updateCustomers,
} from "../controllers/customers.controller";
import validateJWT from "../middlewares/validate-jwt";
import { body } from "express-validator";
import validateFields from "../middlewares/validate-fields";

const router = Router();

router.get("/", getCustomers);
router.post(
  "/",
  validateJWT,
  [
    body("email", "Email is required").not().isEmpty().isEmail(),
    validateFields,
  ],
  createCustomers
);
router.put(
  "/:id",
  validateJWT,
  [
    body("email", "Email is required").not().isEmpty().isEmail(),
    validateFields,
  ],
  updateCustomers
);
router.delete("/:id", deleteCustomers);

export default router;
