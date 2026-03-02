import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./modules/auth";
import employeesRouter from "./modules/employees";
import departmentsRouter from "./modules/departments";
import leavesRouter from "./modules/leaves";
import attendanceRouter from "./modules/attendance";
import activityLogRouter from "./modules/activity-log";
import { connectWithRetry } from "./db";

dotenv.config();

const app = express();
app.use(express.json());
const corsOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true, // reflect request origin when not explicitly set
    credentials: true
  })
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/leaves", leavesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/activity-logs", activityLogRouter);

// Global error handler to avoid crashing the process on unhandled async errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "internal_error" });
});

const port = process.env.PORT || 8080;
connectWithRetry()
  .then(() => {
    app.listen(port, () => {
      console.log(`EMS backend listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
