import { ConductorWorker } from "@io-orkes/conductor-javascript";
import { CICD_WRKF_TYPECHECK_TASK, deploymentTypes } from "../constants";
import { promisify } from "util";
import { exec } from "child_process";
import { addDeployment } from "../../database/projectModel";

export const checkDeploymentType: ConductorWorker = {
    taskDefName: CICD_WRKF_TYPECHECK_TASK,
    execute: async ({ inputData }) => {
        if (!inputData)
            throw new Error("Input data is required");

        const { projectId, deploymentId, githubLink } = inputData;
        console.log("Checking the deployment type", JSON.stringify(inputData));

        // Do your work here
        var bashLinkCommand = `bash typeOfDeployment.sh -r ${githubLink} -d ${projectId + deploymentId}`;

        // Do your work here
        const commander = promisify(exec);
        const { stdout, stderr } = await commander(bashLinkCommand);

        await addDeployment(projectId, {
            deploymentId,
            deploymentType: "TYPECHECK",
            deploymentStatus: 'Success',
            deploymentLogs: stdout + '\n' + stderr
        });

        var type = deploymentTypes.NONE;
        if (stdout.includes(deploymentTypes.DOCKERFILE)) {
            type = deploymentTypes.DOCKERFILE;
        }
        if (stdout.includes(deploymentTypes.DOCKER_COMPOSE)) {
            type = deploymentTypes.DOCKER_COMPOSE;
        }

        return {
            outputData: {
                message: "Downloaded / Pulled the repository to EC2",
                type,
            },
            status: "COMPLETED",
        };
    },
};