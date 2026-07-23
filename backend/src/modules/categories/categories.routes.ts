import { Router } from "express";
import { index } from "./categories.controller";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", index);
