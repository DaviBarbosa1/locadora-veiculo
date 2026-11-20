import { useCallback, useEffect, useState } from 'react';
import { api, obterToken, removerToken } from './api.js';
import Autenticacao from './components/Autenticacao.jsx';
import Cabecalho from './components/Cabecalho.jsx';
import FormVeiculo from './components/FormVeiculo.jsx';
import ListaVeiculos from './components/ListaVeiculos.jsx';
import FormLocacao from './components/FormLocacao.jsx';
import ListaLocacoes from './components/ListaLocacoes.jsx';
import Mensagem from './components/Mensagem.jsx';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(Boolean(obterToken()));
  const [aba, setAba] = useState('veiculos');
  const [mensagem, setMensagem] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false);
  const [locacoes, setLocacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalizandoId, setFinalizandoId] = useState(null);

  const sair = useCallback((aviso) => {
    removerToken();
    setUsuario(null);
    setVeiculos([]);
    setDisponiveis([]);
    setLocacoes([]);
    setAba('veiculos');
    setMensagem(aviso || null);
  }, []);

  const tratarErro = useCallback(
    (erro) => {
      if (erro.status === 401) {
        sair({ tipo: 'erro', texto: 'Sua sessão expirou. Entre novamente.' });
      } else {
        setMensagem({ tipo: 'erro', texto: erro.message });
      }
    },
    [sair]
  );

  useEffect(() => {
    if (!obterToken()) {
      return;
    }

    api
      .perfil()
      .then(setUsuario)
      .catch(() => removerToken())
      .finally(() => setVerificando(false));
  }, []);

  const carregarVeiculos = useCallback(async () => {
    setCarregando(true);
    try {
      const [lista, livres] = await Promise.all([
        api.listarVeiculos(apenasDisponiveis),
        api.listarVeiculos(true)
      ]);
      setVeiculos(lista);
      setDisponiveis(livres);
    } catch (erro) {
      tratarErro(erro);
    } finally {
      setCarregando(false);
    }
  }, [apenasDisponiveis, tratarErro]);

  const carregarLocacoes = useCallback(async () => {
    try {
      setLocacoes(await api.listarLocacoes());
    } catch (erro) {
      tratarErro(erro);
    }
  }, [tratarErro]);

  useEffect(() => {
    if (usuario) {
      carregarVeiculos();
    }
  }, [usuario, carregarVeiculos]);

  useEffect(() => {
    if (usuario) {
      carregarLocacoes();
    }
  }, [usuario, carregarLocacoes]);

  async function finalizar(id) {
    setFinalizandoId(id);
    try {
      await api.finalizarLocacao(id);
      setMensagem({ tipo: 'sucesso', texto: 'Locação finalizada. O veículo está disponível novamente.' });
    } catch (erro) {
      tratarErro(erro);
    } finally {
      setFinalizandoId(null);
      carregarLocacoes();
      carregarVeiculos();
    }
  }

  function trocarAba(novaAba) {
    setAba(novaAba);
    setMensagem(null);
  }

  if (verificando) {
    return <p className="vazio">Verificando sessão...</p>;
  }

  if (!usuario) {
    return (
      <main className="pagina">
        <Mensagem mensagem={mensagem} onFechar={() => setMensagem(null)} />
        <Autenticacao onEntrar={(dados) => { setMensagem(null); setUsuario(dados); }} onMensagem={setMensagem} />
      </main>
    );
  }

  return (
    <>
      <Cabecalho usuario={usuario} aba={aba} onTrocarAba={trocarAba} onSair={() => sair()} />

      <main className="pagina">
        <Mensagem mensagem={mensagem} onFechar={() => setMensagem(null)} />

        {aba === 'veiculos' && (
          <div className="grade">
            <FormVeiculo onCadastrado={carregarVeiculos} onMensagem={setMensagem} />
            <ListaVeiculos
              veiculos={veiculos}
              apenasDisponiveis={apenasDisponiveis}
              onFiltrar={setApenasDisponiveis}
              carregando={carregando}
            />
          </div>
        )}

        {aba === 'locacoes' && (
          <div className="grade">
            <FormLocacao
              veiculosDisponiveis={disponiveis}
              onRegistrada={() => {
                carregarVeiculos();
                carregarLocacoes();
              }}
              onMensagem={setMensagem}
            />
            <ListaLocacoes
              locacoes={locacoes}
              onFinalizar={finalizar}
              finalizandoId={finalizandoId}
              carregando={carregando}
            />
          </div>
        )}
      </main>
    </>
  );
}
