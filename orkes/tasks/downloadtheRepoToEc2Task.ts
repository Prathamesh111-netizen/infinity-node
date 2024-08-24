import { ConductorWorker } from "@io-orkes/conductor-javascript";
import { exec } from 'child_process';
import { promisify } from 'util';
import { addDeployment, getProjectById } from "../../database/projectModel";
import { CICD_WRKF_DOWNLOAD_TASK } from "../constants";

export const downloadtheRepoToEc2: ConductorWorker = {
  taskDefName: CICD_WRKF_DOWNLOAD_TASK,
  execute: async ({ inputData }) => {
    console.log("Download the repository to EC2", JSON.stringify(inputData));
    if (!inputData)
      throw new Error("Input data is required");

    const { projectId, deploymentId } = inputData;

    const project = await getProjectById(projectId);
    if (!project)
      throw new Error("Project not found");

    const { githubLink, patAttached } = project;

    var bashLinkCommand = `bash downloadtheRepoToEc2.sh -r ${githubLink}`;
    if (patAttached)
      bashLinkCommand += ` -t ${patAttached}`;
    bashLinkCommand += ` -d ${projectId + deploymentId}`;

    // Do your work here
    const commander = promisify(exec);
    const { stdout, stderr } = await commander(bashLinkCommand);

    await addDeployment(projectId, {
      deploymentId,
      deploymentType: "Source",
      deploymentStatus: 'Success',
      deploymentLogs: stdout + '\n' + stderr
    });

    return {
      outputData: {
        message: "Downloaded / Pulled the repository to EC2",
        githubLink,
      },
      status: "COMPLETED",
    };
  },
};