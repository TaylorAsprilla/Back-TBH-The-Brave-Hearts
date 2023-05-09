import { Request, Response } from "express";
import CustomerModel from "../models/customer.model";
import { CustomRequest } from "../middlewares/validate-jwt";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find().populate(
      "agent",
      "name email"
    );

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

export const createCustomers = async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const customerInput = body;
  const uid = req.uid;

  try {
    const existingCustomer = await CustomerModel.findOne({
      greenCard: customerInput.greenCard,
    });
    if (existingCustomer) {
      return res.status(409).json({
        ok: false,
        msg: "The customer already exists with that green card.",
      });
    }

    // Create the customer
    const newCustomer = new CustomerModel({
      agent: uid,
      ...body,
    });

    const customers = await newCustomer.save();

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

export const updateCustomers = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;
  const idAgent = req.uid;
  try {
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      res.status(404).json({
        ok: false,
        msg: `Customer not found with id ${id}`,
      });
    }

    const changeCustomer = {
      ...req.body,
      agent: idAgent,
    };

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      changeCustomer,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Updated client",
      id,
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};

export const deleteCustomers = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      res.status(404).json({
        ok: false,
        msg: `Customer not found with id ${id}`,
      });
    }

    const deleteCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Delete customer",
      customer: deleteCustomer,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};
