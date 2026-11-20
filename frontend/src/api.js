const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const CHAVE_TOKEN = 'locadora.token';

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function salvarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function removerToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}

async function requisicao(caminho, { metodo = 'GET', corpo } = {}) {
  const cabecalhos = { 'Content-Type': 'application/json' };
  const token = obterToken();

  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta;

  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined
    });
  } catch {
    throw new ErroApi('Não foi possível conectar ao servidor', 0);
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new ErroApi(dados?.mensagem || 'Erro ao processar a requisição', resposta.status);
  }

  return dados;
}

export const api = {
  registrar: (corpo) => requisicao('/auth/registrar', { metodo: 'POST', corpo }),
  login: (corpo) => requisicao('/auth/login', { metodo: 'POST', corpo }),
  perfil: () => requisicao('/auth/perfil'),
  listarVeiculos: (apenasDisponiveis) =>
    requisicao(apenasDisponiveis ? '/veiculos?disponivel=true' : '/veiculos'),
  cadastrarVeiculo: (corpo) => requisicao('/veiculos', { metodo: 'POST', corpo }),
  listarLocacoes: () => requisicao('/locacoes'),
  registrarLocacao: (corpo) => requisicao('/locacoes', { metodo: 'POST', corpo }),
  finalizarLocacao: (id) => requisicao(`/locacoes/${id}/finalizar`, { metodo: 'PATCH' })
};
