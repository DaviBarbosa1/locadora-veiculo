import { AppError } from '../errors/AppError.js';

export function naoEncontrado(req, res) {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
}

export function tratarErros(erro, req, res, next) {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'Corpo da requisição inválido' });
  }

  if (erro.code === 'P2002') {
    return res.status(409).json({ mensagem: 'Registro duplicado' });
  }

  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
