import { orkesConductorClient, simpleTask, TaskType, WorkflowDef, WorkflowExecutor } from "@io-orkes/conductor-javascript";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { CICD_WORKFLOW_NAME, CICD_WORKFLOW_VERSION, CICD_WRKF_DEFAULT_DEPLOY_TASK, CICD_WRKF_DOCKERCOMPOSE_TASK, CICD_WRKF_DOCKERFILE_TASK, CICD_WRKF_DOWNLOAD_TASK, CICD_WRKF_TYPEBASED_DEPLOY_TASK, CICD_WRKF_TYPEBASED_DEPLOY_TASK_SWITCH_VALUE, CICD_WRKF_TYPECHECK_TASK, OWNER_EMAIL } from "./constants";
import { createTaskRunner } from "./workerUtil";
dotenv.config();

const config = {
  keyId: process.env.ORKES_KEY,
  keySecret: process.env.ORKES_SECRET,
  serverUrl: process.env.CONDUCTOR_SERVER_URL,
};

async function startCICDWorkflow(projectId: string) {
  const client = await orkesConductorClient(config);
  const executor = new WorkflowExecutor(client);

  const inputParameters = {
    projectId,
    deploymentId: nanoid(),
  };

  const cicdWorkflow: WorkflowDef = {
    name: CICD_WORKFLOW_NAME,
    version: CICD_WORKFLOW_VERSION,
    ownerEmail: OWNER_EMAIL,
    tasks: [
      simpleTask(`${CICD_WRKF_DOWNLOAD_TASK}_ref`, CICD_WRKF_DOWNLOAD_TASK, {
        ...inputParameters,
      }),
      simpleTask(`${CICD_WRKF_TYPECHECK_TASK}_ref`, CICD_WRKF_TYPECHECK_TASK, {
        ...inputParameters,
        githubLink: "${task-downloadtheRepoToEc2_ref.output.githubLink}",
      }),
      {
        type: TaskType.SWITCH,
        name: CICD_WRKF_TYPEBASED_DEPLOY_TASK,
        taskReferenceName: `${CICD_WRKF_TYPEBASED_DEPLOY_TASK}_ref`,
        evaluatorType: "value-param",
        expression: CICD_WRKF_TYPEBASED_DEPLOY_TASK_SWITCH_VALUE,
        inputParameters: {
          ...inputParameters,
          githubLink: "${task-downloadtheRepoToEc2_ref.output.githubLink}",
          deploymentType: "${task-checkDeploymentType_ref.output.type}",
        },
        decisionCases: {
          "Dockerfile": [simpleTask(`${CICD_WRKF_DOCKERFILE_TASK}_ref`, CICD_WRKF_DOCKERFILE_TASK, {
            ...inputParameters
          })],
          "DockerCompose": [simpleTask(`${CICD_WRKF_DOCKERCOMPOSE_TASK}_ref`, CICD_WRKF_DOCKERCOMPOSE_TASK, {
            ...inputParameters
          })],
        },
        defaultCase: [
          simpleTask(`${CICD_WRKF_DEFAULT_DEPLOY_TASK}_ref`, CICD_WRKF_DEFAULT_DEPLOY_TASK, {
            ...inputParameters,
          })
        ],
      },
    ],
    inputParameters: [],
    outputParameters: {},
    timeoutSeconds: 0,
  };

  // Register workflow
  await executor.registerWorkflow(true, cicdWorkflow);

  // Start Workflow
  const executionId = await executor.startWorkflow({
    name: cicdWorkflow.name,
    version: 1,
    input: {},
  });

  // Query Workflow status
  const workflowStatus = await executor.getWorkflow(executionId, true);

  console.log("Workflow Status: ", workflowStatus);
}

async function startTestWorkflow() {
  const client = await orkesConductorClient(config);
  const executor = new WorkflowExecutor(client);

  const inputParameters = {
    projectId: nanoid(),
    deploymentId: nanoid(),
  };

  const cicdWorkflow: WorkflowDef = {
    name: CICD_WORKFLOW_NAME,
    version: CICD_WORKFLOW_VERSION,
    ownerEmail: OWNER_EMAIL,
    tasks: [
      simpleTask(`${CICD_WRKF_DOWNLOAD_TASK}_ref`, CICD_WRKF_DOWNLOAD_TASK, {
        ...inputParameters,
      }),
      simpleTask(`${CICD_WRKF_TYPECHECK_TASK}_ref`, CICD_WRKF_TYPECHECK_TASK, {
        ...inputParameters,
        githubLink: "${task-downloadtheRepoToEc2_ref.output.githubLink}",
      }),
      {
        type: TaskType.SWITCH,
        name: CICD_WRKF_TYPEBASED_DEPLOY_TASK,
        taskReferenceName: `${CICD_WRKF_TYPEBASED_DEPLOY_TASK}_ref`,
        evaluatorType: "value-param",
        expression: CICD_WRKF_TYPEBASED_DEPLOY_TASK_SWITCH_VALUE,
        inputParameters: {
          ...inputParameters,
          githubLink: "${task-downloadtheRepoToEc2_ref.output.githubLink}",
          deploymentType: "${task-checkDeploymentType_ref.output.type}",
        },
        decisionCases: {
          "Dockerfile": [simpleTask(`${CICD_WRKF_DOCKERFILE_TASK}_ref`, CICD_WRKF_DOCKERFILE_TASK, {
            ...inputParameters
          })],
          "DockerCompose": [simpleTask(`${CICD_WRKF_DOCKERCOMPOSE_TASK}_ref`, CICD_WRKF_DOCKERCOMPOSE_TASK, {
            ...inputParameters
          })],
        },
        defaultCase: [
          simpleTask(`${CICD_WRKF_DEFAULT_DEPLOY_TASK}_ref`, CICD_WRKF_DEFAULT_DEPLOY_TASK, {
            ...inputParameters,
          })
        ],
      },
    ],
    inputParameters: [],
    outputParameters: {},
    timeoutSeconds: 0,
  };


  // Register workflow
  await executor.registerWorkflow(true, cicdWorkflow);

  // Start Workflow
  const executionId = await executor.startWorkflow({
    name: cicdWorkflow.name,
    version: 1,
    input: {},
  });

  // Query Workflow status
  const workflowStatus = await executor.getWorkflow(executionId, true);

  console.log("Workflow Status: ", workflowStatus);
}

async function startManager() {
  const client = await orkesConductorClient(config);
  const manager = createTaskRunner(client);
  manager.startPolling();
}

export {
  startCICDWorkflow,
  startManager, startTestWorkflow
};

