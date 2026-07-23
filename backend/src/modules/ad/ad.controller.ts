import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createAd, deleteAd, getAdById, listAds } from "./ad.service";
import { adFiltersSchema } from "./ad.schema";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ad = await createAd(req.userId!, req.body);
    return res.status(201).json(ad);
  } catch (error) {
    return next(error);
  }
}

export async function index(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = adFiltersSchema.parse(req.query);
    const result = await listAds(filters);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function show(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ad = await getAdById(req.params.id);
    return res.status(200).json(ad);
  } catch (error) {
    return next(error);
  }
}

export async function destroy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteAd(req.params.id, req.userId!);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
