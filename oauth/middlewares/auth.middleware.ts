import { BadAuthorizationException } from '../exceptions';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import JWT from 'jsonwebtoken';
import CryptoJS, { AES } from 'crypto-js';
import { getSecretKey } from '../utils';

const prisma = new PrismaClient();

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {

        // -- Check access token in authorization header
        
        // Get authorization header
        const authorizationHeader = req.header("Authorization");
        // Error: there is no authorization header
        if (!authorizationHeader) throw new BadAuthorizationException("There is no 'Authorization' header available.");
        // Error: there is no token in authorization header
        if (authorizationHeader.split(' ').length < 2) throw new BadAuthorizationException("There is no access_token in authorization header. Required format: 'Bearer access_token'");

        // -- Check access_token validation
        
        const accessToken = authorizationHeader.split(' ')[1];
        const decodedToken = JWT.verify(accessToken, getSecretKey()) as { accountId: number, exp: number };

        // Cross-check with the database
        const dbAccessToken = await prisma.authAccessToken.findFirst({
            where: {
                token: accessToken,
                accountId: decodedToken.accountId,
            }
        });

        // Error: token payload is not found in database
        if (!dbAccessToken) throw new BadAuthorizationException("Invalid token payload.");

        // -- Add account information to the request body for the next route
        const account = await prisma.authAccount.findFirst({
            where: {
                id: dbAccessToken.accountId,
            }
        });
        
        // Error: account not found
        if (!account) throw new BadAuthorizationException("Invalid account.");
        
        // Get account privileges
        let privileges: string[] = [];
        if (account.privileges !== "") {
            const privilegesBytes = AES.decrypt(account.privileges, getSecretKey());
            privileges = JSON.parse(privilegesBytes.toString(CryptoJS.enc.Utf8));
        }
        

        // Send to the next route
        req.body.account = {
            id: account.id,
            username: account.username,
            privileges,
        };
        next();

    }

    catch(err: any) {

        if (err instanceof BadAuthorizationException) {
            return res.status(401).json({
                errorType: err.type,
                message: err.message,
            });
        }

        else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                errorType: 'TokenExpiredError',
                message: "Token is expired. Please request for a new access_token using refresh_token.",
            });
        }

        else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                errorType: 'TokenInvalidError',
                message: "Token is invalid.",
            });
        }

        else if (err.name === 'NotBeforeError') {
            return res.status(401).json({
                errorType: 'TokenInactiveError',
                message: "Token is not active.",
            });
        }

        else {
            console.error(err)
            return res.status(500).send(err);
        }

    }

};

export default AuthMiddleware;