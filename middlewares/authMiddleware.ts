import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("No authorization.");
  }

  if (authHeader !== "pss-this-is-my-secret") {
    return res.status(401).send("Access denied. Wrong authorization header.");
  }

  next();
};
