import { prisma } from "../../lib/prisma";

export async function getStats() {
  const [totalAds, totalUsers, totalDoacoes, totalVendas, adsByCategory] = await Promise.all([
    prisma.ad.count(),
    prisma.user.count(),
    prisma.ad.count({ where: { type: "doacao" } }),
    prisma.ad.count({ where: { type: "venda" } }),
    prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { ads: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    totalAds,
    totalUsers,
    totalDoacoes,
    totalVendas,
    adsByCategory: adsByCategory.map((category) => ({
      name: category.name,
      slug: category.slug,
      total: category._count.ads,
    })),
  };
}
