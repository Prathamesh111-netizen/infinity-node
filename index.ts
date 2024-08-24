import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";

import cors from "cors";
import GithubActionsRouter from "./api/github-actions";
import orkesRouter from "./api/orkes";
import patRouter from "./api/pat";
import projectRouter from "./api/project";
import userRouter from "./api/user";
import { authMiddleware } from "./auth";
import { Database } from "./database/db";
import { startManager } from "./orkes/main";

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

app.use("/api/user", userRouter);
app.use("/api/project", authMiddleware, projectRouter);
app.use("/api/pat", authMiddleware, patRouter);
app.use("/api/orkes", orkesRouter);

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
  startManager();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});