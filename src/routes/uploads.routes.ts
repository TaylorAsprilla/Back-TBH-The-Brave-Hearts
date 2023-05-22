/*
router: /api/uploads
*/

import { Router } from "express";
import validateJWT from "../middlewares/validate-jwt";
import expressFileUpload from "express-fileupload";
import { returnFile } from "../controllers/uploads.controller";
import { uploadFile } from "../controllers/upload-file.controller";
import upload from "../helpers/upload-file";

const router = Router();

// router.use(expressFileUpload());

router.get("/:type/:file", returnFile);

router.post("/document", upload.single("myfile"), uploadFile);
// router.put("/:type/:id", validateJWT, fileUpload);

export default router;
