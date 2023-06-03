/*
router: /api/uploads
*/

import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import expressFileUpload from "express-fileupload";
import { fileUpload, returnFile } from "../controllers/uploads.controller";
import { uploadDocument } from "../controllers/uploads-document";

const router = Router();

router.use(expressFileUpload());

router.get("/:type/:file", returnFile);

router.put("/:type/:id", validateJWT, fileUpload);
router.post("/documents/:policyId", uploadDocument);

export default router;
