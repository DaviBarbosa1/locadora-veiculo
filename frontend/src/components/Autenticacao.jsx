import { useState } from 'react';
import { api, salvarToken } from '../api.js';

const formularioInicial = { nome: '', email: '', senha: '' };

export default function Autenticacao({ onEntrar, onMensagem }) {
  const [modo, setModo] = useState('login');
  const [campos, setCampos] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    setCampos({ ...campos, [evento.target.name]: evento.target.value });
  }

  function trocarModo(novoModo) {
    setModo(novoModo);
    setCampos(formularioInicial);
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    try {
      if (modo === 'cadastro') {
        await api.registrar(campos);
        onMensagem({ tipo: 'sucesso', texto: 'Cadastro concluído. Entre com seu e-mail e senha.' });
        setModo('login');
        setCampos({ ...formularioInicial, email: campos.email });
      } else {
        const resposta = await api.login({ email: campos.email, senha: campos.senha });
        salvarToken(resposta.token);
        onEntrar(resposta.usuario);
      }
    } catch (erro) {
      onMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="autenticacao">
      <div className="autenticacao-apresentacao">
        <h1>Locadora de Veículos</h1>
        <p>Escolha o carro, defina o período e acompanhe cada locação em um só lugar.</p>
      </div>

      <form className="painel formulario" onSubmit={enviar}>
        <h2>{modo === 'login' ? 'Entrar' : 'Criar conta'}</h2>

        {modo === 'cadastro' && (
          <label>
            Nome completo
            <input name="nome" value={campos.nome} onChange={alterar} required autoComplete="name" />
          </label>
        )}

        <label>
          E-mail
          <input
            name="email"
            type="email"
            value={campos.email}
            onChange={alterar}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Senha
          <input
            name="senha"
            type="password"
            value={campos.senha}
            onChange={alterar}
            required
            minLength={6}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        <button type="submit" className="botao" disabled={enviando}>
          {enviando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          type="button"
          className="botao-link"
          onClick={() => trocarModo(modo === 'login' ? 'cadastro' : 'login')}
        >
          {modo === 'login' ? 'Ainda não tenho conta' : 'Já tenho conta'}
        </button>
      </form>
    </section>
  );
}
