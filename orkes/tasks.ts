import { ConductorWorker, Task } from "@io-orkes/conductor-javascript";
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import { addDeployment, getProjectById } from "./../database/projectModel";
import { CICD_WRKF_BUILD_TASK, CICD_WRKF_DEPLOY_TASK, CICD_WRKF_DOWNLOAD_TASK } from "./constants";

export const buildtheRepo: ConductorWorker = {
  taskDefName: CICD_WRKF_BUILD_TASK,
  execute: async ({ inputData }) => {
    console.log("Build the repository", JSON.stringify(inputData));
    // if (!inputData)
    //   throw new Error("Input data is required");

    // const { projectId, deploymentId } = inputData;

    // const project = await getProjectById(projectId);
    // if (!project)
    //   throw new Error("Project not found");

    // const { githubLink } = project;

    // var bashBuildCommand = `bash buildtheRepo.sh -r ${githubLink}`;

    // // Do your work here
    // const commander = promisify(exec);
    // const { stdout, stderr } = await commander(bashBuildCommand);

    // await addDeployment(projectId, {
    //   deploymentId,
    //   deploymentType: "Build",
    //   deploymentStatus: 'Success',
    //   deploymentLogs: stdout + '\n' + stderr
    // });

    return {
      outputData: {
        message: "Build the repository",
      },
      status: "COMPLETED",
    };
  },
};

export const deploytheRepo: ConductorWorker = {
  taskDefName: CICD_WRKF_DEPLOY_TASK,
  execute: async ({ inputData }) => {
    // if (!inputData)
    //   throw new Error("Input data is required");

    // const { projectId, deploymentId } = inputData;

    // const project = await getProjectById(projectId);
    // if (!project)
    //   throw new Error("Project not found");

    // const { githubLink } = project;

    // var bashDeployCommand = `bash deploytheRepo.sh -r ${githubLink}`;

    // // Do your work here
    // const commander = promisify(exec);
    // const { stdout, stderr } = await commander(bashDeployCommand);

    // await addDeployment(projectId, {
    //   deploymentId,
    //   deploymentType: "Deploy",
    //   deploymentStatus: 'Success',
    //   deploymentLogs: stdout + '\n' + stderr
    // });

    return {
      switchCaseValue: "",
      outputData: {
        message: "Deploy the repository",
      },
      status: "COMPLETED",
    };
  },
};

// switch case task
