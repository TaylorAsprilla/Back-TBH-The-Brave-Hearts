import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import updateImage from "../helpers/update-image";
import path from "path";
import fs from "fs";
import config from "../config/config";

const environment = config[process.env.ENVIRONMENT || "development"];

export async function fileUpload(req: Request, res: Response) {
  const type = req.params.type;
  const id = req.params.id;

  const validTypes = ["customers", "agents"];
  const validExtensions = ["png", "jpg", "jpeg", "pdf"];

  console.log("file", req);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ ok: false, msg: "No files were uploaded." });
  }

  const file = req.files?.image as UploadedFile;

  console.log("file", file);

  if (!file) {
    return res.status(400).json({
      ok: false,
      msg: "No file was uploaded.",
    });
  }

  const cutName = file.name.split(".");
  const fileExtension = cutName[cutName.length - 1].toLowerCase(); // Convertir la extensión a minúsculas

  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      ok: false,
      msg: "Not a valid extension",
    });
  }

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: "The selected type is not agents or customers",
    });
  }

  const fileName = `${uuidv4()}.${fileExtension}`;

  const path = `./uploads/${type}/${fileName}`;

  try {
    await file.mv(path);

    // Actualizar la base de datos
    await updateImage(id, type, fileName);

    res.json({
      ok: true,
      fileName,
      msg: "File uploaded!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error moving file",
    });
  }
}

export async function returnFile(req: Request, res: Response) {
  const type = req.params.type;
  const fileName = req.params.file;

  const defaultFilePath = path.join(__dirname, environment.defaultFilePath);
  let filePath = path.join(__dirname, `../uploads/${type}/${fileName}`);

  if (!fs.existsSync(filePath)) {
    filePath = defaultFilePath;
  }

  res.sendFile(filePath);
}
