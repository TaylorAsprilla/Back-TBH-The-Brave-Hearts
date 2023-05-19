/*
router: /api/login
*/

import { Router } from "express";
import { body } from "express-validator";
import {
  changePassword,
  createNewPassword,
  forgotPassword,
  login,
  renewToken,
} from "../controllers/auth.controllers";
import validateJWT from "../middlewares/validate-jwt";
import validateFields from "../middlewares/validate-fields";

const router = Router();

router.post(
  "/",
  [
    body("agentCode", "Agent Code is required").not().isEmpty(),
    body("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

router.get("/renew", validateJWT, renewToken);

// Forgot password
router.put(
  "/forgotpassword",
  [body("agentCode", "Agent Code is required").not().isEmpty(), validateFields],
  forgotPassword
);

// Create a new password
router.put(
  "/createPassword",
  [
    body("newPassword", "The new password is required").not().isEmpty(),
    validateFields,
  ],
  createNewPassword
);

router.put(
  "/changepassword",
  [
    body("agentCode", "Agent Code is required").not().isEmpty(),
    body("newPassword", "The new password is required").not().isEmpty(),
    body("oldPassword", "The old password is required").not().isEmpty(),
    validateFields,
    validateJWT,
  ],
  changePassword
);

export default router;
