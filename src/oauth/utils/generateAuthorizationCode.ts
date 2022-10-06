import { AES } from "crypto-js";
import { PrismaClient } from "@prisma/client";
import { Client } from "../model";
import { DateTime } from "luxon";
import getSecretKey from "./getSecretKey";

const prisma = new PrismaClient();

export default async function generateAuthorizationCode(clientId: string, accountId: number): Promise<string | null> {

    try {
        const expiration = 5 * 60;

        // Check clientId
        const client = await Client.get(clientId);
        if (!client) return null;

        // Check accountId
        const account = await prisma.authAccount.findFirst({
            where: {
                id: accountId,
            }
        });
        if (!account) return null;

        // Authorization object
        const authObject = {
            clientId,
            accountId,
            expireAt: DateTime.now().plus({ seconds: expiration }).toUTC().toString(),
        };

        // Generate authorization code
        const authString = JSON.stringify(authObject);
        const authCode = AES.encrypt(authString, getSecretKey()).toString();

        // Save authorization code to the database
        await prisma.authCode.create({
            data: {
                token: authCode,
                expireAt: authObject.expireAt,
                accountId,
                clientId,
            }
        });

        return authCode;
    }

    catch (err) {
        throw err;
    }

}