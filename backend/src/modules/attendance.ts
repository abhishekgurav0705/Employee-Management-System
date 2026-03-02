import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import type { AuthUser } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const checkSchema = z.object({
  employeeId: z.string().optional(),
  date: z.string().optional()
});

async function resolveEmployeeIdFromUser(req: Request & { user?: AuthUser }) {
  const userId = req.user!.id;
  let emp = await prisma.employee.findFirst({ where: { userId } });
  if (!emp && req.user?.email) {
    emp = await prisma.employee.findFirst({ where: { email: req.user.email } });
  }
  return emp?.id;
}

router.post("/check-in", requireAuth, asyncHandler(async (req: Request & { user?: AuthUser }, res: Response) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employeeId = (await resolveEmployeeIdFromUser(req)) ?? parsed.data.employeeId;
  if (!employeeId) return res.status(404).json({ error: "no_employee_link" });
  const date = parsed.data.date ?? new Date().toISOString();
  const record = await prisma.attendance.create({ data: { employeeId, date, checkInTime: new Date().toISOString() } });
  res.status(201).json({ record });
}));

router.post("/check-out", requireAuth, asyncHandler(async (req: Request & { user?: AuthUser }, res: Response) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employeeId = (await resolveEmployeeIdFromUser(req)) ?? parsed.data.employeeId;
  if (!employeeId) return res.status(404).json({ error: "no_employee_link" });
  const date = parsed.data.date ?? new Date().toISOString();
  const record = await prisma.attendance.updateMany({
    where: { employeeId, date },
    data: { checkOutTime: new Date().toISOString() }
  });
  res.json({ updated: record.count });
}));

router.get("/my", requireAuth, asyncHandler(async (req: Request & { user?: AuthUser }, res: Response) => {
  const employeeId = await resolveEmployeeIdFromUser(req);
  if (!employeeId) return res.json({ records: [] });
  const records = await prisma.attendance.findMany({ where: { employeeId } });
  res.json({ records });
}));

export default router;
