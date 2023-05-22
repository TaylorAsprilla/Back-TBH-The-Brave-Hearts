import { Request, Response } from "express";

export const uploadFile = async (req: Request, res: Response) => {
  console.log("Subir Archivo");
  console.log(req.file);
  console.log(req.files);

  const file = req.file;
  if (!file) {
    res.json("Error al subir el archivo");
  }
  res.send(file);
};
