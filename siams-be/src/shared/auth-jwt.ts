/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { type User } from "@domain/entities/index.js";
import assert from "assert";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret"; // replace with env var in production
assert(JWT_SECRET !== "supersecret")

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

export function generateToken(user: User): string {
  return jwt.sign(
    {
      email: user.email,
      roles: user.roles,
      sub: user.userId
    },
    JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );
}

export function verifyToken(token: string): null | User {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
    };
  } catch {
    return null;
  }
}
