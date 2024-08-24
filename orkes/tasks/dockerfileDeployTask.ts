import { ConductorWorker } from "@io-orkes/conductor-javascript";
import { addDeployment, updateExternalPorts } from "../../database/projectModel";
import { CICD_WRKF_DOCKERFILE_TASK } from "../constants";
import { promisify } from "util";
import { exec } from "child_process";

export const dockerfileDeployTask: ConductorWorker = {
    taskDefName: CICD_WRKF_DOCKERFILE_TASK,
    execute: async ({ inputData }) => {
        if (!inputData)
            throw new Error("Input data is required");

        const { projectId, deploymentId, githubLink } = inputData;

        var bashLinkCommand = `bash buildandDeployFromDockerFile.sh -r ${githubLink}`;
        bashLinkCommand += ` -d ${projectId + deploymentId}`;

        // Do your work here
        const commander = promisify(exec);
        const { stdout, stderr } = await commander(bashLinkCommand);

        console.log(stdout);
        // last line of the bash script should be the port number as comma separated values
        var ports: string[] = [];
        const lines = stdout.split('\n');
        console.log({lines});
        if (lines.length > 1){
            lines.pop();
            ports = lines[lines.length - 1].split(',');
            ports.pop();
        }
        console.log({ports});

        await updateExternalPorts(projectId, ports);

        await addDeployment(projectId, {
            deploymentId,
            deploymentType: "Deploy",
            deploymentStatus: 'Success',
            deploymentLogs: stdout + '\n' + stderr,
        });

        return {
            outputData: {
                message: "Deployed with dockerfile",
            },
            status: "COMPLETED",
        };
    },
};