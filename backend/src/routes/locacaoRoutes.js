import { Router } from 'express';
import * as locacaoController from '../controllers/locacaoController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const locacaoRoutes = Router();

locacaoRoutes.use(autenticar);

locacaoRoutes.post('/', asyncHandler(locacaoController.registrar));
locacaoRoutes.get('/', asyncHandler(locacaoController.listar));
locacaoRoutes.get('/:id', asyncHandler(locacaoController.buscar));
locacaoRoutes.patch('/:id/finalizar', asyncHandler(locacaoController.finalizar));
