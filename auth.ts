// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { WebResponse } from './types/webResponse';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        const response: WebResponse = {
            status: false,
            message: 'Unauthorized',
            data: null
        }
        return res.status(401).json(response);
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.body.user = jwt.decode(token);
        next();
    } catch (e) {
        const response: WebResponse = {
            status: false,
            message: 'Unauthorized',
            data: null
        }
        return res.status(401).json(response);
    }
}
