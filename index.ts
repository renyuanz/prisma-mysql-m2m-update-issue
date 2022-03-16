import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function emptyDatabase() {
  const tables = Prisma.dmmf.datamodel.models.map(
    (model) => model.dbName || model.name
  );

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
  }
}

async function main() {
  await emptyDatabase();
  const user = await prisma.user.create({
    data: {
      email: "user@exmaple.com",
      name: "Max",
    },
  });

  await prisma.workspace.create({
    data: {
      name: "workspace",
      users: {
        create: [
          {
            role: "ADMIN",
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: "Bob",
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
