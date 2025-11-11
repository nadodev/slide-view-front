# 🎨 Aurea Design System

**Padronização, excelência e identidade nos ambientes digitais da Unoesc**

> Componentes, tokens e documentação para construir experiências consistentes 
> em qualquer produto.

---

### **Sobre o Áurea**

O Áurea é o design system oficial da Unoesc, criado para promover consistência, eficiência e acessibilidade em todos os produtos digitais da universidade. Inspirado na proporção áurea — símbolo clássico de harmonia e equilíbrio — este sistema traduz visualmente os valores da instituição: excelência, inovação e compromisso com a formação humana e acadêmica.

Mais do que um conjunto de componentes reutilizáveis, o Áurea é uma linguagem compartilhada entre designers, desenvolvedores e comunicadores. Ele padroniza estilos, comportamentos e interações, garantindo uma experiência coesa para estudantes, professores, colaboradores e comunidade externa.

Ao adotar o Áurea, projetamos juntos um ecossistema digital mais intuitivo, funcional e alinhado à identidade e missão da Unoesc.

- 🎨 Design Tokens (cores, tipografia, espaçamentos)
- ⚛️ Componentes React
- 📚 Documentação via Storybook
- 🔧 Scripts/CLI de automação

## Casos de uso

- Criar protótipos rapidamente usando componentes prontos
- Padronizar formulários e estados de erro/feedback
- Habilitar tema claro/escuro sem reescrever estilos

## Métricas que buscamos

- Reduzir retrabalho visual e divergências de UI
- Aumentar reuso de código e velocidade de entrega

----'----

# 🔍 Contexto e Problema

Desafios que motivaram o projeto:

- 🎨 Inconsistência visual entre produtos
- ⏱️ Retrabalho constante de elementos básicos
- 🔄 Manutenção difícil

## Impactos no dia a dia

- Dificulta o trabalho de QA e aumenta bugs visuais
- Onboarding mais lento (cada projeto com padrão diferente)
- Decisões repetidas: “qual azul usar?”, “qual espaçamento?”

## O que o DS resolve

- Define um vocabulário comum (tokens, componentes, guidelines)
- Centraliza evolução e manutenção
- Garante consistência de UI/UX entre produtos

----'----
# 🎨 O que é um Design System?

> Sistema de padrões de design, componentes reutilizáveis e standards de desenvolvimento para construir produtos consistentes e escaláveis.

Analogia com LEGO:

- 🎨 Design Tokens → "tintas e cores padronizadas"
- 🧱 Componentes → "peças de LEGO"
- 📚 Documentação → "manual de instruções"
- 📏 Guidelines → "regras de montagem"

## Elementos essenciais

- Design tokens: base para identidade visual (cores, tipografia, espaçamentos)
- Biblioteca de componentes: blocos reutilizáveis e acessíveis
- Documentação: exemplos, API, boas práticas
- Processos: versionamento, contribution, revisão e publicação

----'----

## 🏗️ Visão Geral da Arquitetura

**Monorepo** baseado em **Turborepo** com múltiplos pacotes especializados, cada um com responsabilidades bem definidas e interdependências gerenciadas.

## Monorepo com Turborepo
Estrutura unificada para desenvolvimento, versionamento e distribuição do Design System.

```bash
    aurea-design-system/
    ├── 🐳 builds/          # Dockerfiles e configurações de container
    ├── 📦 packages/        # Pacotes principais do sistema
    ├── 🔧 scripts/         # Automação e CI/CD
    └── 📚 docs/            # Documentação técnica
```

🎯 **Por que Monorepo?**

1. **Compartilhamento fácil entre pacotes**
2. **Versionamento sincronizado**
3. **Cache inteligente com Turborepo**
4. **Dependências centralizadas**

🏛️ **Visão Geral da Arquitetura**

## O que é um Monorepo?

Estrutura que consolida múltiplos pacotes em um único repositório, com interdependências gerenciadas e builds otimizados.

#### Como o Turborepo ajuda?
Ferramenta da Vercel que orquestra e acelera monorepos através de:

1. **Build caching inteligente**
2. **Dependency graph awareness**
3. **Parallel execution de tarefas**
4. **Incremental builds**

----

## 📦 Estrutura Detalhada de Pacotes

```
05-design-system/
├── 📁 packages/
│   ├── 🎨 tokens/                 # Design Tokens (Style Dictionary)
│   │   ├── figma/                 # Fonte: exports do Figma
│   │   │   ├── primitives.json    # Cores base, tipografia
│   │   │   ├── semantics.json     # Tokens semânticos
│   │   │   ├── dark.json          # Overrides para tema escuro
│   │   │   └── components.json    # Tokens específicos de componentes
│   │   ├── scripts/               # Build pipeline personalizado
│   │   │   └── build-tokens.mjs   # Style Dictionary + otimizações
│   │   ├── src/                   # Templates e transformers
│   │   └── dist/                  # 🎯 Output: CSS + JS + TS
│   │       ├── css/
│   │       │   ├── styles.css     # Tokens base
│   │       │   ├── light-theme.css
│   │       │   └── dark-theme.css
│   │       ├── js/tokens.js       # Para JS vanilla
│   │       └── index.d.ts         # Types para TS
│   │
│   ├── ⚛️ react/                  # Biblioteca de Componentes
│   │   ├── src/
│   │   │   ├── components/        # Componentes React
│   │   │   │   ├── Badge/
│   │   │   │   │   ├── Badge.tsx
│   │   │   │   │   ├── Badge.styles.ts  # Stitches + tokens
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts       # Barrel exports
│   │   │   ├── styles/            # Sistema de temas
│   │   │   │   ├── stitches.config.ts
│   │   │   │   └── ThemeProvider.tsx
│   │   │   └── utils/             # Helpers e utilities
│   │   ├── dist/                  # 🎯 Output: ESM + CJS + Types
│   │   └── package.json           # @aurea/react
│   │
│   ├── 📚 docs/                   # Storybook + Documentação
│   │   ├── .storybook/            # Config do Storybook
│   │   │   ├── main.ts            # Addons e configurações
│   │   │   ├── manager.js         # UI customizations
│   │   │   └── preview.ts         # Global decorators
│   │   ├── src/
│   │   │   ├── stories/           # Stories + MDX docs
│   │   │   │   ├── *.stories.tsx  # Component stories
│   │   │   │   └── *.mdx          # Documentation pages
│   │   │   └── components/        # Componentes para docs
│   │   │       └── ColorPalette.tsx
│   │   └── dist/                  # 🎯 Build estático do Storybook
│   │
│   ├── 🔧 eslint-config/          # Linting compartilhado
│   │   ├── index.js               # Regras ESLint + Prettier
│   │   └── package.json           # @aurea/eslint-config
│   │
│   └── 📝 ts-config/              # TypeScript configs
│       ├── base.json              # Config base
│       ├── react.json             # Para pacotes React
│       └── package.json           # @aurea/ts-config
│
├── 📜 scripts/                    # Automação
│   ├── version.js                # Versionamento semântico
│   └── publish.js                # Deploy para Nexus
│
├── 📋 docs/notion/               # Documentação estruturada
└── 🔧 Root configs               # Turbo, Git, npm
    ├── turbo.json                # Build pipeline
    ├── package.json              # Workspaces + scripts
    └── .npmrc                    # Registry configuration
```

----

## 🔄 Fluxos de Desenvolvimento

### **1. Pipeline de Design Tokens**

```
Figma → JSON Export → Style Dictionary → CSS/JS/TS → Componentes
   ↓          ↓             ↓              ↓            ↓
Design   figma/*.json    Transform     dist/       @aurea/react
```
### **2. Desenvolvimento de Componentes
```
Token Update → Component Update → Story Update → Test → Publish
     ↓             ↓               ↓           ↓       ↓
 @aurea/tokens  Component.tsx   Stories    Chromatic  npm
```


**Processo detalhado:**
1. **Figma** → Designer atualiza tokens
2. **Export** → `figma/*.json` (primitives, semantics, dark, components)
3. **Build** → `npm run build:css` processa via Style Dictionary
4. **Transform** → Aplica filtros por tema, otimizações CSS
5. **Output** → CSS Custom Properties, JS objects, TS types
6. **Consume** → Componentes React importam automaticamente
----

## 🛠️ Stack Tecnológico

### **Core Technologies**

| Tecnologia | Versão | Propósito | Configuração |
| --- | --- | --- | --- |
| **Node.js** | 18+ LTS | Runtime JavaScript | `.nvmrc` |
| **TypeScript** | ^5.0 | Type safety | `tsconfig.json` |
| **Turborepo** | ^1.10 | Monorepo orchestration | `turbo.json` |
| **React** | ^18.0 | Component library | JSX, hooks |
| **Styled-components** | ^1.2 | CSS-in-JS styling | Theme-aware |

### **Design & Build**

| Tool | Purpose | Configuration |
| --- | --- | --- |
| **Style Dictionary** | Token transformation | `build-tokens.mjs` |
| **Storybook** | Component documentation | `.storybook/` |
| **Vite** | Build tool | Fast HMR, optimized builds |
| **ESLint** | Code linting | Shared config |
| **Prettier** | Code formatting | Consistent style |

### **Infrastructure**

| Service | Purpose | Environment |
| --- | --- | --- |
| **Jenkins** | CI/CD pipeline | Docker container |
| **Nexus Repository** | npm registry | Internal hosting |
| **Git** | Version control | Branch protection |
| **Docker** | Containerization | Dev environment |

---

## 🔗 Interdependências

### **Build Dependencies**

```
@aurea/tokens (base)
    ↓
@aurea/react (consumes tokens)
    ↓
@aurea/docs (documents components)
    ↓
Published packages (distributed)
```

### **Development Dependencies**

```
@aurea/eslint-config → All packages (linting)
@aurea/ts-config → All packages (TypeScript)
Root scripts → All packages (versioning, publishing)
```

### **Runtime Dependencies**

```
React apps → @aurea/react + @aurea/tokens
Vanilla JS → @aurea/tokens only
Documentation → Storybook build
```

----'----

# 🛠️ Tecnologias e Ferramentas

Stack técnica:

- Node.js 22+
- TypeScript 5+
- React 18+
- Turborepo
- Vite
- Style Dictionary

DevOps e automação:

- 🐳 Docker
- 🔄 Jenkins
- 📦 Nexus
- 🦊 GitLab

## Por que essas escolhas

- Vite/Turborepo: DX rápida e builds otimizados
- TypeScript: segurança de tipos para API de componentes
- Style Dictionary: múltiplos formatos de tokens (CSS, TS, JSON)
- Jenkins + Docker: pipeline reproduzível e previsível

----'----

# ⚛️ Componentes React

Características:

- 🔷 TypeScript (tipagem forte)
- 🎨 CSS-in-JS / estilos base
- 🌙 Temas (claro/escuro)
- ♿ Acessibilidade (ARIA, teclado)
- 📱 Responsivo

Exemplos disponíveis: `Button`, `Card`, `Alert`, `Typography`, `ThemeProvider`.

## Princípios de implementação

- Propriedades tipadas e documentadas (limita erro de uso)
- Estilos desacoplados por tokens (tema claro/escuro)
- Acessibilidade: roles/ARIA, foco visível, navegação por teclado

## Exemplo de uso
```bash
npm install  @unoescaurea/react

```

```tsx
import { Button, ThemeProvider } from '@unoescaurea/react';

<ThemeProvider theme="light">
  <Button variant="primary" onClick={() => alert('Aurea!')}>Salvar</Button>
</ThemeProvider>
```
----'----

# 📖 Storybook

Documentação interativa dos componentes:

- 🎮 Playground em tempo real
- 📚 Exemplos de uso e API
- 🧪 Testes visuais e acessibilidade
- 🌗 Temas claro/escuro

Acesso (dev): `https://aurea.unoesc.edu.br:6006`

## Como usar no dia a dia

- Desenvolva componentes guiado por stories (props, variações, edge cases)
- Use controles para validar estados (loading, disabled, erro)
- Documente exemplos reais para consumo pelos times

----'----

# 🔄 Fluxo de Desenvolvimento

1. Criar branch (feature) a partir de `master`
2. Desenvolver com commits semânticos
3. MR para `teste` e validação
4. Versionar na feature (patch/minor/major)
5. MR para `master`
6. Jenkins: build/deploy/publicação no Nexus

----'----

# 🏷️ Versionamento Semântico

Formato: `MAJOR.MINOR.PATCH` (ex.: `1.2.3`)

Quando usar:

- PATCH → correções de bugs
- MINOR → novas funcionalidades compatíveis
- MAJOR → mudanças incompatíveis (breaking changes)

Comandos (root):

```bash
npm run version:dev
npm run version:patch
npm run version:minor
npm run version:major
```

## Como decidir o bump

- `patch`: correções e ajustes sem impacto de API
- `minor`: novas props/funcionalidades backward-compatible
- `major`: remove/renomeia props, muda contrato visual/comportamental

----'----

# 🐳 Docker (Dev)

Arquivos:

- `builds/Dockerfile`
- `builds/docker-compose-dev.yml`

Comandos principais:

```bash
docker compose -f builds/docker-compose-dev.yml build --no-cache
docker compose -f builds/docker-compose-dev.yml up -d
docker compose -f builds/docker-compose-dev.yml logs -f --tail=100 aurea-storybook-dev
```

Vantagens: ambiente idêntico, isolamento, setup rápido, pronto para prod.

## Dicas de porta e healthcheck

- Porta interna do Storybook: `6006`
- Prefira mapear `6006:6006` para previsibilidade
- Healthcheck coerente com a porta interna


----'----

# 🎯 Benefícios

- ⚡ Velocidade: até 70% mais rápido para criar telas
- 🎨 Consistência: 100% alinhado com a identidade visual
- 🔧 Manutenção: atualizações centralizadas
- 📚 Documentação: Storybook como fonte de verdade
- 👥 Onboarding: novos devs produtivos rapidamente
- ♿ Acessibilidade embutida

## Impacto esperado

- Menos bugs visuais e retrabalho
- Mais previsibilidade entre projetos
- Entregas mais rápidas e consistentes

----'----

# 🚀 Próximos Passos

Curto prazo (1-3 meses):
- Novos componentes: Input, Select, Checkbox, Radio, Modal
- Tema escuro completo
- Testes automatizados (80%+)

Médio prazo (3-6 meses):
- Componentes complexos: Table, Pagination, DatePicker
- Integração Figma → código
- Migração gradual nos projetos

Longo prazo (6-12 meses):
- DS v2 (tokens avançados, animações)
- Suporte mobile (React Native)
- Comunidade interna de contribuições

## Critérios de pronto

- Componentes com documentação, testes e exemplos
- Tokens revisados por design + dev
- Roadmap publicado no repositório

