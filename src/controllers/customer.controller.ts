import { Request, Response } from "express";
import { CustomerSchema } from "../models/customer.model";

class CustomerController {
  public async getCustomer(req: Request, res: Response) {
    res.json({
      ok: true,
      msg: "Hola",
    });
  }

  public async createCustomer(req: Request, res: Response) {
    console.log("body", req.body);
    const customer = new CustomerSchema(req.body);

    // Save customer
    await customer.save();

    res.json({
      ok: true,
      msg: "Hola",
    });
  }
}

export const customerController = new CustomerController();
