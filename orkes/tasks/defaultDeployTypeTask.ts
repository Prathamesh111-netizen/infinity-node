import { ConductorWorker } from "@io-orkes/conductor-javascript";
import { addDeployment } from "../../database/projectModel";
import { CICD_WRKF_DEFAULT_DEPLOY_TASK } from "../constants";

export const defaultDeployTypeTask: ConductorWorker = {
  taskDefName: CICD_WRKF_DEFAULT_DEPLOY_TASK,
  execute: async ({ inputData }) => {
    if (!inputData)
      throw new Error("Input data is required");

    const { projectId, deploymentId } = inputData;

    await addDeployment(projectId, {
      deploymentId,
      deploymentType: "Deploy",
      deploymentStatus: 'Failed',
      deploymentLogs: "Deployment type not supported",
    });

    return {
      status: "COMPLETED",
    };
  },
};