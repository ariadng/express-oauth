import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import { AuthMiddleware, ErrorHandlerMiddleware, SuperAdminMiddleware } from './middleware'

import { AuthRouter } from './auth';

// Enable environment variables
dotenv.config();

// Create express app
const app = express();
const port = process.env.SERVER_PORT || 4000;

// Enable CORS
app.use(cors());

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Configure routers
app.use('/oauth', AuthRouter, ErrorHandlerMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/test', AuthMiddleware, (req: Request, res: Response) => {
    res.send(req.body.account);
});

app.get('/superadmintest', AuthMiddleware, SuperAdminMiddleware, (req: Request, res: Response) => {
    res.send(req.body.account);
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});