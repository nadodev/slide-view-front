# 🏗️ Arquitetura do Projeto SlideMD

Este documento descreve a nova arquitetura do projeto, preparada para escalar e integrar com API Laravel.

## 📁 Estrutura de Pastas

```
src/
├── core/                    # Núcleo da aplicação (reutilizável)
│   ├── api/                 # Camada de API
│   │   ├── http-client.ts   # Cliente HTTP abstrato
│   │   └── repositories/    # Padrão Repository
│   ├── config/              # Configurações centralizadas
│   ├── hooks/               # Hooks de negócio
│   ├── types/               # Types e interfaces
│   └── utils/               # Utilitários puros
│
├── components/              # Componentes React reutilizáveis
│   ├── editor/              # Componentes do editor
│   ├── presentation/        # Componentes de apresentação
│   └── slides/              # Componentes de slides
│
├── pages/                   # Páginas/Rotas (feature-based)
│   ├── Editor/
│   ├── Landing/
│   └── Presentation/
│
├── services/                # Services legados (migrar para core/api)
├── stores/                  # Zustand stores
├── hooks/                   # Hooks de UI (migrar para features)
└── shared/                  # Componentes UI compartilhados
```

## 🔄 Padrões de Código

### 1. Tipos Centralizados

```typescript
// ✅ CORRETO: Importar de @core
import { Slide, MarkdownFile, RemoteCommand } from '@core';

// ❌ INCORRETO: Definir tipos inline ou em arquivos separados
type Slide = { name: string; ... }
```

### 2. Configurações

```typescript
// ✅ CORRETO: Usar constantes centralizadas
import { EDITOR_CONFIG, ERROR_MESSAGES } from '@core';

const delimiter = EDITOR_CONFIG.DEFAULT_DELIMITER;

// ❌ INCORRETO: Valores hardcoded
const delimiter = "----'----";
```

### 3. Utilitários de Markdown

```typescript
// ✅ CORRETO: Usar funções do core
import { extractNotes, parseMarkdown, createSlideFromContent } from '@core';

const { clean, notes } = extractNotes(content);
const { html } = parseMarkdown(clean);

// ❌ INCORRETO: Duplicar função
function extractNotes(text: string) {
  const notes: string[] = [];
  // ...código duplicado
}
```

### 4. Storage

```typescript
// ✅ CORRETO: Usar utilitários de storage
import { saveSlides, loadSlides, saveAuthToken } from '@core';

await saveSlides(slides);
const saved = loadSlides();

// ❌ INCORRETO: Acesso direto ao localStorage
localStorage.setItem('presentation-slides', JSON.stringify(slides));
```

### 5. Acesso a Dados (Repository Pattern)

```typescript
// ✅ CORRETO: Usar repository
import { presentationRepository } from '@core';

const slides = await presentationRepository.getSlides();
await presentationRepository.saveSlides(newSlides);

// ❌ INCORRETO: Acesso direto
const slides = JSON.parse(localStorage.getItem('slides') || '[]');
```

## 🔌 Preparação para API Laravel

### Ativar Integração com API

No arquivo `src/core/config/index.ts`:

```typescript
export const FEATURE_FLAGS = {
  // ... outras flags
  CLOUD_SYNC: true, // ← Mudar para true
};
```

### Configurar URL da API

No arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### Endpoints Esperados (Laravel)

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('presentations', PresentationController::class);
    Route::get('presentations/{id}/slides', [SlideController::class, 'index']);
    Route::post('presentations/{id}/slides', [SlideController::class, 'store']);
});
```

## 📦 Hooks Disponíveis

### useSlides

```typescript
import { useSlides } from '@core';

function MyComponent() {
  const {
    slides,
    currentSlide,
    isLoading,
    error,
    
    setSlides,
    setCurrentSlide,
    
    loadSlides,
    saveSlides,
    uploadFiles,
    generateWithAI,
    duplicateSlide,
    removeSlide,
    reorderSlides,
    exportAll,
  } = useSlides();
  
  // ...
}
```

## 🎨 Convenções de Código

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `SlideViewer.tsx` |
| Hooks | camelCase com `use` | `useSlides.ts` |
| Utils | camelCase + `.utils` | `markdown.utils.ts` |
| Types | PascalCase | `Slide`, `RemoteCommand` |
| Constantes | UPPER_SNAKE_CASE | `EDITOR_CONFIG` |
| Funções | camelCase | `extractNotes()` |

### Estrutura de Componente

```typescript
/**
 * @fileoverview Descrição do componente
 */

import { useState, useCallback } from 'react';
import { Slide } from '@core';

// ============================================
// TYPES
// ============================================

interface Props {
  slide: Slide;
  onEdit: (content: string) => void;
}

// ============================================
// COMPONENT
// ============================================

export function SlideEditor({ slide, onEdit }: Props) {
  // Hooks
  const [content, setContent] = useState(slide.content);
  
  // Handlers
  const handleSave = useCallback(() => {
    onEdit(content);
  }, [content, onEdit]);
  
  // Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}

export default SlideEditor;
```

## 🔄 Guia de Migração

### Passo 1: Remover código duplicado

Substitua todas as definições locais de `extractNotes` por:

```typescript
import { extractNotes } from '@core';
```

### Passo 2: Centralizar types

Mover definições de tipos para `src/core/types/index.ts`.

### Passo 3: Usar Repository

Substituir acesso direto ao `localStorage` pelo `presentationRepository`.

### Passo 4: Usar configurações

Substituir strings hardcoded por constantes de `@core/config`.

## 🧪 Testabilidade

A nova arquitetura facilita testes:

```typescript
// Mock do repository para testes
jest.mock('@core/api', () => ({
  presentationRepository: {
    getSlides: jest.fn().mockResolvedValue([]),
    saveSlides: jest.fn().mockResolvedValue(true),
  },
}));
```

## 📝 Checklist de Code Review

- [ ] Tipos importados de `@core/types`
- [ ] Sem código duplicado (especialmente `extractNotes`)
- [ ] Configurações vindas de `@core/config`
- [ ] Storage via utilitários de `@core/utils`
- [ ] Componentes com responsabilidade única
- [ ] Hooks extraídos para lógica complexa

