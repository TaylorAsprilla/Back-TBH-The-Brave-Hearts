import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();

    res.json({
      ok: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the users.",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while getting the user.",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userInput = body;

    const existingUser = await UserModel.findOne({ email: userInput.email });
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        msg: "Email already in use.",
      });
    }

    // Create the user
    const newUser = new UserModel({
      name: userInput.name,
      email: userInput.email,
      password: userInput.password,
    });

    // Encrypt Password
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(userInput.password, salt);

    const userSaved = await newUser.save();

    res.status(201).json({
      ok: true,
      msg: "User created",
      user: userSaved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      msg: "Error occurred while creating the user.",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const uid = req.params.id;
  try {
    const userDB = await UserModel.findById(uid);
    const { password, email, ...fields } = req.body;

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "User does not exist",
        uid,
      });
    }

    if (userDB.email != email) {
      const existsEmail = await UserModel.findOne({ email });
      if (existsEmail) {
        return res.status(400).json({
          ok: false,
          msg: "There is already a user with that email",
        });
      }
    }

    fields.email = email;
    const userUpdated = await UserModel.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    return res.status(201).json({
      ok: true,
      msg: "Updated user",
      uid,
      user: userUpdated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      msg: "Failed to update user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      res.status(404).json({
        ok: false,
        msg: `user not found with id ${id}`,
      });
    }

    const deleteUser = await UserModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    res.json({
      ok: true,
      msg: "User customer",
      user: deleteUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Talk to the administrator",
    });
  }
};
