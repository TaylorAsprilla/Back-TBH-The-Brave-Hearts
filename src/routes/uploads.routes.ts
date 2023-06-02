/*
router: /api/uploads
*/

import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import expressFileUpload from "express-fileupload";
import { fileUpload, returnFile } from "../controllers/uploads.controller";

const router = Router();

router.use(expressFileUpload());

router.get("/:type/:file", returnFile);

router.put("/:type/:id", validateJWT, fileUpload);

export default router;
