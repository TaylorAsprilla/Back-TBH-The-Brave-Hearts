import { Request, Response } from "express";
import CustomerModel from "../models/customer.model";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find();

    res.json({
      ok: true,
      msg: "Hola",
      customers,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
