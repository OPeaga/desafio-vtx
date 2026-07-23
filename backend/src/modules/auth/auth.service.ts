import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/error.middleware";
import { LoginInput, RegisterInput } from "./auth.schema";

function generateToken(userId: string) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export async function registerUser({ name, email, password }: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = generateToken(user.id);

  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Credenciais inválidas", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Credenciais inválidas", 401);
  }

  const token = generateToken(user.id);

  return { user: { id: user.id, name: user.name, email: user.email }, token };
}
