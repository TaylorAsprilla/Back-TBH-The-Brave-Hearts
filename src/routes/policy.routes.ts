/*
router: /api/policy
*/
import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import expressFileUpload from "express-fileupload";
import {
  createPolicy,
  deletePolicy,
  getAllPoliciesForAgent,
  getAllPolicy,
  getPolicy,
  updatePolicy,
} from "../controllers/policy.controllers";

const router = Router();
router.use(expressFileUpload());

router.get("/", validateJWT, getAllPolicy);
router.get("/:id", validateJWT, getPolicy);
router.get("/all/:id", validateJWT, getAllPoliciesForAgent);

router.post("/", validateJWT, createPolicy);
router.put("/:id", validateJWT, updatePolicy);
router.delete("/:id", validateJWT, deletePolicy);

export default router;
