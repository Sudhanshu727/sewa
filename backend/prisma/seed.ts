import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding announcements...");

  await prisma.announcement.deleteMany();

  await prisma.announcement.create({
    data: {
      refNumber: "SEWA-CIR-01",
      category: "Announcements",
      title:
        "SEWA 2026 / SEWA Youth Innovation Challenge officially launched at Delhi Technological University on 19 September 2026.",
      summary:
        "SEWA 2026 / SEWA Youth Innovation Challenge officially launched at Delhi Technological University on 19 September 2026.",
      detail:
        "The SEWA Youth Innovation Challenge has been officially launched at Delhi Technological University.",
    },
  });

  console.log("Seeded launch announcement.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());