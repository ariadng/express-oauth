import { PrismaClient } from "@prisma/client";
import CryptoJS, { AES } from "crypto-js";
import { BadCredentialsException } from "../exceptions";
import { getSecretKey } from '../utils';

const prisma = new PrismaClient();

export default async function checkAccountCredentials(username: string, password: string): Promise<number> {

    // Get account with provided username
    const account = await prisma.authAccount.findUnique({
        where: {
            username,
        }
    });

    // Error: User not found
    if (!account) throw new BadCredentialsException();

    // Check the password
    const passwordBytes = AES.decrypt(account.password, getSecretKey());
    const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

    // Error: Invalid password
    if (password !== decryptedPassword) throw new BadCredentialsException();
    
    return account.id;
}