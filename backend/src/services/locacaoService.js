import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function lerData(valor, campo) {
  const data = new Date(valor);
  if (valor === undefined || valor === null || valor === '' || Number.isNaN(data.getTime())) {
    throw new AppError(400, `${campo} inválida`);
  }
  return data;
}

function lerId(valor, campo) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `${campo} inválido`);
  }
  return id;
}

function calcularValorTotal(valorDiaria, dataInicio, dataPrevistaDevolucao) {
  const diarias = Math.ceil((dataPrevistaDevolucao - dataInicio) / MS_POR_DIA);
  return Math.round(Number(valorDiaria) * diarias * 100) / 100;
}

export async function registrar(usuarioId, dados) {
  const veiculoId = lerId(dados.veiculoId, 'Veículo');
  const dataInicio = lerData(dados.dataInicio, 'Data de início');
  const dataPrevistaDevolucao = lerData(dados.dataPrevistaDevolucao, 'Data prevista de devolução');

  if (dataPrevistaDevolucao <= dataInicio) {
    throw new AppError(400, 'A data prevista de devolução deve ser posterior à data de início');
  }

  const veiculo = await prisma.veiculo.findUnique({ where: { id: veiculoId } });
  if (!veiculo) {
    throw new AppError(404, 'Veículo não encontrado');
  }
  if (!veiculo.disponivel) {
    throw new AppError(409, 'Veículo indisponível para locação');
  }

  const valorTotal = calcularValorTotal(veiculo.valorDiaria, dataInicio, dataPrevistaDevolucao);

  return prisma.$transaction(async (tx) => {
    const reserva = await tx.veiculo.updateMany({
      where: { id: veiculoId, disponivel: true },
      data: { disponivel: false }
    });

    if (reserva.count === 0) {
      throw new AppError(409, 'Veículo indisponível para locação');
    }

    return tx.locacao.create({
      data: { usuarioId, veiculoId, dataInicio, dataPrevistaDevolucao, valorTotal },
      include: { veiculo: true }
    });
  });
}

export async function listarDoUsuario(usuarioId) {
  return prisma.locacao.findMany({
    where: { usuarioId },
    include: { veiculo: true },
    orderBy: [{ dataInicio: 'desc' }, { id: 'desc' }]
  });
}

async function buscarDoUsuario(usuarioId, id) {
  const locacao = await prisma.locacao.findUnique({
    where: { id },
    include: { veiculo: true }
  });

  if (!locacao) {
    throw new AppError(404, 'Locação não encontrada');
  }
  if (locacao.usuarioId !== usuarioId) {
    throw new AppError(403, 'Você não tem permissão para acessar esta locação');
  }

  return locacao;
}

export async function buscarPorId(usuarioId, idInformado) {
  const id = lerId(idInformado, 'Locação');
  return buscarDoUsuario(usuarioId, id);
}

export async function finalizar(usuarioId, idInformado) {
  const id = lerId(idInformado, 'Locação');
  const locacao = await buscarDoUsuario(usuarioId, id);

  if (locacao.status !== 'ATIVA') {
    throw new AppError(409, 'Esta locação já foi finalizada');
  }

  return prisma.$transaction(async (tx) => {
    const encerramento = await tx.locacao.updateMany({
      where: { id, status: 'ATIVA' },
      data: { status: 'FINALIZADA', dataDevolucao: new Date() }
    });

    if (encerramento.count === 0) {
      throw new AppError(409, 'Esta locação já foi finalizada');
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { disponivel: true }
    });

    return tx.locacao.findUnique({
      where: { id },
      include: { veiculo: true }
    });
  });
}
