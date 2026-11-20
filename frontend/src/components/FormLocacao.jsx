import { useState } from 'react';
import { api } from '../api.js';
import { formatarMoeda, paraCampoLocal } from '../utils.js';

function criarFormularioInicial() {
  const agora = new Date();
  const amanha = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

  return {
    veiculoId: '',
    dataInicio: paraCampoLocal(agora),
    dataPrevistaDevolucao: paraCampoLocal(amanha)
  };
}

export default function FormLocacao({ veiculosDisponiveis, onRegistrada, onMensagem }) {
  const [campos, setCampos] = useState(criarFormularioInicial);
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    setCampos({ ...campos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    try {
      const locacao = await api.registrarLocacao({
        veiculoId: Number(campos.veiculoId),
        dataInicio: new Date(campos.dataInicio).toISOString(),
        dataPrevistaDevolucao: new Date(campos.dataPrevistaDevolucao).toISOString()
      });
      setCampos(criarFormularioInicial());
      onMensagem({
        tipo: 'sucesso',
        texto: `Locação registrada. Valor total: ${formatarMoeda(locacao.valorTotal)}.`
      });
      onRegistrada();
    } catch (erro) {
      onMensagem({ tipo: 'erro', texto: erro.message });
      if (erro.status === 409) {
        onRegistrada();
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="painel formulario" onSubmit={enviar}>
      <h2>Nova locação</h2>

      <label>
        Veículo
        <select name="veiculoId" value={campos.veiculoId} onChange={alterar} required>
          <option value="">Selecione um veículo disponível</option>
          {veiculosDisponiveis.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} · {veiculo.placa} · {formatarMoeda(veiculo.valorDiaria)}/dia
            </option>
          ))}
        </select>
      </label>

      <div className="linha">
        <label>
          Retirada
          <input
            name="dataInicio"
            type="datetime-local"
            value={campos.dataInicio}
            onChange={alterar}
            required
          />
        </label>
        <label>
          Devolução prevista
          <input
            name="dataPrevistaDevolucao"
            type="datetime-local"
            value={campos.dataPrevistaDevolucao}
            onChange={alterar}
            required
          />
        </label>
      </div>

      {veiculosDisponiveis.length === 0 && (
        <p className="vazio">Não há veículos disponíveis para locação no momento.</p>
      )}

      <button type="submit" className="botao" disabled={enviando || veiculosDisponiveis.length === 0}>
        {enviando ? 'Registrando...' : 'Registrar locação'}
      </button>
    </form>
  );
}
