import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createAdSchema } from "./ad.schema";
import { create, destroy, index, mine, show } from "./ad.controller";

export const adRoutes = Router();

adRoutes.get("/", index);
adRoutes.get("/me", authMiddleware, mine);
adRoutes.get("/:id", show);
adRoutes.post("/", authMiddleware, validate(createAdSchema), create);
adRoutes.delete("/:id", authMiddleware, destroy);
