import { Router, Request, Response } from 'express';
import { Authorize } from "./authorize.auth";
import { Token } from "./token.auth";
import { Register } from "./register.auth";

const router = Router();

router.use('/authorize', Authorize);
router.use('/token', Token);
router.use('/register', Register);

export { router as AuthRouter };