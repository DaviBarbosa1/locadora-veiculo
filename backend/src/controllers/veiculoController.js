import * as veiculoService from '../services/veiculoService.js';

export async function cadastrar(req, res) {
  const veiculo = await veiculoService.cadastrar(req.body ?? {});
  res.status(201).json(veiculo);
}

export async function listar(req, res) {
  const disponivel = req.query.disponivel === 'true';
  const veiculos = await veiculoService.listar({ disponivel });
  res.json(veiculos);
}

export async function listarDisponiveis(req, res) {
  const veiculos = await veiculoService.listarDisponiveis();
  res.json(veiculos);
}
