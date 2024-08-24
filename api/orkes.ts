import { Router } from 'express';
import { startCICDWorkflow, startTestWorkflow } from '../orkes/main';
import { getProjectById } from '../database/projectModel';

const router = Router();

router.get('/container-stats/:projectId', async (req, res) => {
    try {
        // get the stats of the project
    }
    catch (e) {
        return res.status(400).json(
            {
                message: 'Invalid username or password',
                status: false,
                data: null
            }
        );
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        // get the status of the project
        const projectId = req.params.projectId;
        const project = await getProjectById(projectId);
        if (!project) {
            return res.send({
                message: 'Project not found',
                status: false,
                data: null
            });
        }

        return res.send({
            message: 'Project found',
            status: true,
            data: project
        });
    }
    catch (e) {
        return res.send({
            message: 'Invalid username or password',
            status: false,
            data: null
        })
    }
});

router.post('/:projectId', async (req, res) => {
    try {
        // start the orkes workflow
        const projectId = req.params.projectId;
        await startCICDWorkflow(projectId);
        // await startTestWorkflow();
        return res.send({
            message: 'Orkes workflow started',
            status: true,
            data: null
        });
    }
    catch (e) {
        console.log(e);
        return res.send({
            message: 'Error starting the workflow' + e,
            status: false,
            data: null
        })
    }
});

export default router;