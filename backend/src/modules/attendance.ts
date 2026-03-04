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
  const empExists = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!empExists) return res.status(404).json({ error: "no_employee_link" });
  const dayStr = (parsed.data.date ? new Date(parsed.data.date) : new Date()).toISOString().slice(0, 10);
  const day = new Date(`${dayStr}T00:00:00.000Z`);
  const now = new Date();
  const record = await prisma.attendance.create({ data: { employeeId, date: day, checkInTime: now } });
  await prisma.activityLog.create({
    data: {
      actorUserId: req.user!.id,
      action: "CHECK_IN",
      targetType: "ATTENDANCE",
      targetId: record.id
    }
  });
  res.status(201).json({ record });
}));

router.post("/check-out", requireAuth, asyncHandler(async (req: Request & { user?: AuthUser }, res: Response) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employeeId = (await resolveEmployeeIdFromUser(req)) ?? parsed.data.employeeId;
  if (!employeeId) return res.status(404).json({ error: "no_employee_link" });
  const empExists = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!empExists) return res.status(404).json({ error: "no_employee_link" });
  const dayStr = (parsed.data.date ? new Date(parsed.data.date) : new Date()).toISOString().slice(0, 10);
  const day = new Date(`${dayStr}T00:00:00.000Z`);
  const existing = await prisma.attendance.findFirst({ where: { employeeId, date: day } });
  if (!existing) {
    // If no check-in exists for the day, create and set check-out to now
    const created = await prisma.attendance.create({ data: { employeeId, date: day, checkOutTime: new Date() } });
    await prisma.activityLog.create({
      data: { actorUserId: req.user!.id, action: "CHECK_OUT", targetType: "ATTENDANCE", targetId: created.id }
    });
    return res.json({ updated: 1 });
  }
  const updated = await prisma.attendance.update({ where: { id: existing.id }, data: { checkOutTime: new Date() } });
  await prisma.activityLog.create({
    data: { actorUserId: req.user!.id, action: "CHECK_OUT", targetType: "ATTENDANCE", targetId: updated.id }
  });
  res.json({ updated: 1 });
}));

router.get("/my", requireAuth, asyncHandler(async (req: Request & { user?: AuthUser }, res: Response) => {
  const employeeId = await resolveEmployeeIdFromUser(req);
  if (!employeeId) return res.json({ records: [] });
  const records = await prisma.attendance.findMany({ where: { employeeId }, orderBy: { date: "desc" } });
  res.json({ records });
}));

export default router;
