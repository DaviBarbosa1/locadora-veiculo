export default function Cabecalho({ usuario, aba, onTrocarAba, onSair }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-marca">Locadora</div>

      <nav className="cabecalho-abas">
        <button
          type="button"
          className={aba === 'veiculos' ? 'aba aba-ativa' : 'aba'}
          onClick={() => onTrocarAba('veiculos')}
        >
          Veículos
        </button>
        <button
          type="button"
          className={aba === 'locacoes' ? 'aba aba-ativa' : 'aba'}
          onClick={() => onTrocarAba('locacoes')}
        >
          Locações
        </button>
      </nav>

      <div className="cabecalho-usuario">
        <span>{usuario.nome}</span>
        <button type="button" className="botao-secundario" onClick={onSair}>
          Sair
        </button>
      </div>
    </header>
  );
}
