const GEMINI_API_KEY = "AIzaSyCgYPRoKFd3iK5cFB_ZKv0Jvjym9LYT9VM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateSlidesWithGemini(prompt: string, slideCount: number = 6, baseText?: string): Promise<string[]> {
  try {
    // Construir contexto baseado no texto preservado
    const textContext = baseText ? `

TEXTO BASE PARA USAR COMO REFERÊNCIA E EXPANDIR:
${baseText}

USE AS INFORMAÇÕES ACIMA como base e expanda com mais detalhes técnicos, exemplos práticos e explicações aprofundadas. Mantenha a estrutura e conceitos principais, mas adicione muito mais conteúdo.` : '';
    
    const enhancedPrompt = `
INSTRUÇÃO CRÍTICA: COMECE IMEDIATAMENTE COM O PRIMEIRO SLIDE. NÃO ESCREVA NENHUMA INTRODUÇÃO, EXPLICAÇÃO OU FRASE COMO "AQUI ESTÃO", "OK", "VOU CRIAR", ETC.

TAREFA: Criar exatamente ${slideCount} slides técnicos EXTENSOS e DETALHADOS em markdown sobre: "${prompt}"${textContext}

REGRAS ABSOLUTAS:
- PRIMEIRO CARACTERE deve ser "#" (início do primeiro slide)
- ZERO frases introdutórias, explicações ou meta-comentários
- NÃO mencione "slides", "apresentação", "diretrizes" ou similar
- COMECE DIRETO com: # Título do Primeiro Slide

REGRAS CRÍTICAS DE CONTEÚDO:
- MÍNIMO 150-200 palavras por slide (conteúdo substancial)
- MÁXIMO de detalhes técnicos e exemplos práticos
- INCLUA códigos, comandos, configurações quando relevante
- EXPLIQUE o "porquê" além do "como" 
- USE tabelas, listas extensas, múltiplas seções por slide
- DETALHE problemas, soluções, implementações e resultados

LINGUAGEM SIMPLES E CLARA:
- Use palavras do dia a dia em vez de jargões rebuscados
- Evite termos como "trajetória digital", "experiência fragmentada", "preexistentes"
- Prefira: "problemas", "dificuldades", "soluções", "benefícios", "como fazer"
- Seja direto: "O que é", "Como funciona", "Por que usar", "Problemas comuns"
- Use exemplos práticos e situações reais

ESTILO TÉCNICO ACESSÍVEL:
- Explique conceitos de forma clara e objetiva
- Use exemplos de código simples e práticos
- Foque em problemas e soluções reais do dia a dia
- Evite academicismos - seja prático e aplicável
- Use bullet points diretos (3-5 pontos por seção)

ESTRUTURA EXPANDIDA POR SLIDE:
1. **Introdução técnica** (2-3 parágrafos explicativos)
2. **Detalhamento prático** (exemplos, códigos, configurações)
3. **Problemas comuns** (situações reais, como resolver)
4. **Implementação step-by-step** (quando aplicável)
5. **Resultados esperados** (métricas, benefícios mensuráveis)

FORMATAÇÃO RICA:
- Título: # Título Claro e Direto
- Múltiplas seções: ## Seção 1, ## Seção 2, ## Seção 3
- Códigos extensos com comentários:
\`\`\`typescript
// Exemplo prático com explicação
const exemplo = {
  propriedade: 'valor', // Comentário explicativo
  metodo: () => {
    // Lógica detalhada
  }
};
\`\`\`
- Tabelas informativas:
| Item | Descrição | Uso Prático |
|------|-----------|-------------|
- Listas detalhadas com sub-itens
- **Destaques importantes** em negrito
- Separador obrigatório: ----'----

EXEMPLO DE SLIDE RICO (SIGA ESTE PADRÃO):

# Implementação de Design System com React e TypeScript

## O que é um Design System moderno

Um Design System é uma coleção de componentes reutilizáveis, guidelines e padrões que garantem consistência visual e funcional em produtos digitais. No contexto moderno, vai muito além de uma biblioteca de componentes - é uma estratégia completa de desenvolvimento.

**Componentes principais:**
- **Design Tokens**: Variáveis que definem cores, tipografia, espaçamentos
- **Biblioteca de Componentes**: Blocos reutilizáveis (Button, Input, Modal)
- **Documentação**: Guidelines de uso, exemplos e boas práticas
- **Ferramental**: Scripts, CLI, automações para desenvolvimento

## Arquitetura técnica recomendada

### Monorepo com Lerna/Rush
\`\`\`bash
design-system/
├── packages/
│   ├── tokens/          # Design tokens
│   ├── react/           # Componentes React
│   ├── vue/             # Componentes Vue (opcional)
│   ├── docs/            # Storybook/Docusaurus
│   └── tools/           # Scripts e utilities
├── apps/
│   ├── playground/      # Ambiente de testes
│   └── website/         # Site de documentação
└── tools/
    ├── build-tools/     # Ferramentas de build
    └── scripts/         # Automações
\`\`\`

### Stack tecnológica detalhada

| Tecnologia | Versão | Propósito | Configuração |
|------------|--------|-----------|---------------|
| React | 18+ | Biblioteca de componentes | JSX + Hooks |
| TypeScript | 5+ | Type safety | Strict mode |
| Styled Components | 5+ | CSS-in-JS | Theme provider |
| Storybook | 7+ | Documentação | MDX + Controls |
| Rollup | 4+ | Bundle | ESM + CJS |
| Jest | 29+ | Testes | RTL + Coverage |

## Implementação prática step-by-step

### 1. Setup inicial do projeto
\`\`\`bash
# Criar estrutura base
mkdir design-system && cd design-system
npm init -y
npm install lerna --save-dev
lerna init

# Configurar workspace
echo '{ "npmClient": "npm", "useWorkspaces": true }' > lerna.json
\`\`\`

### 2. Configuração do pacote de tokens
\`\`\`typescript
// packages/tokens/src/index.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a'
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  }
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem'     // 32px
} as const;
\`\`\`

### 3. Componente base tipado
\`\`\`tsx
// packages/react/src/Button/Button.tsx
import styled from 'styled-components';
import { colors, spacing } from '@company/design-tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledButton = styled.button<ButtonProps>\`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  /* Size variants */
  \${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return \`
        padding: \${spacing.xs} \${spacing.sm};
        font-size: 14px;
        height: 32px;
      \`;
      case 'lg': return \`
        padding: \${spacing.sm} \${spacing.lg};
        font-size: 16px;
        height: 48px;
      \`;
      default: return \`
        padding: \${spacing.xs} \${spacing.md};
        font-size: 15px;
        height: 40px;
      \`;
    }
  }}
  
  /* Color variants */
  \${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary': return \`
        background: \${colors.primary[50]};
        color: \${colors.primary[500]};
        &:hover { background: \${colors.primary[100]}; }
      \`;
      case 'ghost': return \`
        background: transparent;
        color: \${colors.primary[500]};
        &:hover { background: \${colors.primary[50]}; }
      \`;
      default: return \`
        background: \${colors.primary[500]};
        color: white;
        &:hover { background: \${colors.primary[600]}; }
      \`;
    }
  }}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
\`;

export const Button: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};
\`\`\`

## Problemas comuns e soluções

### 1. Inconsistência entre times
**Problema**: Cada desenvolvedor interpreta o design diferente
**Solução**: Documentação com exemplos visuais no Storybook

### 2. Breaking changes em componentes
**Problema**: Atualizar componente quebra aplicações
**Solução**: Versionamento semântico + testes de regressão visual

### 3. Performance com muitos componentes
**Problema**: Bundle muito grande
**Solução**: Tree shaking + imports específicos

\`\`\`typescript
// ❌ Importa tudo
import { Button, Input, Modal } from '@company/design-system';

// ✅ Importa apenas o necessário
import { Button } from '@company/design-system/button';
\`\`\`

## Métricas de sucesso

- **Redução de código CSS**: 60-80% menos CSS customizado
- **Velocidade de desenvolvimento**: 40-60% mais rápido para criar UIs
- **Consistência**: 95% de aderência aos padrões visuais
- **Manutenibilidade**: 70% menos bugs relacionados a UI
- **Onboarding**: Novos devs produtivos em 2-3 dias vs 2 semanas

----'----

VOCABULÁRIO PROFISSIONAL MAS ACESSÍVEL:
- Use termos técnicos corretos, mas sempre explique
- Prefira exemplos práticos a teoria abstrata
- Inclua comandos, códigos e configurações reais
- Foque em problemas e soluções do mundo real
- Mantenha tom profissional mas didático

IMPORTANTE: COMECE IMEDIATAMENTE COM "# Título do Primeiro Slide" - SEM PREÂMBULOS, SEM "AQUI ESTÃO", SEM EXPLICAÇÕES. APENAS OS ${slideCount} SLIDES PUROS:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7, // Mais criatividade para conteúdo mais rico
          topK: 40,          // Mais diversidade de tokens
          topP: 0.95,        // Maior probabilidade para respostas mais criativas
          maxOutputTokens: 16384, // Dobrar limite para conteúdo muito mais extenso
          candidateCount: 1, // Foco em uma resposta de qualidade
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro da API Gemini: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Resposta inválida da API Gemini");
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Limpar texto indesejado da IA de forma mais agressiva
    const cleanedText = generatedText
      // Remove qualquer frase introdutória da IA (múltiplas variações)
      .replace(/^.*?(?:ok,?\s*)?(?:aqui está?|aqui estão|segue|vou criar|apresento).*?(?:slides?|apresentação).*?[:.]?\s*/i, '')
      .replace(/^.*?(?:seguindo|baseado|conforme).*?(?:diretrizes|padrão|solicitado).*?[:.]?\s*/i, '')
      .replace(/^.*?(?:cada slide|todos os slides).*?(?:palavras|conteúdo).*?[:.]?\s*/i, '')
      .replace(/^.*?(?:técnicos?|detalhados?).*?(?:sobre|para|do).*?[:.]?\s*/i, '')
      // Remove linhas que mencionam número de slides ou diretrizes
      .replace(/^.*?\d+\s*slides?.*?[:.]?\s*/i, '')
      .replace(/^.*?(?:diretrizes|guidelines|instruções).*?[:.]?\s*/i, '')
      // Remove qualquer linha que comece com meta-descrição
      .replace(/^[^#]*?(?:apresentação|slides|conteúdo|material).*?[:.]?\s*/i, '')
      // Remove pontos, numerações ou bullets no início
      .replace(/^[\s\-\*\•\d\.\)]+/, '')
      // Remove linhas vazias no início e espaços extras
      .replace(/^\s*[\r\n]+/, '')
      .replace(/^[\s\r\n]*/, '')
      .trim();
    
    // Dividir o texto em slides usando o delimitador
    const slides = cleanedText
      .split("----'----")
      .map((slide: string) => {
        // Limpar cada slide individualmente
        return slide
          .trim()
          // Remove qualquer numeração no início do slide
          .replace(/^[\d\.\)\s]*/, '')
          // Remove bullets ou marcadores
          .replace(/^[\-\*\•\s]*/, '')
          // Garante que comece com # se for um título
          .replace(/^(?!#)(.+)$/m, (match, content) => {
            // Se não começar com #, adiciona se parecer um título
            if (content.length < 100 && !content.includes('\n')) {
              return `# ${content.trim()}`;
            }
            return content;
          })
          .trim();
      })
      .filter((slide: string) => slide.length > 10 && slide.includes('#')); // Apenas slides com conteúdo real

    if (slides.length === 0) {
      throw new Error("Nenhum slide foi gerado pela IA");
    }

    return slides;
  } catch (error) {
    console.error("Erro ao gerar slides com Gemini:", error);
    throw error;
  }
}

export function createSlideFromMarkdown(markdown: string, index: number): any {
  const lines = markdown.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));
  const title = titleLine ? titleLine.replace('# ', '').trim() : `Slide ${index + 1}`;
  
  return {
    name: title,
    content: markdown,
    notes: [],
    html: '', // Será processado pelo parseMarkdownSafe
    _fileHandle: null
  };
}