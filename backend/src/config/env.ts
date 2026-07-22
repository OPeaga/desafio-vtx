import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const port = process.env.PORT ? Number(process.env.PORT) : 3333;

if (Number.isNaN(port)) {
  throw new Error("Env var PORT precisa ser um número válido");
}

if (!process.env.DATABASE_URL) {
  throw new Error("Env var DATABASE_URL não foi definida");
}

if (!process.env.JWT_SECRET) {
  throw new Error("Env var JWT_SECRET não foi definida");
}

export const env = {
  port,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};
