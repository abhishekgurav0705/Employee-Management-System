import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectWithRetry(retries = 5, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
}
