import { Request, Response } from "express";
import PolicyModel from "../models/policy.model";
import { CustomRequest } from "../middlewares/validate-jwt";

export const getPolicy = async (req: Request, res: Response) => {
  try {
    const policy = await PolicyModel.find().populate(
      "agent",
      "firstName lastName agentCode email"
    );

    res.json({
      ok: true,
      customers: policy,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const createPolicy = async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const uid = req.uid;

  try {
    // Create the customer
    const newPolicy = new PolicyModel({
      agent: uid,
      ...body,
    });

    const policy = await newPolicy.save();

    res.json({
      ok: true,
      msg: "Policy create",
      policy,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const updatePolicy = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;
  const idAgent = req.uid;
  try {
    const policy = await PolicyModel.findById(id);

    if (!policy) {
      res.status(404).json({
        ok: false,
        msg: `Policy not found with id ${id}`,
      });
    }

    const changeCustomer = {
      ...req.body,
      agent: idAgent,
    };

    const updatedCustomer = await PolicyModel.findByIdAndUpdate(
      id,
      changeCustomer,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Updated policy",
      id,
      policy: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};

export const deletePolicy = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const customer = await PolicyModel.findById(id);

    if (!customer) {
      res.status(404).json({
        ok: false,
        msg: `Customer not found with id ${id}`,
      });
    }

    const deleteCustomer = await PolicyModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Delete policy",
      policy: deleteCustomer,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};
