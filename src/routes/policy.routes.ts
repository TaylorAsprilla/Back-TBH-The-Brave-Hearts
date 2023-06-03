/*
router: /api/policy
*/
import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import expressFileUpload from "express-fileupload";
import {
  createPolicy,
  deletePolicy,
  getPolicy,
  updatePolicy,
} from "../controllers/policy.controllers";

const router = Router();
router.use(expressFileUpload());

router.get("/", validateJWT, getPolicy);

router.post("/", validateJWT, createPolicy);
router.put("/:id", validateJWT, updatePolicy);
router.delete("/:id", validateJWT, deletePolicy);

export default router;
