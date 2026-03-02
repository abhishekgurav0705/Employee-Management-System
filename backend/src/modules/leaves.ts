import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const createSchema = z.object({
  employeeId: z.string(),
  leaveTypeId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional()
});

router.post("/", requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const request = await prisma.leaveRequest.create({ data: { ...parsed.data, status: "PENDING" } });
  res.status(201).json({ request });
}));

router.get("/my", requireAuth, asyncHandler(async (req: Request & { user?: { id: string } }, res: Response) => {
  const employeeId = req.user!.id;
  const requests = await prisma.leaveRequest.findMany({ where: { employeeId }, include: { leaveType: true } });
  res.json({ requests });
}));

router.get("/pending", requireAuth, requireRole("ADMIN", "HR", "MANAGER"), asyncHandler(async (_req: Request, res: Response) => {
  const requests = await prisma.leaveRequest.findMany({ where: { status: "PENDING" }, include: { leaveType: true } });
  res.json({ requests });
}));

router.patch("/:id/approve", requireAuth, requireRole("ADMIN", "HR", "MANAGER"), asyncHandler(async (req: Request & { user?: { id: string } }, res: Response) => {
  const request = await prisma.leaveRequest.update({ where: { id: req.params.id }, data: { status: "APPROVED", approvedByEmployeeId: req.user!.id } });
  res.json({ request });
}));

router.patch("/:id/reject", requireAuth, requireRole("ADMIN", "HR", "MANAGER"), asyncHandler(async (req: Request & { user?: { id: string } }, res: Response) => {
  const request = await prisma.leaveRequest.update({ where: { id: req.params.id }, data: { status: "REJECTED", approvedByEmployeeId: req.user!.id } });
  res.json({ request });
}));

export default router;
