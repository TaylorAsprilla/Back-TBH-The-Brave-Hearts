import { Request, Response } from "express";
import StateModel from "../models/state.model";

export const getStates = async (req: Request, res: Response) => {
  try {
    const states = await StateModel.find({});

    res.json({
      ok: true,
      states,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the states.",
    });
  }
};
