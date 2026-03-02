import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin seed");
    return;
  }

  const prisma = new PrismaClient();
  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", passwordHash },
      create: { email, role: "ADMIN", passwordHash, name: "Admin" }
    });
    console.log(`Admin user ensured: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
