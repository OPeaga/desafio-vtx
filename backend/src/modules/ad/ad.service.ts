import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middlewares/error.middleware";
import { CreateAdInput, AdFilters } from "./ad.schema";

export async function createAd(userId: string, data: CreateAdInput) {
  return prisma.ad.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      price: data.price ?? null,
      imageUrl: data.imageUrl ?? null,
      userId,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
}

export async function listAds(filters: AdFilters) {
  const where: Prisma.AdWhereInput = {};

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }

  if (filters.min_price != null || filters.max_price != null) {
    where.price = {
      ...(filters.min_price != null ? { gte: filters.min_price } : {}),
      ...(filters.max_price != null ? { lte: filters.max_price } : {}),
    };
  }

  const skip = (filters.page - 1) * filters.limit;

  const [items, total] = await Promise.all([
    prisma.ad.findMany({
      where,
      include: { category: true, user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.limit,
    }),
    prisma.ad.count({ where }),
  ]);

  return {
    items,
    meta: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

export async function listAdsByUser(userId: string) {
  return prisma.ad.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdById(id: string) {
  const ad = await prisma.ad.findUnique({
    where: { id },
    include: { category: true, user: { select: { id: true, name: true } } },
  });

  if (!ad) {
    throw new AppError("Anúncio não encontrado", 404);
  }

  return ad;
}

export async function deleteAd(id: string, userId: string) {
  const ad = await prisma.ad.findUnique({ where: { id } });

  if (!ad) {
    throw new AppError("Anúncio não encontrado", 404);
  }

  if (ad.userId !== userId) {
    throw new AppError("Você não tem permissão para remover este anúncio", 403);
  }

  await prisma.ad.delete({ where: { id } });
}
