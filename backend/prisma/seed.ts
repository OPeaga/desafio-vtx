import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const categories = [
  { name: "Livros", slug: "livros" },
  { name: "Engenharia", slug: "engenharia" },
  { name: "Computação", slug: "computacao" },
  { name: "Química", slug: "quimica" },
  { name: "Móveis", slug: "moveis" },
  { name: "Outros", slug: "outros" },
];

// Senha padrão de todos os usuários de seed — só para ambiente de dev.
const SEED_PASSWORD = "Senha123";

const users = [
  { name: "Lucas Silva", email: "lucas@unifor.br" },
  { name: "Mariana Oliveira", email: "mariana@unifor.br" },
  { name: "Beatriz Costa", email: "beatriz@unifor.br" },
  { name: "Matheus Pereira", email: "matheus@unifor.br" },
];

const ads = [
  {
    ownerEmail: "lucas@unifor.br",
    categorySlug: "livros",
    title: "Cálculo James Stewart Vol. 1 (8ª Edição)",
    description:
      "Livro em ótimo estado com poucos grifos a lápis. Essencial para disciplinas de Cálculo I e II.",
    type: "venda",
    price: 45.0,
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  },
  {
    ownerEmail: "lucas@unifor.br",
    categorySlug: "livros",
    title: "Física Básica Moysés Vol. 2",
    description: "Usado por um semestre, capa com leve desgaste, miolo intacto.",
    type: "doacao",
    price: null,
    imageUrl: null,
  },
  {
    ownerEmail: "mariana@unifor.br",
    categorySlug: "engenharia",
    title: "Calculadora Científica Casio fx-82MS",
    description:
      "Funcionando perfeitamente com tampa de proteção original. Ideal para engenharias.",
    type: "doacao",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    ownerEmail: "mariana@unifor.br",
    categorySlug: "engenharia",
    title: "Jogo de Esquadros e Escalímetro",
    description: "Kit completo de desenho técnico, pouco uso.",
    type: "venda",
    price: 20.0,
    imageUrl: null,
  },
  {
    ownerEmail: "beatriz@unifor.br",
    categorySlug: "quimica",
    title: "Jaleco Branco Algodão M (Manga Longa)",
    description: "Jaleco usado por 1 semestre em laboratório de Química. Sem manchas, higienizado.",
    type: "venda",
    price: 35.0,
    imageUrl:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    ownerEmail: "beatriz@unifor.br",
    categorySlug: "quimica",
    title: "Óculos de Proteção para Laboratório",
    description: "Par de óculos de proteção, pouco uso, sem riscos nas lentes.",
    type: "doacao",
    price: null,
    imageUrl: null,
  },
  {
    ownerEmail: "matheus@unifor.br",
    categorySlug: "computacao",
    title: "Kit Arduino Uno R3 + Jumpers + Protoboard",
    description: "Kit de eletrônica de bancada completo para disciplinas de Sistemas Embarcados.",
    type: "venda",
    price: 80.0,
    imageUrl:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80",
  },
  {
    ownerEmail: "matheus@unifor.br",
    categorySlug: "computacao",
    title: "Mouse e Teclado Mecânico Usados",
    description: "Kit periféricos em bom estado, teclado ABNT2.",
    type: "venda",
    price: 60.0,
    imageUrl: null,
  },
  {
    ownerEmail: "lucas@unifor.br",
    categorySlug: "moveis",
    title: "Cadeira de Escritório Ergonômica",
    description: "Cadeira giratória com apoio de braço, pequenos sinais de uso.",
    type: "venda",
    price: 150.0,
    imageUrl: null,
  },
  {
    ownerEmail: "mariana@unifor.br",
    categorySlug: "moveis",
    title: "Luminária de Mesa LED",
    description: "Luminária articulada com 3 níveis de intensidade de luz.",
    type: "doacao",
    price: null,
    imageUrl: null,
  },
  {
    ownerEmail: "beatriz@unifor.br",
    categorySlug: "outros",
    title: "Mochila Universitária Reforçada",
    description: "Mochila com compartimento para notebook, uso de um ano, bem conservada.",
    type: "venda",
    price: 40.0,
    imageUrl: null,
  },
  {
    ownerEmail: "matheus@unifor.br",
    categorySlug: "outros",
    title: "Garrafa Térmica 1L",
    description: "Garrafa térmica de aço inox, mantém temperatura por até 12h.",
    type: "doacao",
    price: null,
    imageUrl: null,
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const userIds: Record<string, string> = {};
  
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, passwordHash },
    });
    userIds[user.email] = created.id;
  }

  // Reseta apenas os anúncios dos usuários de seed, para o script ser
  // idempotente sem apagar dados de outros usuários criados fora do seed.
  await prisma.ad.deleteMany({ where: { userId: { in: Object.values(userIds) } } });

  const categoryIds: Record<string, number> = {};
  for (const category of await prisma.category.findMany()) {
    categoryIds[category.slug] = category.id;
  }

  for (const ad of ads) {
    await prisma.ad.create({
      data: {
        title: ad.title,
        description: ad.description,
        type: ad.type,
        price: ad.price,
        imageUrl: ad.imageUrl,
        userId: userIds[ad.ownerEmail],
        categoryId: categoryIds[ad.categorySlug],
      },
    });
  }

  console.log(`Seed concluído: ${users.length} usuários, ${ads.length} anúncios.`);
  console.log(`Login de qualquer usuário de seed: senha "${SEED_PASSWORD}" (ex.: lucas@unifor.br).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
