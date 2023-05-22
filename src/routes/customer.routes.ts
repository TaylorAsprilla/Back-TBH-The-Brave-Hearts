/*
router: /api/customers
*/
import { Router } from "express";
import {
  createCustomers,
  deleteCustomers,
  getAllCustomers,
  getCustomers,
  updateCustomers,
} from "../controllers/customers.controller";
import validateJWT from "../middlewares/validate-jwt";
import { body, check } from "express-validator";
import validateFields from "../middlewares/validate-fields";

const router = Router();

router.get("/", validateJWT, getCustomers);
router.get("/all", validateJWT, getAllCustomers);
router.post(
  "/",
  validateJWT,
  [
    check("customer.email", "Email is required Customer")
      .not()
      .isEmpty()
      .isEmail(),
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
