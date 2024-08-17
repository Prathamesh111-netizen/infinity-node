import { ConductorClient, TaskManager } from "@io-orkes/conductor-javascript";
import { downloadtheRepoToEc2 } from "./workers";

function createTaskRunner(conductorClient: ConductorClient) {
  const taskRunner = new TaskManager(conductorClient, [downloadtheRepoToEc2], {
    logger: console,
    options: { pollInterval: 100, concurrency: 1 },
  });
  return taskRunner;
}

export { createTaskRunner };