/*
router: /api/auth
*/

import { Router } from "express";
import { body } from "express-validator";
import { login } from "../controllers/auth.controllers";

const router = Router();

router.post(
  "/",
  [
    body("email", "Email is required").not().isEmpty().isEmail(),
    body("password", "Password is required").not().isEmpty(),
  ],
  login
);

export default router;
