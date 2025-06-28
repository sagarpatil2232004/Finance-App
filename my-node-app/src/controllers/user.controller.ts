import User from "../model/userSchema";
import {compare,hash} from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const userRegister = async (req: Request, res: Response) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
     res.status(400).json({ message: "User ID and password are required" });
     return;
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
       res.status(409).json({ message: "User already exists" });
       return;
    }

    // Hash the password
    const hashedPassword = await hash(password, 10); // 10 is salt rounds

    // Create new user
    const newUser = new User({
      user_id,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ user_id }, process.env.JWT_SECRET as string);

    res.status(201).json({ token, user_id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const userLogin = async (req: Request, res: Response) => {
  const { user_id, password } = req.body;

    if (!user_id || !password) {
     res.status(400).json({ message: "User ID and password are required" });
     return;
    }

  try {
    const user = await User.findOne({ user_id });
    if (!user) {
       res.status(404).json({ message: "User not found" });
       
        return;
    }

  const isMatch = await compare(password, user.password);
    if (!isMatch) {
       res.status(401).json({ message: "Invalid credentials" });
       return;
    }

    const token = jwt.sign({ user_id }, process.env.JWT_SECRET as string );
    res.status(200).json({ token , user_id});
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

