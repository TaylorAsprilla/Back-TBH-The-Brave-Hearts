import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import PolicyModel from "../models/policy.model";

const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
const uploadDirectory = "./uploads/policy";

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ ok: false, msg: "No files have been uploaded." });
  }
  const policyId = req.params.policyId;

  const idPhotoFile = req.files.idPhoto as UploadedFile;
  const document1File = req.files.document1 as UploadedFile;
  const document2File = req.files.document2 as UploadedFile;

  const policy = await PolicyModel.findById(policyId);
  if (!policy) {
    return res.status(404).json({ ok: false, msg: "Policy not found." });
  }

  const idPhotoDirectory = path.join(uploadDirectory, "photoId");
  const document1Directory = path.join(uploadDirectory, "documentOne");
  const document2Directory = path.join(uploadDirectory, "documentTwo");

  const renameFile = (file: UploadedFile) => {
    const fileExtension = path.extname(file.name);
    const newFileName = `${policy.customer}-${Date.now()}${fileExtension}`;
    return newFileName;
  };

  const isAllowedExtension = (file: UploadedFile) => {
    const fileExtension = path.extname(file.name);
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };

  const saveFile = (
    file: UploadedFile,
    fileName: string,
    directory: string
  ) => {
    return new Promise<void>((resolve, reject) => {
      file.mv(`${directory}/${fileName}`, (error) => {
        if (error) {
          console.error(`Failed to save ${file.name}:`, error);
          reject();
        } else {
          resolve();
        }
      });
    });
  };

  try {
    const idPhotoFileName = renameFile(idPhotoFile);
    const document1FileName = renameFile(document1File);
    const document2FileName = renameFile(document2File);

    if (
      !isAllowedExtension(idPhotoFile) ||
      !isAllowedExtension(document1File) ||
      !isAllowedExtension(document2File)
    ) {
      return res.status(400).json({
        ok: false,
        msg: "One or more file extensions are not allowed.",
      });
    }

    await Promise.all([
      saveFile(idPhotoFile, idPhotoFileName, idPhotoDirectory),
      saveFile(document1File, document1FileName, document1Directory),
      saveFile(document2File, document2FileName, document2Directory),
    ]);

    // Update policy schema with file names
    const policy = await PolicyModel.findByIdAndUpdate(
      policyId,
      {
        $set: {
          "document.idPhoto": idPhotoFileName,
          "document.document1": document1FileName,
          "document.document2": document2FileName,
        },
      },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({ ok: false, msg: "Policy not found." });
    }

    res.json({
      ok: true,
      msg: "Files uploaded successfully.",
      policy,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ ok: false, msg: "Error uploading files." });
  }
};
