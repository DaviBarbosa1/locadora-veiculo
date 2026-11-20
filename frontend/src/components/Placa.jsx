export default function Placa({ valor }) {
  return (
    <span className="placa" aria-label={`Placa ${valor}`}>
      <span className="placa-faixa">BRASIL</span>
      <span className="placa-numero">{valor}</span>
    </span>
  );
}
