import { useState } from 'react';
import { api } from '../api.js';

const formularioInicial = { marca: '', modelo: '', placa: '', ano: '', valorDiaria: '' };

export default function FormVeiculo({ onCadastrado, onMensagem }) {
  const [campos, setCampos] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    const { name, value } = evento.target;
    setCampos({ ...campos, [name]: name === 'placa' ? value.toUpperCase() : value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    try {
      const veiculo = await api.cadastrarVeiculo({
        marca: campos.marca,
        modelo: campos.modelo,
        placa: campos.placa,
        ano: Number(campos.ano),
        valorDiaria: Number(campos.valorDiaria)
      });
      setCampos(formularioInicial);
      onMensagem({ tipo: 'sucesso', texto: `${veiculo.marca} ${veiculo.modelo} cadastrado.` });
      onCadastrado();
    } catch (erro) {
      onMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="painel formulario" onSubmit={enviar}>
      <h2>Cadastrar veículo</h2>

      <div className="linha">
        <label>
          Marca
          <input name="marca" value={campos.marca} onChange={alterar} required />
        </label>
        <label>
          Modelo
          <input name="modelo" value={campos.modelo} onChange={alterar} required />
        </label>
      </div>

      <div className="linha">
        <label>
          Placa
          <input name="placa" value={campos.placa} onChange={alterar} required maxLength={8} />
        </label>
        <label>
          Ano
          <input name="ano" type="number" value={campos.ano} onChange={alterar} required />
        </label>
      </div>

      <label>
        Valor da diária (R$)
        <input
          name="valorDiaria"
          type="number"
          min="0.01"
          step="0.01"
          value={campos.valorDiaria}
          onChange={alterar}
          required
        />
      </label>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Cadastrar veículo'}
      </button>
    </form>
  );
}
