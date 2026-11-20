import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';

const padraoPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

export async function cadastrar(dados) {
  const marca = texto(dados.marca);
  const modelo = texto(dados.modelo);
  const placa = texto(dados.placa).toUpperCase().replace('-', '');
  const ano = Number(dados.ano);
  const valorDiaria = Number(dados.valorDiaria);
  const anoMaximo = new Date().getFullYear() + 1;

  if (!marca || !modelo) {
    throw new AppError(400, 'Informe marca e modelo');
  }
  if (!padraoPlaca.test(placa)) {
    throw new AppError(400, 'Placa inválida. Use o formato ABC1D23 ou ABC1234');
  }
  if (!Number.isInteger(ano) || ano < 1900 || ano > anoMaximo) {
    throw new AppError(400, `Ano inválido. Informe um valor entre 1900 e ${anoMaximo}`);
  }
  if (!Number.isFinite(valorDiaria) || valorDiaria <= 0) {
    throw new AppError(400, 'O valor da diária deve ser maior que zero');
  }

  const existente = await prisma.veiculo.findUnique({ where: { placa } });
  if (existente) {
    throw new AppError(409, 'Já existe um veículo com esta placa');
  }

  return prisma.veiculo.create({
    data: { marca, modelo, placa, ano, valorDiaria }
  });
}

export async function listar({ disponivel } = {}) {
  const where = disponivel === true ? { disponivel: true } : {};

  return prisma.veiculo.findMany({
    where,
    orderBy: [{ marca: 'asc' }, { modelo: 'asc' }]
  });
}

export async function listarDisponiveis() {
  return listar({ disponivel: true });
}
