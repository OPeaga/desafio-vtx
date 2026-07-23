import { Router } from "express";
import { index } from "./stats.controller";

export const statsRoutes = Router();

statsRoutes.get("/", index);
