const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function formatarMoeda(valor) {
  return moeda.format(Number(valor));
}

export function formatarDataHora(valor) {
  return valor ? dataHora.format(new Date(valor)) : '—';
}

export function paraCampoLocal(data) {
  const deslocada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return deslocada.toISOString().slice(0, 16);
}
