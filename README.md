# PM SHOW — Frontend

App em Next.js 16 (App Router) da banda PM SHOW (Polícia Militar de Goiás), com
arquitetura **BFF**: o navegador só conversa com este app. Os Server Components
e as rotas `/api/*` chamam a API **GraphQL** do backend NestJS de servidor
para servidor, enviando a `INTERNAL_API_KEY` e o token do usuário. O plano
completo está em [`../PLANO.md`](../PLANO.md).

```
Navegador ──(cookie httpOnly)──▶ Next.js BFF ──(X-Internal-Api-Key + Bearer, POST /graphql)──▶ API NestJS
```

## Estrutura

```
src/
├── app/                    rotas (App Router), ícones gerados e manifest do PWA
├── server/                 BFF — "server-only" (segredos nunca vão ao bundle do cliente)
│   ├── config/env.ts       variáveis validadas com zod
│   ├── graphql/            client.ts (backendGraphql), operations/*, generated/ (codegen)
│   ├── http/               erros do backend e wrapper das rotas (CSRF por origem)
│   ├── auth/session.ts     cookie de sessão httpOnly
│   └── services/           casos de uso do BFF por domínio
├── features/               módulos de UI por domínio (components, hooks, api, model)
├── design-system/          tokens + componentes agnósticos ao domínio
└── shared/                 contratos do BFF e utilitários puros
```

O lint impõe as camadas: o `design-system` não importa `features` nem
`server`, e componentes de feature não importam `server`.

## GraphQL tipado

1. No backend: `npm run schema:generate` (gera `src/graphql/schema.gql`).
2. Aqui: `npm run schema:sync` (copia para `schema/schema.gql`; aceita
   `BACKEND_DIR`).
3. Escreva a operação com `graphql(...)` em `src/server/graphql/operations/`.
4. `npm run codegen`: gera os tipos em `src/server/graphql/generated/`.
5. Use com `backendGraphql(documento, { variables, token })`. O resultado e as
   variáveis já vêm tipados, e erros viram `BackendError` com o `code` do backend.

O CI falha se os tipos gerados estiverem desatualizados (`npm run codegen:check`).

## Design system

- Os tokens semânticos ficam em `src/app/globals.css` (azul-marinho
  institucional + dourado da banda) e são expostos ao Tailwind v4 via `@theme`.
  Os componentes usam classes de intenção (`bg-surface`, `text-muted`), nunca
  cores cruas.
- Os temas claro e escuro seguem a preferência do sistema.
- A marca (escudo + nota musical) está definida em
  `features/layout/model/brand-mark.ts`; o logo e os ícones do PWA são gerados
  a partir dela.

## Segurança

- A sessão fica num cookie `httpOnly` + `SameSite=Lax` (+ `Secure` em produção).
- As rotas de mutação do BFF rejeitam requisições de outra origem (CSRF).
- Nenhuma variável é `NEXT_PUBLIC_`. A `INTERNAL_API_KEY` só existe no servidor.
- App privado: `robots.txt` bloqueia tudo e nenhuma página é indexável.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # BACKEND_URL e INTERNAL_API_KEY (a mesma do backend)
npm run dev                  # http://localhost:3000
```

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm run schema:sync` · `npm run codegen`
