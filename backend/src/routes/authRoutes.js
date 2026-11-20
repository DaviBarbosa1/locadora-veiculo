import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const authRoutes = Router();

authRoutes.post('/registrar', asyncHandler(authController.registrar));
authRoutes.post('/login', asyncHandler(authController.login));
authRoutes.get('/perfil', autenticar, asyncHandler(authController.perfil));
