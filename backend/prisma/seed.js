import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.designer.createMany({
    data: [
      {
        name: "Studio Noir",
        email: "contact@studionoir.com",
        styles: "Luxury, Modern",
        city: "Mumbai"
      },
      {
        name: "Bonito Designs",
        email: "hello@bonito.in",
        styles: "Minimal, Budget",
        city: "Mumbai"
      },
      {
        name: "Studia 54",
        email: "info@studia-54.com",
        styles: "Premium, Contemporary",
        city: "Mumbai"
      }
    ]
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
