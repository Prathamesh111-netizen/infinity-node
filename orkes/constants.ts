export const CICD_WORKFLOW_NAME = "infinity-cicd_final";
export const CICD_WORKFLOW_VERSION = 1;

export const CICD_WRKF_DOWNLOAD_TASK = "task-downloadtheRepoToEc2";
export const CICD_WRKF_TYPECHECK_TASK = "task-checkDeploymentType";
export const CICD_WRKF_TYPEBASED_DEPLOY_TASK = "task-TypeBasedDeployment";

export const CICD_WRKF_DEFAULT_DEPLOY_TASK = "task-defaultDeployType";

export const CICD_WRKF_DOCKERFILE_TASK = "task-deploytheRepowithDockerfile";
export const CICD_WRKF_DOCKERCOMPOSE_TASK = "task-deploytheRepowithDockerCompose";

export const CICD_WRKF_TYPEBASED_DEPLOY_TASK_SWITCH_VALUE = "deploymentType";

export const OWNER_EMAIL = "prathamesh.rjpawar@gmail.com"

export const deploymentTypes = {
   DOCKERFILE: "Dockerfile",
   DOCKER_COMPOSE: "DockerCompose",
   NONE: "none"
};