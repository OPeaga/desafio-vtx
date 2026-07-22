import { prisma } from "../src/lib/prisma";

const categories = [
  { name: "Livros", slug: "livros" },
  { name: "Engenharia", slug: "engenharia" },
  { name: "Computação", slug: "computacao" },
  { name: "Química", slug: "quimica" },
  { name: "Móveis", slug: "moveis" },
  { name: "Outros", slug: "outros" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
}

main()
  .then(() => {
    console.log("Seed concluído");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
