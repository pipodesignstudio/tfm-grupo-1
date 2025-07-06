import prisma from "../config/prisma.config";

async function main() {
  const lista = await prisma.alergias.findMany();
  await prisma.$disconnect();
}

main();