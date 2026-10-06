# Where's My Skincare (WMS)

Aplicação web para organizar a rotina de skincare em um só lugar. Com ela, cada pessoa pode cadastrar e acompanhar seus produtos, montar rotinas diurnas e noturnas, salvar procedimentos, favoritar itens e registrar como a pele está a cada dia.

## Funcionalidades

- Cadastro, login e manutenção de sessão de usuários.
- Onboarding para personalizar a experiência inicial.
- Catálogo pessoal de produtos de skincare, com categorias, quantidade, status, data de abertura e validade.
- Cadastro e gerenciamento de rotinas diurnas e noturnas, incluindo observações e histórico por data.
- Atualização automática do status de produtos usados pela primeira vez em uma rotina.
- Favoritos e registro de produtos finalizados.
- Cadastro de procedimentos.
- Registro diário de até dois estados/humores da pele.
- Notificações na interface e feedbacks de ações.
- Interface responsiva, com navegação específica para dispositivos móveis.
- Suporte a PWA, incluindo manifesto, ícones e service worker.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) com App Router |
| Interface | [React 19](https://react.dev/), TypeScript e Tailwind CSS |
| Componentes e estilo | Radix UI, `class-variance-authority`, `clsx`, `tailwind-merge`, Lucide React e `tailwindcss-animate` |
| Animações | Framer Motion |
| Formatação de datas | date-fns |
| Backend e autenticação | Supabase (`@supabase/supabase-js` e `@supabase/ssr`) |
| Notificações | Sonner |
| Qualidade de código | ESLint e TypeScript em modo estrito |
| PWA | Web App Manifest, ícones e service worker |

## Arquitetura e organização

O projeto usa o App Router do Next.js. As rotas ficam em `src/app`, enquanto a lógica reutilizável é separada entre componentes, hooks, serviços, providers, tipos e utilitários.

```text
.
├── public/                     # Imagens, ícones, manifesto e service worker
├── src/
│   ├── app/                    # Rotas, layouts e telas do App Router
│   │   ├── auth/               # Login, cadastro e callback de autenticação
│   │   ├── collection/         # Coleção, produtos, procedimentos e novo produto
│   │   ├── favorites/          # Produtos favoritados
│   │   ├── profile/            # Perfil do usuário
│   │   ├── routines/           # Rotinas e histórico
│   │   ├── layout.tsx          # Layout raiz, fontes, metadata e viewport
│   │   ├── page.tsx            # Página inicial
│   │   └── manifest.ts         # Manifesto PWA gerado pelo Next.js
│   ├── components/
│   │   ├── auth/               # Componentes de autenticação
│   │   ├── collection/         # Componentes da coleção
│   │   ├── home/               # Hero e seções da página inicial
│   │   ├── layout/             # Cabeçalho, navegação e elementos de layout
│   │   ├── modals/             # Modais da aplicação
│   │   ├── routines/           # Componentes das rotinas
│   │   └── ui/                 # Componentes de interface reutilizáveis
│   ├── hooks/                  # Encapsulam estado e operações de domínio
│   ├── lib/                    # Clientes Supabase e funções utilitárias
│   │   └── supabase/           # Clientes client/server e atualização de sessão
│   ├── providers/              # Contextos globais de autenticação e onboarding
│   ├── services/               # Comunicação com o Supabase por domínio
│   └── types/                  # Tipos da aplicação e tipos gerados do banco
├── supabase/
│   ├── migrations/             # Migrações SQL versionadas
│   └── config.toml             # Configuração local do Supabase CLI
├── middleware.ts               # Renovação de sessão nas rotas protegidas
├── tailwind.config.ts          # Configuração do Tailwind
└── package.json                # Dependências e comandos do projeto
```

### Fluxo de dados

1. Os componentes e páginas acionam hooks e serviços conforme a funcionalidade.
2. Os serviços centralizam as consultas e mutações ao Supabase.
3. Os tipos em `src/types/database.types.ts` tipam as tabelas do banco; `src/types/db.ts` expõe aliases de domínio como `Product`, `Routine` e `Profile`.
4. Os providers mantêm os estados globais de autenticação, onboarding e notificações disponíveis para a interface.
5. O `middleware.ts` atualiza a sessão do Supabase nas áreas autenticadas: coleção, favoritos, rotinas e perfil.

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Página inicial e apresentação da aplicação |
| `/auth/login` | Login |
| `/auth/sign-up` | Cadastro de conta |
| `/auth/callback` | Retorno do fluxo de autenticação do Supabase |
| `/collection` | Visão principal da coleção de skincare |
| `/collection/newProduct` | Cadastro de produto |
| `/collection/products` | Listagem e gerenciamento de produtos |
| `/collection/procedures` | Procedimentos cadastrados |
| `/favorites` | Produtos marcados como favoritos |
| `/routines` | Rotinas diurnas/noturnas e histórico |
| `/profile` | Perfil e preferências do usuário |

## Integração com Supabase

O Supabase é usado para autenticação, persistência e controle de acesso aos dados. A aplicação possui clientes separados para navegador e servidor em `src/lib/supabase/`, além de um middleware que preserva a sessão por cookies.

Os principais domínios de dados são:

- `profiles`: informações do perfil do usuário;
- `products`: produtos cadastrados e seus dados de uso;
- `finished_products`: histórico de produtos finalizados;
- `user_routines`: rotinas salvas por período e data;
- `procedures`: procedimentos de skincare;
- `skin_moods`: registro diário do estado da pele;
- notificações e dados de onboarding, quando aplicável.

As migrações SQL ficam em `supabase/migrations`. A migração mais recente adiciona observações às rotinas e há uma regra de unicidade para limitar o registro de estado da pele a uma entrada diária por usuário.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior.
- npm (ou outro gerenciador compatível). O repositório contém `bun.lock`, portanto o Bun também pode ser usado se for o padrão do time.
- Um projeto Supabase configurado, com o schema e as políticas de acesso necessários.

## Instalação e execução local

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd wms
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env.local` na raiz do projeto:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```

4. Aplique as migrações em `supabase/migrations` ao banco Supabase correspondente.

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Abra [http://localhost:3000](http://localhost:3000) no navegador.

> O arquivo `.env.local` é ignorado pelo Git e não deve ser versionado. Nunca exponha chaves sensíveis em commits, issues ou documentação pública.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento com hot reload |
| `npm run build` | Gera a build de produção |
| `npm run start` | Inicia a aplicação a partir da build de produção |
| `npm run lint` | Executa a verificação do ESLint |

Para testar a build de produção localmente:

```bash
npm run build
npm run start
```

## Convenções do projeto

- Use TypeScript e o alias `@/` para imports a partir de `src`.
- Mantenha operações com dados dentro de `src/services` e reutilize hooks para lógica de interface/estado.
- Crie componentes reutilizáveis em `src/components/ui` e agrupe os específicos de uma funcionalidade em sua pasta de domínio.
- Adicione mudanças de schema como novas migrações em `supabase/migrations`; não altere migrações já aplicadas em ambientes compartilhados.
- Verifique o lint antes de abrir um pull request:

  ```bash
  npm run lint
  ```

## Deploy

Por ser uma aplicação Next.js, o projeto pode ser publicado na Vercel ou em qualquer ambiente compatível com Node.js. No ambiente de produção, configure as mesmas variáveis abaixo:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Também garanta que as URLs de redirecionamento de autenticação estejam cadastradas nas configurações do Supabase para o domínio de produção.

## Licença

Este projeto não possui uma licença declarada no repositório. Antes de reutilizar ou distribuir o código, alinhe a licença com a autoria do projeto.
