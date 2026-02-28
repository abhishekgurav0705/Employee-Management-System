import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

const checkSchema = z.object({
  employeeId: z.string(),
  date: z.string()
});

router.post("/check-in", requireAuth, async (req, res) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const record = await prisma.attendance.create({ data: { ...parsed.data, checkInTime: new Date().toISOString() } });
  res.status(201).json({ record });
});

router.post("/check-out", requireAuth, async (req, res) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const record = await prisma.attendance.updateMany({
    where: { employeeId: parsed.data.employeeId, date: parsed.data.date },
    data: { checkOutTime: new Date().toISOString() }
  });
  res.json({ updated: record.count });
});

router.get("/my", requireAuth, async (req: any, res) => {
  const employeeId = req.user.id;
  const records = await prisma.attendance.findMany({ where: { employeeId } });
  res.json({ records });
});

export default router;
