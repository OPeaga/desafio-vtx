import cors from "cors";
import express from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { adRoutes } from "./modules/ad/ad.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);

app.use(errorMiddleware);
