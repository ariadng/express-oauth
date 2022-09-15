import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { BadRequestException, NotFoundException } from '../exceptions';
import { Client } from '../model';

const router = Router();
const prisma = new PrismaClient();

// HTML Login Form
router.get('/', async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { client_id, redirect_uri, scope, state, response_type } = req.query;

        // -- Check for missing query parameters

        const missingParams: string[] = [];

        if (!client_id || client_id === '')         missingParams.push('client_id');
        if (!redirect_uri || redirect_uri === '')   missingParams.push('redirect_uri');

        if (missingParams.length > 0) throw new BadRequestException({ missingParams });

        // -- Check client_id

        const client = await Client.get(client_id as string);
        if (!client) throw new NotFoundException("Invalid client_id.");

        // -- Check redirect_uri

        

        return res.status(200).sendFile(path.join(__dirname + '/../views/login.html'));
    }

    catch (err) {
        next({
            message: "Failed to authorize.",
            error: err,
        });
    }
   
});

// Process client authorization
router.post('/', async (req: Request, res: Response) => {
    return res.status(200).send("/auth/authorize endpoint works!")
});

export default router;