import * as authService from '../services/authService.js';

export async function registrar(req, res) {
  const usuario = await authService.registrar(req.body ?? {});
  res.status(201).json(usuario);
}

export async function login(req, res) {
  const resultado = await authService.login(req.body ?? {});
  res.json(resultado);
}

export async function perfil(req, res) {
  const usuario = await authService.buscarUsuarioPorId(req.usuarioId);
  res.json(usuario);
}
