import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (_req: Request, res: Response) => {
  const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ logs });
}));

export default router;
