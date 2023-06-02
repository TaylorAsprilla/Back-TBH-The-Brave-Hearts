/*
router: /api/agents
*/

import { Router } from "express";
import {
  createAgent,
  deleteAgent,
  getAgent,
  getAgents,
  getAllAgents,
  updateAgent,
} from "../controllers/agents.controller";
import { check } from "express-validator";
import validateFields from "../middlewares/validate-fields";
import validateJWT from "../middlewares/validate-jwt";

const router = Router();

router.get("/", validateJWT, getAgents);
router.get("/all", validateJWT, getAllAgents);
router.get("/:id", validateJWT, getAgent);
router.post(
  "/",
  validateJWT,
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  createAgent
);
router.put(
  "/:id",
  validateJWT,
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail(),
    validateFields,
  ],
  updateAgent
);
router.delete("/:id", validateJWT, deleteAgent);

export default router;
