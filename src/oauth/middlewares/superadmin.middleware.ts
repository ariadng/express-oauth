import { BadAuthorizationException } from '../exceptions';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import JWT from 'jsonwebtoken';
import CryptoJS, { AES } from 'crypto-js';
import { getSecretKey } from '../utils';

const prisma = new PrismaClient();

const SuperAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {

        if (req.body.account.privileges.includes("superadmin")) {
            next();
        }

        else {
            throw new BadAuthorizationException("You are not authorized to access this route.");
        }

    }

    catch (err: any) {

        if (err instanceof BadAuthorizationException) {
            return res.status(401).json({
                errorType: err.type,
                message: err.message,
            });
        }

    }

};

export default SuperAdminMiddleware;