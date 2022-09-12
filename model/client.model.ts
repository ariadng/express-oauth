import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { AES } from "crypto-js";
import { DateTime } from 'luxon';
import { getSecretKey } from '../auth/utils.auth';

const prisma = new PrismaClient();

export interface ClientSchema {
    id: string,
    name: string,
    description: string,
    createdAt?: string,
    updatedAt?: string,
    secret?: string,
}

export default class Client {

    // [ Get all clients ]
    public static async index(): Promise<ClientSchema[]> {

        const result: ClientSchema[] = [];
        const clients = await prisma.authClient.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        clients.forEach(client => {
            const data: ClientSchema = {
                id: client.id,
                name: client.name,
                description: client.description,
            };
            result.push(data);
        });
        
        return result;

    }

    // [ Create a new client ]
    public static async create(name: string, description: string): Promise<ClientSchema> {

        const clientId = uuid();
        const clientSecret = AES.encrypt(uuid() + Math.floor(DateTime.now().toSeconds()), getSecretKey()).toString();
        
        const client = await prisma.authClient.create({
            data: {
                id: clientId,
                secret: clientSecret,
                name,
                description,
            }
        });

        return {
            id: client.id,
            name: client.name,
            description: client.description,
        };

    }

    // [ Get client by id ]
    public static async get(clientId: string): Promise<ClientSchema | null> {

        const client = await prisma.authClient.findFirst({
            where: {
                id: clientId,
            }
        });

        if (!client) return null;

        return {
            id: client.id,
            name: client.name,
            description: client.description,
        };

    }

    // [ Get client secret by id ]
    public static async getSecret(clientId: string): Promise<string | null> {
        const client = await prisma.authClient.findFirst({
            where: {
                id: clientId,
            }
        });

        if (!client) return null;

        return client.secret;
    }

    // [ Update a client by id ]
    public static async update(clientId: string, data: {
        name?: string,
        description?: string,
    }): Promise<ClientSchema | null> {

        const client = await prisma.authClient.findFirst({
            where: {
                id: clientId,
            }
        });

        if (!client) return null;

        const update: {
            name?: string,
            description?: string,
        } = {};

        if (data.name && data.name !== '') update.name = data.name;
        if (data.description && data.description !== '') update.description = data.description;

        const updatedClient = await prisma.authClient.update({
            where: {
                id: clientId,
            },
            data: update,
        });

        return {
            id: updatedClient.id,
            name: updatedClient.name,
            description: updatedClient.description,
        };

    }

    // [ Delete a client by id ]
    public static async delete(clientId: string): Promise<ClientSchema | null> {

        const client = await this.get(clientId);

        if (!client) return null;

        // Delete all access tokens related to this client
        await prisma.authAccessToken.deleteMany({
            where: {
                clientId: clientId,
            }
        });

        // Delete all refresh tokens related to this client
        await prisma.authRefreshToken.deleteMany({
            where: {
                clientId: clientId,
            }
        });

        // Delete the client
        await prisma.authClient.delete({
            where: {
                id: clientId,
            }
        });

        return client;

    }

}