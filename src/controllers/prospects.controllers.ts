import { Request, Response } from "express";
import ProspectModel from "../models/prospect.model";
import { CustomRequest } from "../middlewares/validate-jwt";

export const getProspects = async (req: Request, res: Response) => {
  try {
    const prospects = await ProspectModel.find().populate("user", "name email");

    res.json({
      ok: true,
      prospects,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const createProspects = async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const prospectInput = body;
  const uid = req.uid;
  try {
    const existingProspectEmail = await ProspectModel.findOne({
      email: prospectInput.email,
    });
    if (existingProspectEmail) {
      return res.status(409).json({
        ok: false,
        msg: "The prospect already exists with that email.",
      });
    }

    // Create the prospect
    const newProspect = new ProspectModel({
      user: uid,
      ...body,
    });

    const prospect = await newProspect.save();

    res.json({
      ok: true,
      msg: "Hola",
      prospect,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const updateProspects = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;
  const idUser = req.uid;
  try {
    const prospect = await ProspectModel.findById(id);

    if (!prospect) {
      res.status(404).json({
        ok: false,
        msg: `Prospect not found with id ${id}`,
      });
    }

    const changeProspect = {
      ...req.body,
      user: idUser,
    };

    const updatedProspect = await ProspectModel.findByIdAndUpdate(
      id,
      changeProspect,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Updated prospect",
      id,
      prospect: updatedProspect,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};

export const deleteProspects = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const prospect = await ProspectModel.findById(id);

    if (!prospect) {
      res.status(404).json({
        ok: false,
        msg: `Prospect not found with id ${id}`,
      });
    }

    const deleteProspect = await ProspectModel.findByIdAndUpdate(
      id,
      {
        active: false,
      },
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Delete prospect",
      prospect: deleteProspect,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};