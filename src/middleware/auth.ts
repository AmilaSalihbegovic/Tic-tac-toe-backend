import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function auth(req: any, res: any, next:any) {
  const token = req.header("X-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. You dont have permision!");
  } else {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET || "");
      req.user = decode;
      next();
    } catch (error) {
      res.status(401).send("Access denied. You dont have permision!");
    }
  }
}
