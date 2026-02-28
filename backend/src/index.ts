import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./modules/auth";
import employeesRouter from "./modules/employees";
import departmentsRouter from "./modules/departments";
import leavesRouter from "./modules/leaves";
import attendanceRouter from "./modules/attendance";
import activityLogRouter from "./modules/activity-log";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*", credentials: true }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/leaves", leavesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/activity-logs", activityLogRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`EMS backend listening on port ${port}`);
});
