# TODO — Vortex Marketplace

Prazo: tudo finalizado até **25/07**, testado e deployado até **27/07**.

## 22/07 — Backend: fundação

- [x] Scaffold do projeto: `package.json`, `tsconfig.json`, `docker-compose.yml`, `.env.example`
- [x] `config/env.ts` (leitura simples, sem Zod — Zod fica só pra validação de requisições)
- [x] `lib/prisma.ts` (singleton do Prisma Client, com adapter `@prisma/adapter-pg`)
- [x] `middlewares/error.middleware.ts`
- [x] `middlewares/validate.middleware.ts` (genérico, recebe schema Zod)
- [x] `prisma/schema.prisma` (users, categories, ads)
- [x] `prisma/seed.ts` (categorias fixas: livros, engenharia, computacao, quimica, moveis, outros)
- [x] Módulo `auth`: `auth.schema.ts` (Zod)
- [x] Módulo `auth`: `auth.service.ts` (register, login, hash de senha, geração de JWT)
- [x] Módulo `auth`: `auth.controller.ts`
- [x] Módulo `auth`: `auth.routes.ts`

## 23/07 — Backend: domínio principal

- [x] Módulo `ad`: `ad.schema.ts` com `.refine()` (venda → price obrigatório > 0 / doação → price null)
- [x] Módulo `ad`: `ad.service.ts` (criar, listar com filtros, detalhe, deletar)
- [x] Módulo `ad`: `ad.controller.ts` e `ad.routes.ts`
- [x] Filtros de `GET /api/ads`: category, type, search, min_price, max_price, page, limit
- [x] Validação de dono no delete (comparar `user_id` do JWT com o do anúncio)
- [x] `middlewares/auth.middleware.ts` (proteção das rotas privadas)
- [x] `GET /api/ads/me` dentro do próprio módulo `ad`
- [x] Módulo `categories`: `categories.controller.ts` e `categories.routes.ts` (só GET básico, listar todas)
- [x] Módulo `stats`: `stats.controller.ts` e `stats.routes.ts`
- [x] Testar todas as rotas manualmente contra o contrato fechado (auth + ad já testados via curl)

## 24/07 — Frontend: scaffold + páginas core

- [ ] Scaffold Vite + React + TS + `vite-plugin-pwa`
- [ ] `public/manifest.json`
- [ ] `services/api.ts`
- [ ] `types/index.ts`
- [ ] `hooks/useAuth.ts`
- [ ] `hooks/useAds.ts`
- [ ] Página `Login`
- [ ] Página `Register`
- [ ] Página `Ads` (com filtros)
- [ ] Página `NewAd`
- [ ] Integração real com a API (sem mock)

## 25/07 — Frontend: Landing + PWA + polish (tudo finalizado)

- [ ] Landing Page rica (desktop) consumindo `/api/stats`
- [ ] Página `MyAds`
- [ ] Responsividade completa desktop → mobile
- [ ] Service Worker com cache para uso offline
- [ ] App instalável (PWA funcional de verdade)
- [ ] Loading states e transições suaves
- [ ] Checklist final: todos os requisitos obrigatórios implementados
- [ ] Checklist final: todos os requisitos bônus implementados

## 26/07 — Bateria de testes

- [ ] QA manual ponta a ponta: cadastro → login → criar anúncio → filtrar → deletar
- [ ] Teste de instalação do PWA no mobile
- [ ] Teste de comportamento offline (Service Worker)
- [ ] Ajuste de bugs encontrados
- [ ] Revisão final de responsividade

## 27/07 — Deploy + fechamento (finalizado e testado)

- [ ] Deploy backend no Railway (variáveis de ambiente em produção)
- [ ] Deploy frontend na Vercel
- [ ] Smoke test em produção (todas as rotas + PWA)
- [ ] Atualizar README com links de produção
- [ ] Preencher "Diário de Bordo da IA" no README (feito pelo usuário)

## Backlog / Bônus (fora do prazo principal, implementar se sobrar tempo)

- [ ] Slug no model `Ad` para URLs amigáveis no frontend (`/anuncios/livro-de-calculo-3f9a2b` em vez do UUID cru). Plano detalhado salvo em `C:\Users\Lorde\.claude\plans\delegated-booping-scott.md`: campo `slug` único gerado no `ad.service.ts` (`slugify(title) + "-" + crypto.randomUUID().slice(0,6)`), `GET /api/ads/:id` passa a aceitar id OU slug no mesmo parâmetro.
- [ ] Padrão Repository para acesso a dados: introduzir uma camada `repositories/` (ex.: `ad.repository.ts`, `user.repository.ts`, `category.repository.ts`) entre os `services` e o Prisma, isolando queries do Prisma Client em métodos de repositório (`findById`, `findMany`, `create`, `delete` etc.). Services passam a depender dos repositories em vez de chamar `prisma.*` diretamente. Objetivo: desacoplar regra de negócio de acesso a dados e facilitar troca de ORM/mock em testes.
