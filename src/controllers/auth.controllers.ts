import fs from "fs";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AgentModel from "../models/agent.model";
import generateJWT from "../helpers/jwt";
import { CustomRequest } from "../middlewares/validate-jwt";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import sendEmail from "../helpers/email";
import AppMessages from "../constants/messages.enum";
import path from "path";

const environment = config[process.env.ENVIRONMENT || "development"];

export const login = async (req: Request, res: Response) => {
  const { agentCode, password } = req.body;
  try {
    // Verify Agent Code
    const agentDB = await AgentModel.findOne({ agentCode: agentCode });

    if (!agentDB) {
      return res.status(404).json({
        ok: false,
        msg: "Invalid Agent Code",
      });
    }

    //Verify password
    const validPassword = bcrypt.compareSync(password, agentDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid Password",
      });
    }

    // generate Token
    const token = await generateJWT(agentDB.id, agentDB.email);

    res.json({
      ok: true,
      token,
      agent: agentDB,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      msg: "Login error",
    });
  }
};

export const renewToken = async (req: CustomRequest, res: Response) => {
  const uid = req.uid;

  // // make sure uid is a string
  if (typeof uid === "undefined") {
    throw new Error("uid not provided");
  }

  const agent = await AgentModel.findById(uid);

  // generate Token
  const token = await generateJWT(uid.toString());
  res.json({
    ok: true,
    token,
    agent,
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { body } = req;
  const { agentCode } = body;

  try {
    const agent = await AgentModel.findOne({ agentCode });

    if (!agent) {
      return res.status(404).json({
        ok: false,
        msg: AppMessages.THE_AGENT_CODE_DOES_NOT_EXIST,
      });
    }

    const token = await generateJWT(
      agent.id,
      agentCode,
      process.env.EXPIRES_IN,
      environment.jwtSecretReset
    );

    await AgentModel.updateOne({ resetToken: token });

    const name = `${agent.firstName} ${agent.lastName}`;
    const email = agent.email;

    const templatePath = path.join(
      __dirname,
      "../templates/forgotPassword.html"
    );
    const emailTemplate = fs.readFileSync(templatePath, "utf8");
    const personalizedEmail = emailTemplate
      .replace("{{name}}", name)
      .replace("{{verifyLink}}", environment.verifyLink + token)
      .replace("{{verifyLinkText}}", environment.verifyLink + token);

    sendEmail(email, AppMessages.RESET_YOUR_PASSWORD, personalizedEmail);

    res.json({
      ok: true,
      msg: AppMessages.CHECK_YOUR_EMAIL_FOR_THE_LINK_TO_RESET_YOUR_PASSWORD,
      token,
      agent,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: AppMessages.TALK_TO_THE_ADMINISTRATORS,
      error,
    });
  }
};

export const createNewPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const resetToken = req.header("x-reset") as string;

  if (!resetToken || !newPassword) {
    return res.status(400).json({
      ok: false,
      msg: AppMessages.ALL_FIELDS_ARE_REQUIRED,
    });
  }

  try {
    const jwtPayload = jwt.verify(resetToken, environment.jwtSecretReset);

    const agent = await AgentModel.findOne({ resetToken });

    if (!agent) {
      return res.status(404).json({
        ok: false,
        msg: "The password reset link has expired. Please reset the password again.",
      });
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await AgentModel.updateOne(
      { resetToken },
      { password: hashedPassword, resetToken: "" }
    );

    res.json({
      ok: true,
      msg: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: AppMessages.TALK_TO_THE_ADMINISTRATORS,
      error,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { body } = req;
  const { oldPassword, newPassword, agentCode } = body;

  try {
    const agent = await AgentModel.findOne({ agentCode });
    if (!agent) {
      return res.status(404).json({
        ok: false,
        msg: "Agent does not exist",
      });
    }

    const validarPassword = bcrypt.compareSync(oldPassword, agent.password);

    if (!validarPassword) {
      return res.status(400).json({
        ok: false,
        msg: "The old password is invalid",
      });
    }

    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(newPassword, salt);

    const agentUpdated = await AgentModel.updateOne(
      { agentCode },
      { password: password }
    );

    res.json({
      ok: true,
      msg: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Failed to change password, please contact the administrator",
      error,
    });
  }
};
