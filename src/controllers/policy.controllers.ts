import fs from "fs";
import { Request, Response } from "express";
import PolicyModel from "../models/policy.model";
import { CustomRequest } from "../middlewares/validate-jwt";
import CustomerModel from "../models/customer.model";
import path from "path";
import config from "../config/config";
import sendEmail from "../helpers/email";
import AppMessages from "../constants/messages.enum";
import AgentModel from "../models/agent.model";

const environment = config[process.env.ENVIRONMENT || "development"];

export const getAllPolicy = async (req: Request, res: Response) => {
  try {
    const policy = await PolicyModel.find()
      .populate({
        path: "agent",
        select: "firstName lastName agentCode email",
      })
      .populate({
        path: "customer",
        select: "firstName lastName email",
      });

    res.json({
      ok: true,
      policy,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const getAllPoliciesForAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;

    const policy = await PolicyModel.find({ agent: agentId })
      .populate({
        path: "agent",
        select: "firstName lastName agentCode email",
      })
      .populate({
        path: "customer",
        select: "firstName lastName email",
      });

    res.json({
      ok: true,
      policy,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

export const getPolicy = async (req: Request, res: Response) => {
  try {
    const policyId = req.params.id;
    const policy = await PolicyModel.findById(policyId)
      .populate({
        path: "agent",
        select: "firstName lastName agentCode email",
      })
      .populate({
        path: "customer",
        select: "firstName lastName email",
      });
    if (policy) {
      res.json({
        ok: true,
        policy,
      });
    } else {
      return res.status(404).json({
        ok: false,
        msg: "Policy not found.",
      });
    }
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
    const newPolicy = new PolicyModel({
      agent: uid,
      ...body,
    });

    const policy = await newPolicy.save();

    const customer = await CustomerModel.findById(policy.customer);
    const agent = await AgentModel.findById(uid);

    if (customer) {
      const { firstName, lastName, email } = customer;

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
