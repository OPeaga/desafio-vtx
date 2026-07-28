# Desapega UNIFOR — Economia Circular Universitária

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
- Tailwind CSS v4
- Vite PWA Plugin (manifest + Service Worker via Workbox, ícones gerados via `@vite-pwa/assets-generator`)

**Deploy**
- API: Railway
- Frontend: Vercel

---

## Arquitetura

```
desafio-vtx/
├── .env / .env.example   → variáveis compartilhadas por backend e frontend
├── docker-compose.yml
├── backend/     → API RESTful (Express + Prisma)
└── frontend/    → PWA (React + Vite)
```

Backend organizado por módulos (`auth`, `ad`, `categories`, `stats`), cada um separando `routes` (endpoints), `controller` (request/response) e `service` (regra de negócio + acesso ao banco). "Meus anúncios" vive dentro do próprio módulo `ad` (`GET /api/ads/me`).

O `.env` fica centralizado na raiz do monorepo (não em `backend/` nem `frontend/` separadamente): o backend lê via `dotenv.config` apontando pra raiz e o frontend via `envDir` configurado no `vite.config.ts`.

---

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- npm

### 1. Variáveis de ambiente

Na raiz do projeto:

```bash
cp .env.example .env
```

O mesmo `.env` na raiz é lido tanto pelo backend quanto pelo frontend (ver seção Arquitetura).

### 2. Subir o banco de dados

Ainda na raiz:

```bash
docker compose up -d
```

Isso sobe um container PostgreSQL em `localhost:5432`.

### 3. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

API disponível em `http://localhost:3333`. O seed popula as 6 categorias fixas, 4 usuários de teste (`lucas@unifor.br`, `mariana@unifor.br`, `beatriz@unifor.br`, `matheus@unifor.br`, todos com senha `Senha123`) e 12 anúncios de exemplo.

### 4. Frontend

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
| GET | `/api/ads` | Lista pública (filtros: category, type, search, min_price, max_price, page, limit) | Não |
| GET | `/api/ads/:id` | Detalhe do anúncio | Não |
| POST | `/api/ads` | Cria anúncio | Sim |
| DELETE | `/api/ads/:id` | Remove anúncio (só dono) | Sim |
| GET | `/api/ads/me` | Anúncios do usuário logado | Sim |
| GET | `/api/categories` | Lista categorias | Não |
| GET | `/api/stats` | Estatísticas da landing page | Não |

---

## Links em produção

Deploy previsto para 27/07 (ainda não realizado). Backend, frontend e PWA estão completos e rodando localmente; falta apenas publicar.

- API: `https://backend-production-6dcdb.up.railway.app/`
- Frontend: `https://desafio-vtx.vercel.app/`

---

## Diário de Bordo da IA

### Ferramentas utilizadas
1. `Claude Code e Claude Web`
2. `Antigravity IDE - Gemini`

### Estratégia de Engenharia de Prompts

Exemplos reais de prompts utilizados durante o desenvolvimento:

1. `como que ele valida que está correto? explique com exemplo`
2. `Leia o arquivo PDF, vamos listar os pontos chaves e pontuar o que será feito. Tudo, inclusive os desafios bonus devem ser realizados. `
3. `Isso aí, você será repsponsável por criar as páginas e bater o martelo na estilização final. Comece revisando o que já está feito, em seguida, faremos as telas, e por último, iremos implementar essa paleta de cores: em frontend\public\site-palette.svg `

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
