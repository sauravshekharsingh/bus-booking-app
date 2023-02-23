import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

import { createError } from "./../../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(createError(404, "Email already exists."));

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(createError(403, "Email does not exists."));

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return next(createError(400, "Wrong email or password."));

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({
      success: true,
      message: "Logged in successfully.",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
};
