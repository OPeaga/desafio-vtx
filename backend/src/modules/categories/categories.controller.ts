import { NextFunction, Request, Response } from "express";
import { listCategories } from "./categories.service";

export async function index(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await listCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
}
