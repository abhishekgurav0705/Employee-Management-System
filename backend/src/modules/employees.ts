import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireAuth, requireRole } from "../middleware/auth";
import { prisma } from "../db";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const employeeSchema = z.object({
  employeeCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  dateOfJoining: z.string(),
  departmentId: z.string(),
  designation: z.string(),
  managerId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  role: z.enum(["ADMIN", "HR", "MANAGER", "EMPLOYEE"]).optional()
});

router.get("/", requireAuth, asyncHandler(async (_req: Request, res: Response) => {
  const employees = await prisma.employee.findMany({ include: { department: true, user: true } });
  res.json({ employees });
}));

router.get("/:id", requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const employee = await prisma.employee.findUnique({ 
    where: { id: req.params.id },
    include: { user: true }
  });
  if (!employee) return res.status(404).json({ error: "not_found" });
  res.json({ employee });
}));

router.post("/", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (req: Request, res: Response) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  
  const { password, role, ...employeeData } = parsed.data;
  
  // Create User first if we want them to login
  const passwordHash = bcrypt.hashSync(password || "Password123!", 10);
  
  const employee = await prisma.employee.create({
    data: {
      employeeCode: employeeData.employeeCode,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      phone: employeeData.phone,
      dateOfJoining: new Date(employeeData.dateOfJoining),
      designation: employeeData.designation,
      managerId: employeeData.managerId,
      status: employeeData.status,
      department: {
        connect: { id: employeeData.departmentId }
      },
      user: {
        create: {
          email: employeeData.email,
          passwordHash,
          role: role || "EMPLOYEE"
        }
      }
    } as any,
    include: { user: true, department: true }
  });
  
  res.status(201).json({ employee });
}));

router.put("/:id", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (req: Request, res: Response) => {
  const parsed = employeeSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const employee = await prisma.employee.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ employee });
}));

router.delete("/:id", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (req: Request, res: Response) => {
  await prisma.employee.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

export default router;
