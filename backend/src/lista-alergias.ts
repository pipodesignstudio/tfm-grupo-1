import prisma from "../src/config/prisma.config";

async function main() {
  const lista = await prisma.alergias.findMany();
  console.table(lista);
  await prisma.$disconnect();
}

main();