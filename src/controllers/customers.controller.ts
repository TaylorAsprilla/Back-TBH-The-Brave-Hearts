import fs from "fs";
import { Request, Response } from "express";
import CustomerModel from "../models/customer.model";
import { CustomRequest } from "../middlewares/validate-jwt";
import PolicyModel from "../models/policy.model";
import sendEmail from "../helpers/email";
import AppMessages from "../constants/messages.enum";
import path from "path";
import { Agent } from "http";
import AgentModel from "../models/agent.model";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find().populate(
      "agent",
      "firstName lastName agentCode email"
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

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find({});

    res.json({
      ok: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the customers.",
    });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await CustomerModel.findById(customerId).populate(
      "agent",
      "firstName lastName agentCode email"
    );
    if (customer) {
      res.json({
        ok: true,
        customer,
      });
    } else {
      return res.status(404).json({
        ok: false,
        msg: "Customer not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const createCustomers = async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const customerInput = body.customer;
  const policyInput = body.policy;
  const uid = req.uid;

  try {
    const existingCustomer = await CustomerModel.findOne({
      documentNumber: customerInput.documentNumber,
    });
    if (existingCustomer) {
      return res.status(409).json({
        ok: false,
        msg: "The customer already exists with that document number.",
      });
    }

    const existingEmail = await CustomerModel.findOne({
      email: customerInput.email,
    });
    if (existingEmail) {
      return res.status(409).json({
        ok: false,
        msg: `The customer already exists with this email, ${customerInput.email}`,
      });
    }

    // Create the customer
    const newCustomer = new CustomerModel({
      agent: uid,
      ...customerInput,
    });

    const customer = await newCustomer.save();

    const newPolicy = new PolicyModel({
      agent: uid,
      customer: customer._id,
      ...policyInput,
    });

    const policy = await newPolicy.save();

    const agent = await AgentModel.findById(uid);

    if (newCustomer) {
      const { firstName, lastName, email } = newCustomer;
      const name = `${firstName} ${lastName}`;

      const templatePath = path.join(__dirname, "../templates/policy.html");
      const emailTemplate = fs.readFileSync(templatePath, "utf8");

      const personalizedEmail = emailTemplate.replace("{name}", name);

      sendEmail(
        email,
        AppMessages.NEW_POLICY_REGISTERED,
        personalizedEmail,
        agent?.email
      );
    }

    res.json({
      ok: true,
      msg: "Client created",
      customer,
      policy,
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
