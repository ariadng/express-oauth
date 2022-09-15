import { BadRequestException, NotFoundException } from '../exceptions';
import { Router, Request, Response, NextFunction } from 'express';
import { Client } from '../model';

const router = Router();

// [ Get all clients ]
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clients = await Client.index();
        return res.json({
            message: "Get clients data success.",
            data: clients,
        });
    }
    
    catch (err) {
        next({
            message: "Failed to get clients.",
            error: err,
        });
    }
});

// [ Create a new client ]
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { name, description, domains } = req.body;

        if (!name || name === '') throw new BadRequestException({
            missingFields: [ 'name' ],
        });

        const client = await Client.create(name, description, domains);

        return res.json({
            message: "Create new client success.",
            data: client,
        });

    }

    catch (err) {
        next({
            message: "Failed to create new client.",
            error: err,
        });
    }
});

// [ Get client by id ]
router.get('/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const clientId = req.params.clientId;
        const client = await Client.get(clientId);

        if (!client) throw new NotFoundException();

        return res.json({
            message: `Get client with id (${clientId}) success.`,
            data: client,
        });

    }

    catch (err) {
        next({
            message: `Failed to create get client with id (${req.params.clientId}).`,
            error: err,
        });
    }
});

// [ Get client secret by id ]
router.get('/:clientId/secret', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const clientId = req.params.clientId;
        const secret = await Client.getSecret(clientId);

        if (!secret) throw new NotFoundException();

        return res.json({
            message: `Get secret of client with id (${clientId}) success.`,
            data: secret,
        });

    }

    catch (err) {
        next({
            message: `Failed to get secret of client with id (${req.params.clientId}).`,
            error: err,
        });
    }
});

// [ Update a client by id ]
router.put('/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { clientId } = req.params;
        const { name, description } = req.body;

        const update: {
            name?: string,
            description?: string,
        } = {};

        const updatedFields: string[] = [];

        if (name && name !== '') {
            update.name = name;
            updatedFields.push("name");
        }

        if (description && description !== '') {
            update.description = description;
            updatedFields.push("description");
        }

        const client = await Client.update(clientId, update);

        if (!client) throw new NotFoundException();

        return res.json({
            message: `Update client with id (${req.params.clientId}) success.`,
            data: client,
            updatedFields,
        });

    }
    catch (err) {
        next({
            message: `Failed to update client with id (${req.params.clientId}).`,
            error: err,
        });
    }
});

// [ Delete a client by id ]
router.delete('/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { clientId } = req.params;

        const client = await Client.delete(clientId);
        if (!client) throw new NotFoundException();

        return res.json({
            message: `Delete client with id (${clientId}) success.`,
            data: client,
        });

    }
    catch (err) {
        next({
            message: `Failed to delete client with id (${req.params.clientId}).`,
            error: err,
        });
    }
});

export default router;