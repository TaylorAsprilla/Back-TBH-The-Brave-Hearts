/*
router: /api/search:value
*/

import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import { getSearch } from "../controllers/search.controller";

const router = Router();

router.get("/:value", validateJWT, getSearch);

export default router;
