import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
