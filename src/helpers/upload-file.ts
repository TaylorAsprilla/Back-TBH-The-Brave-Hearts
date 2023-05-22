import { Request } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  // Array con las extensiones permitidas
  const allowedExtensions = [".pdf", ".doc", ".jpg", ".jpeg", ".png"];

  // Verificar la extensión del archivo
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("The file must be a PDF, DOC, JPG, or PNG document."), false); // Rechazar el archivo
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
