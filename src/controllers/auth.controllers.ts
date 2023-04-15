import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Verify email
    const userDB = await UserModel.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Invalid email",
      });
    }

    //Verify password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid Password",
      });
    }

    // generate Token

    res.json({
      ok: true,
      user: userDB,
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
