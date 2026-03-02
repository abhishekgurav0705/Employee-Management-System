import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const departmentSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

router.get("/", requireAuth, asyncHandler(async (_req: Request, res: Response) => {
  const departments = await prisma.department.findMany();
  res.json({ departments });
}));

router.post("/", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (req: Request, res: Response) => {
  const parsed = departmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const department = await prisma.department.create({ data: parsed.data });
  res.status(201).json({ department });
}));

router.put("/:id", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (req: Request, res: Response) => {
  const parsed = departmentSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  const department = await prisma.department.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ department });
}));

router.delete("/:id", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (req: Request, res: Response) => {
  await prisma.department.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

export default router;
