import { NextFunction, Request, Response } from "express";
import { getStats } from "./stats.service";

export async function index(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getStats();
    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
}
