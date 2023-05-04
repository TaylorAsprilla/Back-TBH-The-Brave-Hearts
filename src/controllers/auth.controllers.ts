import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AgentModel from "../models/agent.model";
import generateJWT from "../helpers/jwt";
import { CustomRequest } from "../middlewares/validate-jwt";

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
      user: agentDB,
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
