import { NextFunction, Request, Response } from "express";
import config from "../config/config";

const jwt = require("jsonwebtoken");

export interface CustomRequest extends Request {
  uid?: number;
}

const environment = config[process.env.ENVIRONMENT ?? "development"];

const validateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No token in request",
    });
  }

  try {
    const { uid } = jwt.verify(token, environment.jwtSecret);
    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }
};

export default validateJWT;
