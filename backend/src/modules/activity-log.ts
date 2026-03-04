import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(async (_req: Request, res: Response) => {
  const rows = await prisma.activityLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" } });
  const logs = rows.map((l) => ({
    id: l.id,
    action: l.action,
    timestamp: l.createdAt,
    actor: { name: l.actor.email },
    target: `${l.targetType}:${l.targetId}`,
    metadata: l.metadata ?? null
  }));
  res.json({ logs });
}));

export default router;
