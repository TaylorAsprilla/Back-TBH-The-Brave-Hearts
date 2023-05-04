import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

export async function fileUpload(req: Request, res: Response) {
  const type = req.params.type;
  const id = req.params.id;

  const validTypes = ["customers", "agents"];
  const validExtensions = [
    "png",
    "jpg",
    "jpeg",
    "pdf",
    "PDF",
    "PNG",
    "JPEG",
    "JPG",
  ];

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ ok: false, msg: "No files were uploaded." });
  }

  const file = req.files.image as UploadedFile;

  const cutName = file.name.split(".");
  const fileExtension = cutName[cutName.length - 1];

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

  const path = `./src/uploads/${type}/${fileName}`;

  try {
    await file.mv(path);

    //update database
    // updateImage();

    res.json({
      ok: true,
      fileName,
      msg: " File uploaded!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error moving file",
    });
  }
}
