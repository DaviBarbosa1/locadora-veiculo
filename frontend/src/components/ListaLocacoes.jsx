import Placa from './Placa.jsx';
import { formatarDataHora, formatarMoeda } from '../utils.js';

export default function ListaLocacoes({ locacoes, onFinalizar, finalizandoId, carregando }) {
  return (
    <section className="painel">
      <h2>Minhas locações</h2>

      {carregando && <p className="vazio">Carregando locações...</p>}

      {!carregando && locacoes.length === 0 && (
        <p className="vazio">Você ainda não fez nenhuma locação.</p>
      )}

      <ul className="lista">
        {locacoes.map((locacao) => (
          <li key={locacao.id} className="item item-locacao">
            <div className="item-principal">
              <strong>
                {locacao.veiculo.marca} {locacao.veiculo.modelo}
              </strong>
              <span className="item-detalhe">
                Retirada {formatarDataHora(locacao.dataInicio)} · Previsto{' '}
                {formatarDataHora(locacao.dataPrevistaDevolucao)}
              </span>
              {locacao.dataDevolucao && (
                <span className="item-detalhe">
                  Devolvido em {formatarDataHora(locacao.dataDevolucao)}
                </span>
              )}
            </div>

            <Placa valor={locacao.veiculo.placa} />

            <div className="item-valor">
              <strong>{formatarMoeda(locacao.valorTotal)}</strong>
              <span className={locacao.status === 'ATIVA' ? 'selo selo-alugado' : 'selo selo-livre'}>
                {locacao.status === 'ATIVA' ? 'Em andamento' : 'Finalizada'}
              </span>
            </div>

            {locacao.status === 'ATIVA' && (
              <button
                type="button"
                className="botao-secundario"
                disabled={finalizandoId === locacao.id}
                onClick={() => onFinalizar(locacao.id)}
              >
                {finalizandoId === locacao.id ? 'Finalizando...' : 'Finalizar locação'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
