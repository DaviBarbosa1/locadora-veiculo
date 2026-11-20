import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';

const selecaoUsuario = { id: true, nome: true, email: true, dataCadastro: true };
const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

export async function registrar(dados) {
  const nome = texto(dados.nome);
  const email = texto(dados.email).toLowerCase();
  const senha = typeof dados.senha === 'string' ? dados.senha : '';

  if (nome.length < 2) {
    throw new AppError(400, 'Informe o nome completo');
  }
  if (!padraoEmail.test(email)) {
    throw new AppError(400, 'Informe um e-mail válido');
  }
  if (senha.length < 6) {
    throw new AppError(400, 'A senha deve ter pelo menos 6 caracteres');
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw new AppError(409, 'Já existe um usuário com este e-mail');
  }

  const hash = await bcrypt.hash(senha, 10);

  return prisma.usuario.create({
    data: { nome, email, senha: hash },
    select: selecaoUsuario
  });
}

export async function login(dados) {
  const email = texto(dados.email).toLowerCase();
  const senha = typeof dados.senha === 'string' ? dados.senha : '';

  if (!email || !senha) {
    throw new AppError(400, 'Informe e-mail e senha');
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaCorreta = usuario ? await bcrypt.compare(senha, usuario.senha) : false;

  if (!usuario || !senhaCorreta) {
    throw new AppError(401, 'E-mail ou senha incorretos');
  }

  const token = jwt.sign({ sub: String(usuario.id) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });

  const { senha: _descartada, ...usuarioPublico } = usuario;

  return { token, usuario: usuarioPublico };
}

export async function buscarUsuarioPorId(id) {
  return prisma.usuario.findUnique({ where: { id }, select: selecaoUsuario });
}

export function validarToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError(401, 'Token inválido ou expirado');
  }
}
