import fs from "fs";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AgentModel from "../models/agent.model";
import { CustomRequest } from "../middlewares/validate-jwt";
import path from "path";
import config from "../config/config";
import sendEmail from "../helpers/email";
import AppMessages from "../constants/messages.enum";

const environment = config[process.env.ENVIRONMENT || "development"];

export const getAgents = async (req: Request, res: Response) => {
  const desde = Number(req.query.desde) || 0;

  try {
    const [agents, total] = await Promise.all([
      AgentModel.find().skip(desde).limit(10),
      AgentModel.countDocuments(),
    ]);

    res.json({
      ok: true,
      agents,
      total,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the agents.",
    });
  }
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await AgentModel.find({});

    res.json({
      ok: true,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the agents.",
    });
  }
};

export const getAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;

    const agent = await AgentModel.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        ok: false,
        msg: "Agent not found",
      });
    }

    res.json({
      ok: true,
      agent,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the agent.",
    });
  }
};

export const createAgent = async (req: CustomRequest, res: Response) => {
  try {
    const { body } = req;

    const existingAgentCode = await AgentModel.findOne({
      agentCode: body.agentCode,
    });

    if (existingAgentCode) {
      return res.status(409).json({
        ok: false,
        msg: "The agent code already exists.",
      });
    }

    const existingEmail = await AgentModel.findOne({ email: body.email });

    if (existingEmail) {
      return res.status(409).json({
        ok: false,
        msg: "Email already associated with an agent.",
      });
    }

    // Create the agent
    const newAgent = new AgentModel({
      agent: req.uid,
      ...body,
    });

    // Encrypt Password
    const salt = bcrypt.genSaltSync();
    newAgent.password = bcrypt.hashSync(body.password, salt);

    const agentSaved = await newAgent.save();

    const { firstName, lastName, email, agentCode } = agentSaved;
    const name = `${firstName} ${lastName}`;

    const templatePath = path.join(__dirname, "../templates/welcome.html");
    const emailTemplate = fs.readFileSync(templatePath, "utf8");

    const personalizedEmail = emailTemplate
      .replace("{{name}}", name)
      .replace("{{linkApp}}", environment.linkApp)
      .replace("{{agentCode}}", agentCode.toString())
      .replace("{{password}}", body.password);

    sendEmail(
      email,
      AppMessages.WELCOME_TO_OUR_PLATFORM_TBH,
      personalizedEmail
    );

    res.status(201).json({
      ok: true,
      msg: "Agent created",
      agent: agentSaved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      msg: "An error occurred while creating the agent.",
    });
  }
};

export const updateAgent = async (req: Request, res: Response) => {
  const uid = req.params.id;
  try {
    const agentDB = await AgentModel.findById(uid);
    const { password, email, ...fields } = req.body;

    if (!agentDB) {
      return res.status(404).json({
        ok: false,
        msg: "Agent does not exist",
        uid,
      });
    }

    if (agentDB.email != email) {
      const existsEmail = await AgentModel.findOne({ email });
      if (existsEmail) {
        return res.status(400).json({
          ok: false,
          msg: "There is already a agent with that email",
        });
      }
    }

    fields.email = email;
    const agentUpdated = await AgentModel.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    return res.status(201).json({
      ok: true,
      msg: "Updated agent",
      uid,
      agent: agentUpdated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      msg: "Failed to update agent",
    });
  }
};

export const deleteAgent = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const agent = await AgentModel.findById(id);

    if (!agent) {
      res.status(404).json({
        ok: false,
        msg: `Agent not found with id ${id}`,
      });
    }

    const deleteAgent = await AgentModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Agent removed",
      agent: deleteAgent,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};
