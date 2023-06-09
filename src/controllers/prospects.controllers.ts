import fs from "fs";
import { Request, Response } from "express";
import ProspectModel from "../models/prospect.model";
import { CustomRequest } from "../middlewares/validate-jwt";
import path from "path";
import sendEmail from "../helpers/email";
import AppMessages from "../constants/messages.enum";
import config from "../config/config";
import AgentModel from "../models/agent.model";

const environment = config[process.env.ENVIRONMENT || "development"];

export const getAllProspects = async (req: Request, res: Response) => {
  try {
    const prospects = await ProspectModel.find().populate(
      "agent",
      "firstName lastName agentCode email"
    );

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

export const getAllProspectsForAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    const prospects = await ProspectModel.find({ agent: agentId }).populate(
      "agent",
      "firstName lastName agentCode email"
    );

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

export const getProspect = async (req: Request, res: Response) => {
  try {
    const prospectId = req.params.id;
    const prospect = await ProspectModel.findById(prospectId).populate(
      "agent",
      "firstName lastName agentCode email"
    );

    res.json({
      ok: true,
      prospect,
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
  const emailTo = environment.emailCreateProspect;

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

    const agent = await AgentModel.findById(uid);
    if (!agent) {
      return res.status(409).json({
        ok: false,
        msg: "The agent with that identifier does not exist.",
      });
    }

    // Create the prospect
    const newProspect = new ProspectModel({
      agent: uid,
      ...body,
    });

    const prospect = await newProspect.save();

    const { firstName, lastName, email, _id } = prospect;
    const name = `${firstName} ${lastName}`;

    const templatePath = path.join(__dirname, "../templates/prospect.html");
    const emailTemplate = fs.readFileSync(templatePath, "utf8");

    const personalizedEmail = emailTemplate
      .replace("{{name}}", name)
      .replace("{{linkApp}}", `${environment.linkProspect}${_id}`)
      .replace("{{email}}", email);

    sendEmail(
      agent.email,
      AppMessages.NEW_PROSPECT,
      personalizedEmail,
      emailTo
    );

    res.json({
      ok: true,
      msg: "Prospect created",
      prospect,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "An error occurred while creating the prospect.",
    });
  }
};

export const updateProspects = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;
  const idAgent = req.uid;
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
      agent: idAgent,
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
