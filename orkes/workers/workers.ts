import { ConductorWorker, Task } from "@io-orkes/conductor-javascript";
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import { addDeployment, getProjectById } from "../../database/projectModel";

export const downloadtheRepoToEc2: ConductorWorker = {
  taskDefName: "task-downloadtheRepoToEc2",
  execute: async ({ inputData }) => {
    if (!inputData)
      throw new Error("Input data is required");
    const { projectId, deploymentId } = inputData;

    const project = await getProjectById(projectId);
    if (!project)
      throw new Error("Project not found");

    console.log("Project: ", project);

    // Do your work here
    const commander = promisify(exec);
    const { stdout, stderr } = await commander(`bash downloadtheRepoToEc2.sh ${project.githubLink}`);

    // write the stdout and stderr to the file
    fs.writeFileSync('output.txt', stdout + '\n' + stderr);

    // console.log("Output: ", stdout, stderr);
    await addDeployment(projectId, {
      deploymentId: "2",
      deploymentType: "Build",
      deploymentStatus: 'Success',
      deploymentLogs: stdout + '\n' + stderr
    });

    return {
      outputData: {
        hello: "From your worker task-downloadtheRepoToEc2" + inputData,
      },
      status: "COMPLETED",
    };
  },
};