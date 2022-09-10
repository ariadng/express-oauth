import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import CryptoJS, { AES } from "crypto-js";
import JWT from "jsonwebtoken";
import { DateTime } from 'luxon';
import { BadRequestException, BadCredentialsException } from "../exceptions";

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response) => {
    
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
            const user = await prisma.authAccount.findUnique({
                where: {
                    username,
                }
            });
            
            // Error: User not found
            if (!user) throw new BadCredentialsException();

            // Check the password
            const passwordBytes = AES.decrypt(user.password, SECRET_KEY);
            const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

            // Error: Invalid password
            if (password !== decryptedPassword) throw new BadCredentialsException();

            // Set expiration time
            const JWT_REFRESH_TOKEN_EXP = process.env.JWT_REFRESH_TOKEN_EXP ? parseInt(process.env.JWT_REFRESH_TOKEN_EXP) : 10800;
            const JWT_ACCESS_TOKEN_EXP = process.env.JWT_ACCESS_TOKEN_EXP ? parseInt(process.env.JWT_ACCESS_TOKEN_EXP) : 3600;
            const refreshTokenExpiration = DateTime.now().plus({ seconds: JWT_REFRESH_TOKEN_EXP });
            const accessTokenExpiration = DateTime.now().plus({ seconds: JWT_ACCESS_TOKEN_EXP });
            
            // Generate refresh_token and access_token
            const refreshToken = JWT.sign({ userId: user.id, exp: JWT_REFRESH_TOKEN_EXP }, SECRET_KEY);
            const accessToken = JWT.sign({ userId: user.id, exp: JWT_ACCESS_TOKEN_EXP }, SECRET_KEY);
            
            return res.status(200).json({
                refresh_token: refreshToken,
                access_token: accessToken,
            });

        }

    }

    catch (err: unknown) {

        console.error(err);

        if (err instanceof BadRequestException) {
            return res.status(err.httpCode).send({
                errorType: err.type,
                message: err.message,
                details: err.details,
            });
        }

        else if (err instanceof BadCredentialsException) {
            return res.status(err.httpCode).send({
                errorType: err.type,
                message: err.message,
            });
        }

        else {
            return res.status(500).send({
                message: "Something unexpected happened.",
                error: err,
            });
        }

    }

});

export { router as Token };