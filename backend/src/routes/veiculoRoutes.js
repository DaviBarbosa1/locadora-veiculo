import { Router } from 'express';
import * as veiculoController from '../controllers/veiculoController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const veiculoRoutes = Router();

veiculoRoutes.use(autenticar);

veiculoRoutes.post('/', asyncHandler(veiculoController.cadastrar));
veiculoRoutes.get('/', asyncHandler(veiculoController.listar));
veiculoRoutes.get('/disponiveis', asyncHandler(veiculoController.listarDisponiveis));
