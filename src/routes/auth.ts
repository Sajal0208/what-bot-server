import { NextFunction, Request, Response } from "express";
import {
  loginUser,
  registerUser,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../services/authService";
import { verifyAccessToken } from "../middleware/authenticateUser";
const express = require("express");
const router = express.Router();

router.post(
  "/login",
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    try {
      const { user, validPassword, token, maxAge } = await loginUser(req.body);
      if (!user) {
        return res.status(401).json({
          message: "Login not successful",
          error: "User not found",
        });
      }
      if (!validPassword) {
        return res.status(401).json({
          message: "Login not successful",
          error: "Password is incorrect",
        });
      }

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, //convert 2h to ms; maxAge uses miliseconds
      });

      //if everything is good return the user
      return res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (err: any) {
      res.status(401).json({
        message: "Login not successful",
        error: err.message,
      });
    }
  }
);

router.post(
  "/register",
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //Check if Email already exists
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        error: "Register not successful",
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password less than 6 characters" });
    }

    try {
      const { newUser, token, maxAge } = await registerUser(req.body);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });

      return res.status(201).json({
        message: "User created successfully",
        newUser,
      });
    } catch (err: any) {
      return res.status(401).json({
        message: "User not created",
        error: err.message,
      });
    }
  }
);

router.get(
    '/me', verifyAccessToken, (req: Request, res: Response) => {
        const user = req.user;
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
                error: 'User not found',
            });
        }
        
        return res.status(200).json({
            message: 'User found',
            user,
        });
    }
)

router.put(
  "/update/:id",
  verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Please provide an id",
        error: "User not found",
      });
    }
    const user = await getUserById(Number(id));
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: "User not found",
      });
    }

    try {
      const updatedUser = await updateUserById(Number(id), req.body);

      return res.status(200).json({
        message: "User updated successfully",
        updatedUser,
      });
    } catch (err: any) {
      return res.status(401).json({
        message: "User not updated",
        error: err.message,
      });
    }
  }
);

module.exports = router;
