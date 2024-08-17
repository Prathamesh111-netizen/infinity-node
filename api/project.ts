import { Router } from "express";
import { createProject, getProjectById } from "../database/projectModel";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { projectName, projectDescription, ownerId } = req.body;
        if (!projectName || !projectDescription || !ownerId) {
            return res.status(400).json({
                message: "Invalid request",
                status: false,
                data: null
            });
        }

        // create project
        const newProject = await createProject({
            projectName,
            projectDescription,
            ownerId,
            githubLink: "",
            patAttached: "",
            vmAttached: ""
        });

        if (!newProject) {
            return res.status(500).json({
                message: "Internal server error",
                status: false,
                data: null
            });
        }

        return res.status(201).json({
            message: "Project created",
            status: true,
            data: newProject
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            status: false,
            data: null
        });
    }
});

router.get("/:projectId", async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await getProjectById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                status: false,
                data: null
            });
        }
        return res.status(200).json({
            message: "Project found",
            status: true,
            data: project
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            status: false,
            data: null
        });
    }
});

router.delete("/:projectId", (req, res) => {
    res.send("Delete project");
});

router.put("/:projectId", (req, res) => {
    res.send("Update project");
});

export default router;