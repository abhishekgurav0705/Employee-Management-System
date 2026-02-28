import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/", requireAuth, requireRole("ADMIN", "HR"), async (_req, res) => {
  const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ logs });
});

export default router;
