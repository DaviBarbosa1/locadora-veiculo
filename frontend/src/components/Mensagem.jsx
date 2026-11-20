export default function Mensagem({ mensagem, onFechar }) {
  if (!mensagem) {
    return null;
  }

  return (
    <div className={`mensagem mensagem-${mensagem.tipo}`} role="status">
      <span>{mensagem.texto}</span>
      <button type="button" className="mensagem-fechar" onClick={onFechar} aria-label="Fechar aviso">
        ×
      </button>
    </div>
  );
}
