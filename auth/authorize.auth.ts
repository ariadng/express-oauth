import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// HTML Login Form
router.get('/', async (req: Request, res: Response) => {
    return res.status(200).send("/auth/authorize endpoint works!")
});

// Process client authorization
router.post('/', async (req: Request, res: Response) => {
    return res.status(200).send("/auth/authorize endpoint works!")
});

export { router as Authorize };