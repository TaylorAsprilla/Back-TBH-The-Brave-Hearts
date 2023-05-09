/*
router: /api/login
*/

import { Router } from "express";
import { body } from "express-validator";
import { login, renewToken } from "../controllers/auth.controllers";
import validateJWT from "../middlewares/validate-jwt";

const router = Router();

router.post(
  "/",
  [
    body("email", "Email is required").not().isEmpty().isEmail(),
    body("password", "Password is required").not().isEmpty(),
  ],
  login
);

router.get("/renew", validateJWT, renewToken);

export default router;
