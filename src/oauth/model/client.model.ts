import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { AES } from "crypto-js";
import { DateTime } from 'luxon';
import { getSecretKey } from '../utils';

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

    id: string;
    name: string;
    description: string;
    domains?: string[];
    createdAt?: string;
    updatedAt?: string;
    secret?: string;

    constructor(data: {
        id: string,
        name: string,
        description: string,
        domains?: string[]
    }) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.id;
        if (Array.isArray(data.domains)) this.domains = data.domains;
    }

    // --- [ Static Functions ] ---

    // [ Get all clients ]
    public static async index(): Promise<Client[]> {

        const result: Client[] = [];
        const clients = await prisma.authClient.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        clients.forEach(client => {
            const data = new Client({
                id: client.id,
                name: client.name,
                description: client.description,
            });
            result.push(data);
        });
        
        return result;

    }

    // [ Create a new client ]
    public static async create(name: string, description: string, domains?: string[]): Promise<Client> {

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

        const clientDomains: string[] = [];

        if (Array.isArray(domains)) {
            for (let i = 0; i < domains.length; i++) {
                const domainURI = domains[i];
                if (typeof domainURI === 'string') {
                    const dbDomain = await prisma.authClientDomain.create({
                        data: {
                            clientId,
                            domain: domainURI,
                        },
                    });
                    if (dbDomain) clientDomains.push(dbDomain.domain);
                }
            }
        }

        return new Client({
            id: client.id,
            name: client.name,
            description: client.description,
            domains: clientDomains,
        });

    }

    // [ Get client by id ]
    public static async get(clientId: string): Promise<Client | null> {

        const client = await prisma.authClient.findFirst({
            where: {
                id: clientId,
            },
            include: {
                domains: true,
            }
        });

        if (!client) return null;

        const domains: string[] = []; 
        client.domains.forEach(domain => {
            client.domains.forEach(domain => {
                domains.push(domain.domain);
            });
        });

        return new Client({
            id: client.id,
            name: client.name,
            description: client.description,
            domains,
        });

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
    }): Promise<Client | null> {

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

        return new Client({
            id: updatedClient.id,
            name: updatedClient.name,
            description: updatedClient.description,
        });

    }

    // [ Delete a client by id ]
    public static async delete(clientId: string): Promise<Client | null> {

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

        // Delete all associated domains
        await prisma.authClientDomain.deleteMany({
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