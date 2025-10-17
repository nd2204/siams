import { Request } from "express";

export function getAuthToken(req: Request): string {
  return [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
}
