# CLAUDE.md

Contexto do projeto para o Claude Code. Leia isto antes de gerar ou alterar qualquer código.

## O que é o projeto

Marketplace de economia circular universitária (desapego). Estudantes anunciam itens (livros, calculadoras, jalecos, componentes eletrônicos, móveis) para doação ou venda dentro do campus.

Desafio técnico do Processo Seletivo Vortex 2026 (UNIFOR). Prazo de 15 dias. Deve ter: Landing Page pública (desktop) + PWA instalável (mobile) + API RESTful. Todos os requisitos obrigatórios E os bônus devem ser implementados.

## Stack definida (não trocar sem confirmar com o usuário)

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL + JWT + Zod (validação)
- **Frontend**: React + TypeScript + Vite + vite-plugin-pwa
- **Banco local**: PostgreSQL via Docker Compose (só o banco roda em container, API roda nativa com `npm run dev`)
- **Deploy**: API no Railway, Frontend na Vercel

## Estrutura de pastas (seguir exatamente)

```
vortex-marketplace/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── config/env.ts
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   ├── error.middleware.ts
│       │   └── validate.middleware.ts   (genérico, recebe um Zod schema)
│       ├── modules/
│       │   ├── auth/          (auth.controller.ts, auth.service.ts, auth.routes.ts, auth.schema.ts)
│       │   ├── ad/            (ad.controller.ts, ad.service.ts, ad.routes.ts, ad.schema.ts — inclui "meus anúncios")
│       │   ├── categories/    (categories.controller.ts, categories.routes.ts)
│       │   └── stats/         (stats.controller.ts, stats.routes.ts)
│       └── lib/prisma.ts
└── frontend/
    ├── public/manifest.json
    └── src/
        ├── components/{ui,layout}/
        ├── pages/{Landing,Ads,MyAds,NewAd,Login,Register}/
        ├── hooks/{useAuth.ts,useAds.ts}
        ├── services/api.ts
        └── types/index.ts
```

Regra de camadas no backend: **routes** define path + middleware → **validate middleware (Zod)** valida o payload → **controller** trata req/res → **service** contém regra de negócio e fala com o Prisma. Controller nunca acessa o Prisma diretamente. Service nunca conhece `req`/`res`.

## Validação de dados (Zod)

Toda rota que recebe `body` (POST, e futuramente PUT/PATCH se algum dia entrar em escopo) passa por um schema Zod antes de chegar no controller.

- Schemas ficam em `<modulo>.schema.ts` dentro de cada módulo.
- Middleware genérico reutilizável em `middlewares/validate.middleware.ts`, recebe o schema como parâmetro: `validate(createAdSchema)`.
- A regra condicional de negócio do anúncio (`type = 'doacao' → price null` / `type = 'venda' → price obrigatório e > 0`) é implementada com `.refine()` no schema do Zod — não deve ser duplicada como validação manual no service.
- Erro de validação retorna sempre `400` no formato `{ "error": "mensagem" }`, consistente com o padrão de erro do restante da API.
- Tipos TypeScript dos payloads devem ser inferidos do schema via `z.infer<typeof schema>`, não escritos à mão em paralelo.

## Modelo de dados (Prisma schema — respeitar tipos e relações)

**users**: id (UUID, PK), name, email (unique), password_hash, created_at

**categories**: id (serial, PK), name (unique), slug (unique) — seed fixo: livros, engenharia, computacao, quimica, moveis, outros

**ads**: id (UUID, PK), user_id (FK → users, ON DELETE CASCADE), category_id (FK → categories), title, description, type (`'venda'` | `'doacao'`), price (nullable, NUMERIC 10,2), image_url (nullable), created_at

Relação: `users 1—N ads N—1 categories`

**Regra de negócio obrigatória (validar no service, não como CHECK no banco):**
```
type = 'doacao' → price DEVE ser null
type = 'venda'  → price DEVE ser not null e > 0
```

Não criar tabelas fora deste escopo (sem imagens, sem mensagens, sem favoritos) sem confirmação explícita do usuário.

## Rotas da API (contrato fechado — não adicionar/remover sem confirmar)

| Método | Rota | Auth |
|---|---|---|
| POST | `/api/auth/register` | Não |
| POST | `/api/auth/login` | Não |
| GET | `/api/ads` | Não |
| GET | `/api/ads/:id` | Não |
| POST | `/api/ads` | Sim |
| DELETE | `/api/ads/:id` | Sim (só dono) |
| GET | `/api/ads/me` | Sim |
| GET | `/api/categories` | Não |
| GET | `/api/stats` | Não |

Filtros de `GET /api/ads`: `category`, `type`, `search`, `min_price`, `max_price`, `page`, `limit`.

Sem PUT/PATCH — edição de anúncio está fora do escopo do edital.

Deleção é **hard delete** (remove de verdade do banco), não soft delete. Verificação de dono: comparar `user_id` do token JWT com `user_id` do anúncio.

## Requisitos obrigatórios do edital (não podem faltar)

- CRUD completo de anúncios (criar, listar com filtro, deletar)
- Persistência real funcionando (PostgreSQL)
- JSON estrito em request/response
- `manifest.json` válido + Service Worker (app instalável)
- Responsividade completa: Landing Page rica no desktop → experiência de app no mobile

## Requisitos bônus (também devem ser implementados — fazem parte do escopo)

- Autenticação JWT ✅ (já no contrato de rotas acima)
- Validação de campos e tratamento de erros robusto (middleware de erro centralizado)
- PostgreSQL real (não SQLite, não em memória)
- Cache no Service Worker para uso/visualização offline
- TypeScript no frontend
- UI polida: loading states, transições suaves
- Deploy real (Railway + Vercel) com links funcionais no README

## Decisões já tomadas — não reabrir sem pedido explícito do usuário

- Redis **não** entra no escopo. Cache é só client-side via Service Worker.
- Sem soft delete.
- Sem edição de anúncio (PUT/PATCH).
- Categoria é tabela própria, não enum/string livre — necessário para o frontend montar filtros dinamicamente.

## Convenções de código

- Nomes de arquivo: `kebab-case` para não-componentes, `PascalCase` para componentes React.
- Toda variável de ambiente passa por validação em `config/env.ts` (backend) — falhar rápido se faltar alguma.
- Erros da API sempre no formato `{ "error": "mensagem" }`, tratados pelo `error.middleware.ts`.
- Sempre usar Prisma Client via singleton (`lib/prisma.ts`), nunca instanciar `PrismaClient` solto em outros arquivos.

## Diário de Bordo da IA

O usuário deve preencher manualmente o arquivo `DIARIO_DE_BORDO.txt` (raiz do projeto, fora do README.md) com prompts reais usados, ferramentas, e uma reflexão crítica sobre algum erro da IA. Não gerar conteúdo fictício para esse arquivo — é avaliado como prova de autoria. O README.md só referencia o arquivo (`Ver DIARIO_DE_BORDO.txt`), não reproduz o conteúdo. Note que `DIARIO_DE_BORDO.txt` está no `.gitignore` por decisão explícita do usuário — não remover essa entrada sem confirmação.
