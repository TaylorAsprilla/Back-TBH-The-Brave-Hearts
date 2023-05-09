/*
router: /api/agents
*/

import { Router } from "express";
import {
  createAgent,
  deleteAgent,
  getAgents,
  updateAgent,
} from "../controllers/agents.controller";
import { body } from "express-validator";
import validateFields from "../middlewares/validate-fields";
import validateJWT from "../middlewares/validate-jwt";

const router = Router();

router.get("/", validateJWT, getAgents);
router.post(
  "/",
  // validateJWT,
  [
    body("firstName", "First Name is required").not().isEmpty(),
    body("lastName", "Last name is required").not().isEmpty(),
    body("state", "State is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty().isEmail(),
    body("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  createAgent
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
  updateAgent
);
router.delete("/:id", validateJWT, deleteAgent);

export default router;
