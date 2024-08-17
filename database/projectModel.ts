import mongoose from "mongoose";
import { updateProject, createProject as createProjectMetaInUserModel, deleteProject as deleteProjectMetaInUserModel } from "./userModel";

interface Project {
    projectName: string;
    projectDescription: string;
    ownerId: string;
    githubLink: string;
    patAttached: string;
    vmAttached: string;
}

const projectSchema = new mongoose.Schema<Project>({
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    ownerId: { type: String, required: true },
    githubLink: { type: String, required: false },
    patAttached: { type: String, required: false },
    vmAttached: { type: String, required: false },
});

const ProjectModel = mongoose.model<Project>("Project", projectSchema);

export { ProjectModel };

// get project by id
export const getProjectById = async (projectId: string) => {
    return ProjectModel.findById(projectId);
}


// create project
export const createProject = async (project: Project) => {
    const newProject = new ProjectModel(project);
    await newProject.save();

    createProjectMetaInUserModel(project.ownerId, {
        _id: (newProject._id as unknown) as string,
        name: newProject.projectName,
        desc: newProject.projectDescription,
    });
    return newProject;
};

// update project
export const updateProjectInProjectModel = async (projectId: string, project: Project) => {
    await ProjectModel.findOneAndUpdate(
        { _id: projectId },
        {
            projectName: project.projectName,
            projectDescription: project.projectDescription,
            githubLink: project.githubLink,
            patAttached: project.patAttached,
            vmAttached: project.vmAttached,
        },
        { new: true }
    );

    return updateProject(project.ownerId, {
        _id: projectId,
        name: project.projectName,
        desc: project.projectDescription,
    });
};


// delete project
export const deleteProject = async (projectId: string, ownerId: string) => {
    await ProjectModel.deleteOne({ _id: projectId });
    return deleteProjectMetaInUserModel(
        ownerId,
        {
            _id: projectId,
        }
    );
};

