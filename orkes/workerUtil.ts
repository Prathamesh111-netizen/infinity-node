import { ConductorClient, ConductorWorker, TaskManager } from "@io-orkes/conductor-javascript";
import { checkDeploymentType } from "./tasks/checkDeploymentTypeTask";
import { defaultDeployTypeTask } from "./tasks/defaultDeployTypeTask";
import { downloadtheRepoToEc2 } from "./tasks/downloadtheRepoToEc2Task";
import { dockerComposeDeployTask } from "./tasks/dockerComposeDeployTask";
import { dockerfileDeployTask } from "./tasks/dockerfileDeployTask";

function createTaskRunner(conductorClient: ConductorClient) {

  const workes: ConductorWorker[] = [downloadtheRepoToEc2, checkDeploymentType, defaultDeployTypeTask, dockerComposeDeployTask, dockerfileDeployTask];

  const taskRunner = new TaskManager(conductorClient, workes, {
    logger: console,
    options: { pollInterval: 100, concurrency: 1 },
  });
  return taskRunner;
}

export { createTaskRunner };
