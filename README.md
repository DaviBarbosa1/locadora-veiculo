# Sistema de Locação de Veículos

Aplicação web full stack para uma locadora: cadastro e listagem de veículos, controle de disponibilidade e registro, consulta e finalização de locações por usuários autenticados.

## Integrantes

- José davi barbosa de Araújo 

## Tecnologias

- Backend: Node.js, Express, Prisma ORM, MySQL, JWT, bcrypt
- Frontend: React com Vite e fetch

## Funcionalidades

- Cadastro e login de usuários, com senha armazenada como hash bcrypt e token JWT
- Cadastro de veículos com placa única e valor de diária positivo
- Listagem de veículos com filtro de disponibilidade
- Registro de locação com valor total calculado no backend (qualquer fração de 24 horas conta como diária completa)
- Histórico de locações do usuário autenticado e finalização da locação
- Controle de acesso: cada usuário só consulta e finaliza as próprias locações
- Consistência em requisições simultâneas por meio de transação e atualização condicional da disponibilidade

## Requisitos

- Node.js 18 ou superior
- MySQL 8 em execução
- npm

## Estrutura

```
backend/
  prisma/            schema.prisma, migrations e seed
  src/routes/        mapeamento dos endpoints
  src/controllers/   entrada e resposta HTTP
  src/services/      validações e regras de negócio
  src/middlewares/   autenticação JWT e tratamento de erros
frontend/
  src/components/    componentes React
  src/api.js         integração com a API
```

## Instalação e execução

### 1. Banco de dados

Crie o banco no MySQL:

```sql
CREATE DATABASE locadora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com a `DATABASE_URL` do seu MySQL e um `JWT_SECRET` longo e aleatório. Depois:

```bash
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run dev
```

A API fica em `http://localhost:3333`.

O comando `npm run seed` cria o usuário `demo@locadora.com` (senha `123456`) e cinco veículos de exemplo.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A interface fica em `http://localhost:5173`.

## Endpoints

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| POST | /auth/registrar | pública | Cadastra usuário |
| POST | /auth/login | pública | Retorna token JWT e dados do usuário |
| GET | /auth/perfil | JWT | Dados do usuário autenticado |
| POST | /veiculos | JWT | Cadastra veículo |
| GET | /veiculos | JWT | Lista veículos (`?disponivel=true` filtra) |
| GET | /veiculos/disponiveis | JWT | Lista apenas veículos disponíveis |
| POST | /locacoes | JWT | Registra locação |
| GET | /locacoes | JWT | Lista as locações do usuário, com histórico |
| GET | /locacoes/:id | JWT | Consulta uma locação própria |
| PATCH | /locacoes/:id/finalizar | JWT | Finaliza uma locação própria |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.

Corpo de `POST /locacoes`:

```json
{
  "veiculoId": 1,
  "dataInicio": "2026-11-20T10:00:00.000Z",
  "dataPrevistaDevolucao": "2026-11-22T11:00:00.000Z"
}
```

## Códigos HTTP

- 400: dados inválidos
- 401: token ausente, inválido ou credenciais incorretas
- 403: locação pertence a outro usuário
- 404: veículo ou locação inexistente
- 409: e-mail ou placa duplicados, veículo indisponível, locação já finalizada
- 500: erro interno

## Decisões de projeto

- O usuário de cada locação vem sempre do token JWT, nunca do corpo da requisição.
- O veículo é reservado com `updateMany` condicionado a `disponivel: true` dentro de uma transação; apenas uma requisição concorrente obtém `count = 1`, a outra recebe 409.
- A finalização usa `updateMany` condicionado a `status: ATIVA`, impedindo finalização dupla.
- Veículos e locações não são excluídos, preservando o histórico.
- O hash da senha nunca é retornado: as consultas usam `select` sem o campo `senha`.
- Os arquivos `.env` não são versionados; use `.env.example` como modelo.
