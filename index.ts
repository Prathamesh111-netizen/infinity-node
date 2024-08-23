import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import GithubActionsRouter from "./api/github-actions";
import userRouter from "./api/user";
import projectRouter from "./api/project";
import patRouter from "./api/pat";
import MainWorkflow from "./orkes/main";
import { Database } from "./database/db";
import { authMiddleware } from "./auth";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req: Request, res: Response) => {
  return res.send("Hello World");
});

app.post("/api/orkes/:projectId", async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  console.log("Project ID: ", projectId);
  await MainWorkflow(projectId);
  return res.send("Orkes workflow started");
});

app.use("/api/user", userRouter);
app.use("/api/project", authMiddleware, projectRouter);
app.use("/api/pat", authMiddleware, patRouter);
app.use("/api/github", GithubActionsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Route does not exist " + req.url,
    data: null,
  });
});

app.listen(port, () => {
  Database.getInstance();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});