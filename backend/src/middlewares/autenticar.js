import * as authService from '../services/authService.js';
import { AppError } from '../errors/AppError.js';

export async function autenticar(req, res, next) {
  try {
    const cabecalho = req.headers.authorization || '';
    const [tipo, token] = cabecalho.split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new AppError(401, 'Token de autenticação não informado');
    }

    const payload = authService.validarToken(token);
    const usuario = await authService.buscarUsuarioPorId(Number(payload.sub));

    if (!usuario) {
      throw new AppError(401, 'Usuário do token não encontrado');
    }

    req.usuarioId = usuario.id;
    next();
  } catch (erro) {
    next(erro);
  }
}
