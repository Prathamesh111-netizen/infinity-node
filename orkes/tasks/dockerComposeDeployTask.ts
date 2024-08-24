import { ConductorWorker } from "@io-orkes/conductor-javascript";
import { addDeployment } from "../../database/projectModel";
import { CICD_WRKF_DOCKERCOMPOSE_TASK } from "../constants";

export const dockerComposeDeployTask: ConductorWorker = {
    taskDefName: CICD_WRKF_DOCKERCOMPOSE_TASK,
    execute: async ({ inputData }) => {
        if (!inputData)
            throw new Error("Input data is required");

        const { projectId, deploymentId } = inputData;

        await addDeployment(projectId, {
            deploymentId,
            deploymentType: "Deploy",
            deploymentStatus: 'Success',
            deploymentLogs: "Deployed with dockerCompose",
        });

        return {
            outputData: {
                message: "Deployed with dockerCompose",
            },
            status: "COMPLETED",
        };
    },
};