import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import type { AuthUser } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const checkSchema = z.object({
  employeeId: z.string(),
  date: z.string()
});

router.post("/check-in", requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const record = await prisma.attendance.create({ data: { ...parsed.data, checkInTime: new Date().toISOString() } });
  res.status(201).json({ record });
}));

router.post("/check-out", requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const record = await prisma.attendance.updateMany({
    where: { employeeId: parsed.data.employeeId, date: parsed.data.date },
    data: { checkOutTime: new Date().toISOString() }
  });
  res.json({ updated: record.count });
}));

router.get("/my", requireAuth, asyncHandler(async (req: Request & { user?: AuthUser }, res: Response) => {
  const employeeId = req.user!.id;
  const records = await prisma.attendance.findMany({ where: { employeeId } });
  res.json({ records });
}));

export default router;
