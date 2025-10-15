/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { verifyToken } from "@infra/utils/auth";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.replace("Bearer ", "");
  const user = verifyToken(token);
  if (user) {
    (req as any).user = user;
    next();
  } else {
    return res.status(401).json({ error: "Invalid token" });
  }
}
