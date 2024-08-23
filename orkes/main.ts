import { ConductorClient, orkesConductorClient, WorkflowExecutor } from "@io-orkes/conductor-javascript";
import { createTaskRunner } from "./workers/workerUtil";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
dotenv.config();

const CICD_WORKFLOW_NAME = "infinity-cicd";
const CICD_WORKFLOW_VERSION = 1;

const config = {
  keyId: process.env.ORKES_KEY,
  keySecret: process.env.ORKES_SECRET,
  serverUrl: process.env.CONDUCTOR_SERVER_URL,
};

async function runWorkflow({ client, workflowName, workflowVersion, projectId }: {
  client: ConductorClient,
  workflowName: string,
  workflowVersion: number,
  projectId: string
}) {
  const workflowExecutor = new WorkflowExecutor(client);
  return workflowExecutor.executeWorkflow(
    {
      name: workflowName,
      version: workflowVersion,
      input: {
        projectId,
        deploymentId: nanoid(),
      },
    },
    workflowName,
    1,
    "myRequest"
  );
}

async function main(projectId: string) {
  const name = CICD_WORKFLOW_NAME;
  const version = CICD_WORKFLOW_VERSION;
  if (!name || !version) {
    throw new Error("Workflow name or version not provided");
  }
  const client = await orkesConductorClient(config);
  const taskRunner = createTaskRunner(client);
  taskRunner.startPolling();
  await runWorkflow({ client: client, workflowName: name, workflowVersion: Number(version), projectId });
  taskRunner.stopPolling();
}

export default main;
