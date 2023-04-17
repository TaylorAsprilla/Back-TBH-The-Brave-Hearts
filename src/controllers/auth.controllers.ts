import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";
import generateJWT from "../helpers/jwt";

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
    const token = await generateJWT(userDB.id, userDB.email);

    res.json({
      ok: true,
      token,
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
