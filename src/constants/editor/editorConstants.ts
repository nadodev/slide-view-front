import {
    Type,
    List,
    Code,
    Table,
    Image,
    Quote,
    Bold,
    Italic,
    Heading1,
    Heading2,
    Link2,
    Minimize2,
    FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SlashCommand = {
    id: string;
    name: string;
    keywords: string[];
    icon: LucideIcon;
    content: string;
    description: string;
};

export type Template = {
    id: string;
    name: string;
    icon: LucideIcon;
    content: string;
    description: string;
};

export const SLASH_COMMANDS: SlashCommand[] = [
    {
        id: 'title',
        name: 'Título',
        keywords: ['titulo', 'h1', 'heading1', 'heading'],
        icon: Heading1,
        content: '# Título Principal\n\n',
        description: 'Título grande (H1)'
    },
    {
        id: 'subtitle',
        name: 'Subtítulo',
        keywords: ['subtitulo', 'h2', 'heading2'],
        icon: Heading2,
        content: '## Subtítulo\n\n',
        description: 'Subtítulo (H2)'
    },
    {
        id: 'description',
        name: 'Descrição',
        keywords: ['descricao', 'texto', 'paragrafo', 'p'],
        icon: FileText,
        content: 'Descrição do conteúdo aqui...\n\n',
        description: 'Texto descritivo'
    },
    {
        id: 'bullets',
        name: 'Lista com Bullets',
        keywords: ['lista', 'bullets', 'ul', 'unordered'],
        icon: List,
        content: '- Item 1\n- Item 2\n- Item 3\n\n',
        description: 'Lista não ordenada'
    },
    {
        id: 'numbered',
        name: 'Lista Numerada',
        keywords: ['numerada', 'ol', 'ordered', 'lista numerada'],
        icon: List,
        content: '1. Primeiro item\n2. Segundo item\n3. Terceiro item\n\n',
        description: 'Lista ordenada'
    },
    {
        id: 'bold',
        name: 'Texto em Negrito',
        keywords: ['negrito', 'bold', 'strong'],
        icon: Bold,
        content: '**Texto em negrito**\n\n',
        description: 'Texto destacado'
    },
    {
        id: 'italic',
        name: 'Texto em Itálico',
        keywords: ['italico', 'italic', 'enfase'],
        icon: Italic,
        content: '*Texto em itálico*\n\n',
        description: 'Texto enfatizado'
    },
    {
        id: 'code',
        name: 'Bloco de Código',
        keywords: ['codigo', 'code', 'bloco', 'codeblock'],
        icon: Code,
        content: '```\n// Seu código aqui\n```\n\n',
        description: 'Código formatado'
    },
    {
        id: 'inline-code',
        name: 'Código Inline',
        keywords: ['inline', 'codigo inline'],
        icon: Code,
        content: '`código inline`\n\n',
        description: 'Código em linha'
    },
    {
        id: 'table',
        name: 'Tabela',
        keywords: ['tabela', 'table'],
        icon: Table,
        content: '| Coluna 1 | Coluna 2 | Coluna 3 |\n|----------|----------|----------|\n| Dado 1   | Dado 2   | Dado 3   |\n\n',
        description: 'Tabela markdown'
    },
    {
        id: 'quote',
        name: 'Citação',
        keywords: ['citacao', 'quote', 'blockquote'],
        icon: Quote,
        content: '> Citação ou destaque importante\n\n',
        description: 'Bloco de citação'
    },
    {
        id: 'image',
        name: 'Imagem',
        keywords: ['imagem', 'image', 'img'],
        icon: Image,
        content: '![Descrição da imagem](url-da-imagem)\n\n',
        description: 'Inserir imagem'
    },
    {
        id: 'link',
        name: 'Link',
        keywords: ['link', 'url', 'hyperlink'],
        icon: Link2,
        content: '[Texto do link](url)\n\n',
        description: 'Inserir link'
    },
    {
        id: 'divider',
        name: 'Divisor',
        keywords: ['divisor', 'divider', 'hr', 'linha'],
        icon: Minimize2,
        content: '---\n\n',
        description: 'Linha divisória'
    },
    {
        id: 'mermaid',
        name: 'Diagrama Mermaid',
        keywords: ['mermaid', 'diagrama', 'grafico', 'flowchart'],
        icon: Code,
        content: '```mermaid\ngraph TD\n    A[Início] --> B[Processo]\n    B --> C{Fim?}\n    C -->|Sim| D[Finalizar]\n    C -->|Não| B\n```\n\n',
        description: 'Diagrama de fluxo Mermaid'
    }
];

export const TEMPLATES: Template[] = [
    {
        id: 'title',
        name: 'Título',
        icon: Type,
        content: '# Título Principal\n\n',
        description: 'Título grande (H1)'
    },
    {
        id: 'subtitle',
        name: 'Subtítulo',
        icon: Type,
        content: '## Subtítulo\n\n',
        description: 'Subtítulo (H2)'
    },
    {
        id: 'description',
        name: 'Descrição',
        icon: FileText,
        content: 'Descrição do conteúdo aqui...\n\n',
        description: 'Texto descritivo'
    },
    {
        id: 'bullets',
        name: 'Lista com Bullets',
        icon: List,
        content: '- Item 1\n- Item 2\n- Item 3\n\n',
        description: 'Lista não ordenada'
    },
    {
        id: 'numbered',
        name: 'Lista Numerada',
        icon: List,
        content: '1. Primeiro item\n2. Segundo item\n3. Terceiro item\n\n',
        description: 'Lista ordenada'
    },
    {
        id: 'bold',
        name: 'Texto em Negrito',
        icon: Type,
        content: '**Texto em negrito**\n\n',
        description: 'Texto destacado'
    },
    {
        id: 'italic',
        name: 'Texto em Itálico',
        icon: Type,
        content: '*Texto em itálico*\n\n',
        description: 'Texto enfatizado'
    },
    {
        id: 'code',
        name: 'Bloco de Código',
        icon: Code,
        content: '```\n// Seu código aqui\n```\n\n',
        description: 'Código formatado'
    },
    {
        id: 'inline-code',
        name: 'Código Inline',
        icon: Code,
        content: '`código inline`\n\n',
        description: 'Código em linha'
    },
    {
        id: 'table',
        name: 'Tabela',
        icon: Table,
        content: '| Coluna 1 | Coluna 2 | Coluna 3 |\n|----------|----------|----------|\n| Dado 1   | Dado 2   | Dado 3   |\n\n',
        description: 'Tabela markdown'
    },
    {
        id: 'quote',
        name: 'Citação',
        icon: Quote,
        content: '> Citação ou destaque importante\n\n',
        description: 'Bloco de citação'
    },
    {
        id: 'image',
        name: 'Imagem',
        icon: Image,
        content: '![Descrição da imagem](url-da-imagem)\n\n',
        description: 'Inserir imagem'
    },
    {
        id: 'link',
        name: 'Link',
        icon: FileText,
        content: '[Texto do link](https://exemplo.com)\n\n',
        description: 'Link clicável'
    },
    {
        id: 'divider',
        name: 'Divisor',
        icon: FileText,
        content: '---\n\n',
        description: 'Linha divisória'
    },
    {
        id: 'mermaid',
        name: 'Diagrama Mermaid',
        icon: Code,
        content: '```mermaid\ngraph TD\n    A[Início] --> B[Processo]\n    B --> C{Fim?}\n    C -->|Sim| D[Finalizar]\n    C -->|Não| B\n```\n\n',
        description: 'Diagrama de fluxo Mermaid'
    }
];

export const EDITOR_PLACEHOLDER = `# Título do Slide

Comece a digitar seu conteúdo em Markdown aqui...

- Lista de itens
- Outro item

**Texto em negrito** e *itálico*`;
