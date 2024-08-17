import { Router } from 'express';
import { createUser, login } from '../database/userModel';
import { WebResponse } from '../types/webResponse';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await login(username, password);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const successResponse: WebResponse = {
            message: 'Logged in successfully',
            data: {
                user
            },
            status: true
        }
        return res.status(200).json(successResponse);
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

router.post('/register', async (req, res) => {
    // register logic
    try {
        const { username, password } = req.body;
        const user = await createUser(username, password);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const successResponse: WebResponse = {
            message: 'User registered successfully',
            data: {
                user
            },
            status: true
        }
        return res.status(200).json(successResponse);

    } catch (e) {
        return res.status(400).json(
            {
                message: 'Invalid username or password',
                status: false,
                data: null
            }
        );
    }

});

export default router;