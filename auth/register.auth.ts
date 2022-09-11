import { Router, Request, Response, NextFunction } from 'express';

import { AES } from "crypto-js";
import { BadRequestException } from "../exceptions";
import { PrismaClient } from '@prisma/client';
import { getSecretKey } from './utils.auth';

const router = Router();
const prisma = new PrismaClient();

// Process account registration
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : "SECRET_KEY";
        const { username, password, privileges } = req.body;

        // Check whether username and password fields exists
        const credsMissingFields: string[] = [];
        if (!username || username === '') credsMissingFields.push('username');
        if (!password || password === '') credsMissingFields.push('password');

        // Error: Missing Fields
        if (credsMissingFields.length > 0) {
            throw new BadRequestException({
                missingFields: credsMissingFields,
            });
        }

        // Privileges
        let privilegesString = "";
        if (privileges && Array.isArray(privileges)) {
            privilegesString = AES.encrypt(JSON.stringify(privileges), getSecretKey()).toString();
        }

        // Create account
        await prisma.authAccount.create({
            data: {
                username,
                password: AES.encrypt(password, SECRET_KEY).toString(),
                privileges: privilegesString,
            }
        });

        // Create account success
        return res.status(201).send({
            message: `Account with username '${username}' has been successfully created.`,
        });

    }

    catch(err: unknown) {
        next({
            message: 'Failed to create new account.',
            error: err,
        });
    }

});

export { router as Register };