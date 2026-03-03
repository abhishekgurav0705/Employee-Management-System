import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Accept either (employeeId + leaveTypeId) or infer from auth and type name
const createSchema = z.object({
  employeeId: z.string().optional(),
  leaveTypeId: z.string().optional(),
  type: z.string().optional(), // e.g., "ANNUAL" | "SICK" | "UNPAID" | "OTHER"
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional()
});

async function resolveEmployeeId(req: Request & { user?: { id: string; email?: string } }, provided?: string) {
  if (provided) return provided;
  if (!req.user?.id) return null;
  let employee = await prisma.employee.findFirst({ where: { userId: req.user.id } });
  if (!employee && req.user.email) {
    employee = await prisma.employee.findFirst({ where: { email: req.user.email } });
  }
  return employee?.id ?? null;
}

async function resolveLeaveTypeId(type?: string, providedId?: string) {
  if (providedId) return providedId;
  const nameMap: Record<string, string> = {
    ANNUAL: "Annual",
    SICK: "Sick",
    UNPAID: "Unpaid",
    OTHER: "Other"
  };
  const targetName = type ? (nameMap[type.toUpperCase()] ?? type) : "Annual";
  let lt = await prisma.leaveType.findFirst({ where: { name: { equals: targetName, mode: "insensitive" } } });
  if (!lt) {
    lt = await prisma.leaveType.create({ data: { name: targetName } });
  }
  return lt.id;
}

router.post("/", requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employeeId = await resolveEmployeeId(req as any, parsed.data.employeeId);
  if (!employeeId) return res.status(404).json({ error: "no_employee_link" });
  const leaveTypeId = await resolveLeaveTypeId(parsed.data.type, parsed.data.leaveTypeId);
  const request = await prisma.leaveRequest.create({ 
    data: { 
      employeeId,
      leaveTypeId,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      reason: parsed.data.reason,
      status: "PENDING" 
    } 
  });
  res.status(201).json({ request });
}));

router.get("/my", requireAuth, asyncHandler(async (req: Request & { user?: { id: string } }, res: Response) => {
  const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
  if (!employee) return res.json({ requests: [] });
  const requests = await prisma.leaveRequest.findMany({ where: { employeeId: employee.id }, include: { leaveType: true } });
  res.json({ requests });
}));

router.get("/pending", requireAuth, requireRole("ADMIN", "HR", "MANAGER"), asyncHandler(async (_req: Request, res: Response) => {
  const rows = await prisma.leaveRequest.findMany({ 
    where: { status: "PENDING" }, 
    include: { leaveType: true, employee: true }
  });
  // Shape data to match frontend expectations
  const requests = rows.map((r) => ({
    ...r,
    type: r.leaveType?.name ?? "ANNUAL",
    employee: r.employee ? {
      id: r.employee.id,
      name: `${r.employee.firstName} ${r.employee.lastName}`.trim(),
      email: r.employee.email
    } : null
  }));
  res.json({ requests });
}));

router.patch("/:id/approve", requireAuth, requireRole("ADMIN", "HR", "MANAGER"), asyncHandler(async (req: Request & { user?: { id: string; email?: string } }, res: Response) => {
  let approver = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
  if (!approver && req.user?.email) {
    approver = await prisma.employee.findFirst({ where: { email: req.user.email } });
  }
  const request = await prisma.leaveRequest.update({ 
    where: { id: req.params.id }, 
    data: { status: "APPROVED", approvedByEmployeeId: approver?.id ?? null },
    include: { leaveType: true, employee: true }
  });
  res.json({ request: {
    ...request,
    type: request.leaveType?.name ?? "ANNUAL",
    employee: request.employee ? {
      id: request.employee.id,
      name: `${request.employee.firstName} ${request.employee.lastName}`.trim(),
      email: request.employee.email
    } : null
  }});
}));

router.patch("/:id/reject", requireAuth, requireRole("ADMIN", "HR", "MANAGER"), asyncHandler(async (req: Request & { user?: { id: string; email?: string } }, res: Response) => {
  let approver = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
  if (!approver && req.user?.email) {
    approver = await prisma.employee.findFirst({ where: { email: req.user.email } });
  }
  const request = await prisma.leaveRequest.update({ 
    where: { id: req.params.id }, 
    data: { status: "REJECTED", approvedByEmployeeId: approver?.id ?? null },
    include: { leaveType: true, employee: true }
  });
  res.json({ request: {
    ...request,
    type: request.leaveType?.name ?? "ANNUAL",
    employee: request.employee ? {
      id: request.employee.id,
      name: `${request.employee.firstName} ${request.employee.lastName}`.trim(),
      email: request.employee.email
    } : null
  }});
}));

export default router;
