import { Router } from 'express';
import { createUser, getUser, login } from '../database/userModel';
import { WebResponse } from '../types/webResponse';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await login(username, password);
        console.log({user});
        if (!user) {
            throw new Error('Invalid username or password');
        }
        // return a jwt token
        const authToken = jwt.sign({ user }, process.env.JWT_SECRET || 'secret');
        const successResponse: WebResponse = {
            message: 'Logged in successfully',
            data: {
                user,
                authToken
            },
            status: true
        }
        return res.json(successResponse);
    }
    catch (e) {
        return res.json(
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

router.get('/:_id', async (req, res) => {
    try {
        const _id = req.params._id;
        if (!_id) {
            return res.status(400).json(
                {
                    message: 'Invalid request',
                    status: false,
                    data: null
                }
            );
        }
        const user = await getUser(_id);
        if (!user) {
            throw new Error('User not found');
        }
        const successResponse: WebResponse = {
            message: 'User found',
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