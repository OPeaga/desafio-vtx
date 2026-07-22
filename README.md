# Vortex Marketplace — Economia Circular Universitária

Plataforma de desapego universitário. Permite que estudantes anunciem itens (livros, calculadoras, jalecos, componentes, móveis) para doação ou venda dentro do campus, facilitando o acesso a materiais para quem está ingressando na universidade.

Projeto desenvolvido para o Processo Seletivo Vortex 2026 (Laboratório de Inovação Vortex — UNIFOR).

---

## Stack

**Backend**
- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod (validação de dados)
- JWT (autenticação)
- Docker Compose (banco local)

**Frontend**
- React + TypeScript
- Vite
- Vite PWA Plugin (manifest + Service Worker)

**Deploy**
- API: Railway
- Frontend: Vercel

---

## Arquitetura

```
vortex-marketplace/
├── docker-compose.yml
├── backend/     → API RESTful (Express + Prisma)
└── frontend/    → PWA (React + Vite)
```

Backend organizado por módulos (`auth`, `listings`, `users`, `categories`, `stats`), cada um separando `routes` (endpoints), `controller` (request/response) e `service` (regra de negócio + acesso ao banco).

---

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- npm

### 1. Subir o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe um container PostgreSQL em `localhost:5432`.

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

API disponível em `http://localhost:3333`.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`.

---

## Endpoints principais

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Cria conta | Não |
| POST | `/api/auth/login` | Login, retorna JWT | Não |
| GET | `/api/listings` | Lista pública (filtros: category, type, search, min_price, max_price) | Não |
| GET | `/api/listings/:id` | Detalhe do anúncio | Não |
| POST | `/api/listings` | Cria anúncio | Sim |
| DELETE | `/api/listings/:id` | Remove anúncio (só dono) | Sim |
| GET | `/api/users/me/listings` | Anúncios do usuário logado | Sim |
| GET | `/api/categories` | Lista categorias | Não |
| GET | `/api/stats` | Estatísticas da landing page | Não |

---

## Links em produção

- API: `<preencher após deploy>`
- Frontend: `<preencher após deploy>`

---

## Diário de Bordo da IA

### Ferramentas utilizadas
`<preencher: ex. Claude, GitHub Copilot, etc.>`

### Estratégia de Engenharia de Prompts

Exemplos reais de prompts utilizados durante o desenvolvimento:

1. `<colar prompt real 1>`
2. `<colar prompt real 2>`
3. `<colar prompt real 3>`

### Compartilhamento de histórico (opcional)
`<link de conversa longa de desenvolvimento, se aplicável>`

### Reflexão crítica

Durante a criação do `config/env.ts`, o Claude Code adicionou validação das variáveis de ambiente com Zod — algo que não estava no levantamento de requisitos do edital, que restringe o uso do Zod à validação do `body` das requisições da API. Foi um caso de over-engineering: a IA generalizou um padrão (validação com Zod) para um contexto onde ele não havia sido pedido.

O erro foi identificado na revisão do escopo e corrigido com o seguinte prompt:

> Não era necessário validar as envs com zod, remova essa validação, vamos nos restringir somente às requisições como mostra no levantamento de requisitos.

A IA reverteu o arquivo para uma checagem simples (`if (!process.env.X) throw new Error(...)`), mantendo o Zod apenas nos schemas de validação de requisição (`auth.schema.ts`, `listings.schema.ts`), como definido no escopo do projeto.

---

## Licença

Projeto acadêmico — Processo Seletivo Vortex 2026.
