import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import CryptoJS, { AES } from "crypto-js";
import JWT from "jsonwebtoken";
import { DateTime } from 'luxon';
import { BadRequestException, BadCredentialsException } from "../exceptions";

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : "SECRET_KEY";

        // -- Get request body

        const { client_id, client_secret } = req.body;
        const { grant_type } = req.body;
        const { username, password } = req.body;

        // -- Authenticate client

        // Check whether client_id and client_secret fields exists
        const clientMissingFields = [];
        if (!client_id || client_id === '')         clientMissingFields.push('client_id');
        if (!client_secret || client_secret === '') clientMissingFields.push('client_secret');

        // Error: Missing Fields
        if (clientMissingFields.length > 0) {
            throw new BadRequestException({
                missingFields: clientMissingFields,
            });
        }

        // -- Grant type: Password Credentials
        if (grant_type === 'password') {

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

            // Get account with provided username
            const account = await prisma.authAccount.findUnique({
                where: {
                    username,
                }
            });
            
            // Error: User not found
            if (!account) throw new BadCredentialsException();

            // Check the password
            const passwordBytes = AES.decrypt(account.password, SECRET_KEY);
            const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

            // Error: Invalid password
            if (password !== decryptedPassword) throw new BadCredentialsException();

            // Set expiration time
            const JWT_REFRESH_TOKEN_EXP = process.env.JWT_REFRESH_TOKEN_EXP ? parseInt(process.env.JWT_REFRESH_TOKEN_EXP) : 604800;
            const JWT_ACCESS_TOKEN_EXP = process.env.JWT_ACCESS_TOKEN_EXP ? parseInt(process.env.JWT_ACCESS_TOKEN_EXP) : 3600;
            const refreshTokenExpiration = DateTime.now().plus({ seconds: JWT_REFRESH_TOKEN_EXP });
            const accessTokenExpiration = DateTime.now().plus({ seconds: JWT_ACCESS_TOKEN_EXP });
          
            // Generate refresh_token and access_token
            const refreshToken = JWT.sign({ accountId: account.id, exp: Math.floor(refreshTokenExpiration.toSeconds()) }, SECRET_KEY);
            const accessToken = JWT.sign({ accountId: account.id, exp: Math.floor(accessTokenExpiration.toSeconds()) }, SECRET_KEY);

            // Remove existing refresh_token from the database
            await prisma.authRefreshToken.delete({
                where: { accountId: account.id },
            });

            // Remove existing access_token from the database
            await prisma.authAccessToken.delete({
                where: { accountId: account.id },
            });

            // Save refresh_token to the database
            await prisma.authRefreshToken.create({
                data: {
                    token: refreshToken,
                    accountId: account.id,
                    expireAt: refreshTokenExpiration.toISO(),
                }
            });

            // Save access_token to the database
            await prisma.authAccessToken.create({
                data: {
                    token: accessToken,
                    accountId: account.id,
                    expireAt: accessTokenExpiration.toISO(),
                }
            });

            return res.status(200).json({
                refresh_token: refreshToken,
                access_token: accessToken,
            });

        }

    }

    catch (err: unknown) {

        console.error(err);

        next({
            message: "Failed to get token.",
            error: err,
        });

    }

});

export { router as Token };