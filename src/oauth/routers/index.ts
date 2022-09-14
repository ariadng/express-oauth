import { Router } from 'express';
import AuthorizeRouter from "./authorize.router";
import TokenRouter from "./token.router";
import ClientRouter from "./client.router";
import RegisterRouter from "./register.router";
import { AuthMiddleware, ErrorHandlerMiddleware, SuperAdminMiddleware } from '../middlewares';

const router = Router();

router.use('/authorize',    AuthorizeRouter, ErrorHandlerMiddleware);
router.use('/token',        TokenRouter, ErrorHandlerMiddleware);
router.use('/register',     RegisterRouter, ErrorHandlerMiddleware);

router.use('/client',       AuthMiddleware, SuperAdminMiddleware, ClientRouter, ErrorHandlerMiddleware);

export { router as AuthRouter };