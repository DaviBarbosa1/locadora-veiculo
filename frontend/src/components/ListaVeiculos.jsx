import Placa from './Placa.jsx';
import { formatarMoeda } from '../utils.js';

export default function ListaVeiculos({ veiculos, apenasDisponiveis, onFiltrar, carregando }) {
  return (
    <section className="painel">
      <div className="painel-topo">
        <h2>Frota</h2>
        <div className="filtro" role="group" aria-label="Filtrar por disponibilidade">
          <button
            type="button"
            className={!apenasDisponiveis ? 'filtro-opcao filtro-ativo' : 'filtro-opcao'}
            onClick={() => onFiltrar(false)}
          >
            Todos
          </button>
          <button
            type="button"
            className={apenasDisponiveis ? 'filtro-opcao filtro-ativo' : 'filtro-opcao'}
            onClick={() => onFiltrar(true)}
          >
            Disponíveis
          </button>
        </div>
      </div>

      {carregando && <p className="vazio">Carregando veículos...</p>}

      {!carregando && veiculos.length === 0 && (
        <p className="vazio">
          {apenasDisponiveis
            ? 'Nenhum veículo disponível agora.'
            : 'Nenhum veículo cadastrado. Use o formulário para adicionar o primeiro.'}
        </p>
      )}

      <ul className="lista">
        {veiculos.map((veiculo) => (
          <li key={veiculo.id} className="item">
            <div className="item-principal">
              <strong>
                {veiculo.marca} {veiculo.modelo}
              </strong>
              <span className="item-detalhe">
                {veiculo.ano} · {formatarMoeda(veiculo.valorDiaria)} por dia
              </span>
            </div>
            <Placa valor={veiculo.placa} />
            <span className={veiculo.disponivel ? 'selo selo-livre' : 'selo selo-alugado'}>
              {veiculo.disponivel ? 'Disponível' : 'Alugado'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
