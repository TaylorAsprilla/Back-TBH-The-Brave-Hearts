/*
router: /api/users
*/

import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/users.controller";
import { body } from "express-validator";
import validateFields from "../middlewares/validate-fields";
import validateJWT from "../middlewares/validate-jwt";

const router = Router();

router.get("/", validateJWT, getUsers);
router.post(
  "/",
  validateJWT,
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty().isEmail(),
    body("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  createUser
);
router.put(
  "/:id",
  validateJWT,
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty().isEmail(),
    body("role", "Role is required").not().isEmpty(),
    validateFields,
  ],
  updateUser
);

export default router;
