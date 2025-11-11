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

---

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

---

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
---

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