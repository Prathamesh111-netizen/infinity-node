import { ConductorWorker } from "@io-orkes/conductor-javascript";
import { addDeployment } from "../../database/projectModel";
import { CICD_WRKF_DOCKERFILE_TASK } from "../constants";

export const dockerfileDeployTask: ConductorWorker = {
    taskDefName: CICD_WRKF_DOCKERFILE_TASK,
    execute: async ({ inputData }) => {
        if (!inputData)
            throw new Error("Input data is required");

        const { projectId, deploymentId } = inputData;

        await addDeployment(projectId, {
            deploymentId,
            deploymentType: "Deploy",
            deploymentStatus: 'Success',
            deploymentLogs: "Deployed with dockerfile",
        });

        return {
            outputData: {
                message: "Deployed with dockerfile",
            },
            status: "COMPLETED",
        };
    },
};