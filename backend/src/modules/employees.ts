import { Router, Request, Response } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

const employeeSchema = z.object({
  employeeCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfJoining: z.string(),
  departmentId: z.string(),
  designation: z.string(),
  managerId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

router.get("/", requireAuth, async (_req: Request, res: Response) => {
  const employees = await prisma.employee.findMany({ include: { department: true } });
  res.json({ employees });
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
  if (!employee) return res.status(404).json({ error: "not_found" });
  res.json({ employee });
});

router.post("/", requireAuth, requireRole("ADMIN", "HR"), async (req: Request, res: Response) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employee = await prisma.employee.create({ data: parsed.data });
  res.status(201).json({ employee });
});

router.put("/:id", requireAuth, requireRole("ADMIN", "HR"), async (req: Request, res: Response) => {
  const parsed = employeeSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employee = await prisma.employee.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ employee });
});

router.delete("/:id", requireAuth, requireRole("ADMIN", "HR"), async (req: Request, res: Response) => {
  await prisma.employee.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
