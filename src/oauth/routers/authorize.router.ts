import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { BadRequestException, NotFoundException } from '../exceptions';
import { Client } from '../model';
import { checkAccountCredentials, checkAuthorizationParams, generateAuthorizationCode } from '../utils';

const router = Router();
const prisma = new PrismaClient();

// HTML Login Form
router.get('/', async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { client_id, redirect_uri, scope, state, response_type } = req.query;

        await checkAuthorizationParams({
            client_id: client_id as string,
            redirect_uri: redirect_uri as string,
            scope: scope as string,
            state: state as string,
            response_type: response_type as string
        });

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
router.post('/', async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { client_id, redirect_uri, scope, state, response_type } = req.query;

        await checkAuthorizationParams({
            client_id: client_id as string,
            redirect_uri: redirect_uri as string,
            scope: scope as string,
            state: state as string,
            response_type: response_type as string
        });

        const clientId = client_id as string;
        const { username, password } = req.body;

        // Check whether username and password fields exists
        const credsMissingFields = [];
        if (!username || username === '') credsMissingFields.push('username');
        if (!password || password === '') credsMissingFields.push('password');

        // Error: Missing Fields
        if (credsMissingFields.length > 0) {
            throw new BadRequestException({
                missingFields: credsMissingFields,
            });
        }

        const accountId = await checkAccountCredentials(username, password);

        // Generate authorization code
        const authorizationCode = await generateAuthorizationCode(clientId, accountId);

        // Generate redirect address
        const redirectTo = (redirect_uri as string) + `?code=${authorizationCode}`;
        
        return res.redirect(redirectTo);
        
    }

    catch (err) {
        next({
            message: "Failed to authorize.",
            error: err,
        });
    }

});

export default router;