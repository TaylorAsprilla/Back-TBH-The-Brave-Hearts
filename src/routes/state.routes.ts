/*
router: /api/states
*/

import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import { getStates } from "../controllers/states.controller";

const router = Router();

router.get("/", validateJWT, getStates);

export default router;
