import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import GithubActionsRouter from "./api/github-actions";
import userRouter from "./api/user";
import projectRouter from "./api/project";
import patRouter from "./api/pat";
import MainWorkflow from "./orkes/main";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req: Request, res: Response) => {
  return res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/pat", patRouter);

app.use("/api/github", GithubActionsRouter);
 
app.use("/api/orkes", async (req: Request, res: Response) => {
  await MainWorkflow();
  return res.send("Orkes workflow started");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Route does not exist " + req.url,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});