import { NextFunction } from "express";
import asyncHandler from "express-async-handler";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { AuthenticationError } from "./errorMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { getUserByEmail } from "../services/authService";
const checkCookie = (req: any) => {
    return req.cookies['jwt']
}

const verifyAccessToken = asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
        let token = req.cookies.jwt

        if (!token) {
            res.status(401);
            throw new AuthenticationError("Not authorized, no token")
        } 
        const jwtSecret = process.env.JWT_SECRET || "";
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        if(!decoded || !decoded.email) {
            res.status(401);
            throw new AuthenticationError("Not authorized, no token")
        }
  
        const user = await getUserByEmail(decoded.email);

        if(!user) {
            res.status(401);
            throw new AuthenticationError("Not authorized, no token")
        }

        req.user = user;

        next();
    } catch (e) {
        res.status(401);
        throw new AuthenticationError("Not authorized, no token")
    }
})

export { verifyAccessToken };