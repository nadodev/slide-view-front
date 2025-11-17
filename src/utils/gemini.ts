const GEMINI_API_KEY = "AIzaSyCgYPRoKFd3iK5cFB_ZKv0Jvjym9LYT9VM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateSlidesWithGemini(prompt: string, slideCount: number = 6, baseText?: string): Promise<string[]> {
  try {
    const textContext = baseText ? `

TEXTO BASE OBRIGATÓRIO PARA PRESERVAR E EXPANDIR:
${baseText}

INSTRUÇÕES CRÍTICAS DE PRESERVAÇÃO:
- MANTENHA TODOS os títulos, seções e conceitos do texto base
- PRESERVE EXATAMENTE toda estrutura markdown existente (##, ###, listas, códigos)
- MANTENHA TODAS as informações técnicas, comandos, códigos e tabelas já existentes
- EXPANDA cada seção com mais detalhes, mas SEM REMOVER nada do original
- DISTRIBUA o conteúdo base pelos ${slideCount} slides solicitados
- SUBDIVIDA slides longos em múltiplos slides menores mantendo todo conteúdo
- ADICIONE seções técnicas relevantes baseadas no conteúdo original
- NUNCA substitua informações do texto base, apenas ADICIONE mais conteúdo
- Use o texto base como ESQUELETO OBRIGATÓRIO e adicione carne aos ossos` : '';
    
    const enhancedPrompt = `
INSTRUÇÃO CRÍTICA: COMECE IMEDIATAMENTE COM O PRIMEIRO SLIDE. NÃO ESCREVA NENHUMA INTRODUÇÃO, EXPLICAÇÃO OU FRASE COMO "AQUI ESTÃO", "OK", "VOU CRIAR", ETC.

${baseText ? 'MODO PRESERVAÇÃO: Use o texto base fornecido como ESQUELETO OBRIGATÓRIO. Mantenha TUDO e apenas expanda/detalhe.' : ''}

TAREFA: Criar EXATAMENTE ${slideCount} slides técnicos EXTENSOS e DETALHADOS em markdown sobre: "${prompt}"${textContext}

${baseText ? `
ESTRATÉGIA DE DISTRIBUIÇÃO DO CONTEÚDO BASE:
- ANALISE o texto base e IDENTIFIQUE suas ${slideCount} principais seções/temas
- DISTRIBUA o conteúdo base de forma equilibrada pelos ${slideCount} slides
- EXPANDA cada seção original com muito mais detalhes técnicos
- SUBDIVIDA slides longos em múltiplos slides preservando todo conteúdo
- ADICIONE exemplos práticos, códigos e tabelas em cada slide expandido
- Se o texto base tem menos temas que ${slideCount}, APROFUNDE cada tema criando sub-slides
- JAMAIS crie slides "Adicional" ou "Complementar" - use apenas o conteúdo base expandido
` : ''}

REGRAS ABSOLUTAS DE CONTAGEM:
- NÚMERO OBRIGATÓRIO: ${slideCount} slides (nem mais, nem menos)
- CONTE os separadores ----'---- para garantir ${slideCount} slides
- Se for menos que ${slideCount}, ADICIONE mais slides
- Se for mais que ${slideCount}, PARE no slide ${slideCount}

REGRAS DE FORMATO:
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

${baseText ? `
REGRAS OBRIGATÓRIAS DE PRESERVAÇÃO (TEXTO BASE FORNECIDO):
- PRESERVE LITERALMENTE todos os títulos originais (não mude nenhuma palavra)
- MANTENHA EXATAMENTE toda numeração, bullets e estrutura markdown
- NÃO REMOVA nenhuma linha, parágrafo ou seção do texto base
- NÃO SUBSTITUA informações técnicas, comandos ou códigos existentes
- APENAS ADICIONE conteúdo novo ENTRE as seções originais ou APÓS elas
- Se o texto base tem códigos/comandos, MANTENHA-OS e adicione explicações
- Se o texto base tem tabelas, PRESERVE-AS e pode adicionar mais colunas/linhas
- COPIE FIELMENTE o conteúdo base e depois EXPANDA cada parte
- Trate o texto base como ESQUELETO SAGRADO que não pode ser alterado
` : ''}

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

VOCABULÁRIO PROFISSIONAL MAS ACESSÍVEL:
- Use termos técnicos corretos, mas sempre explique
- Prefira exemplos práticos a teoria abstrata
- Inclua comandos, códigos e configurações reais
- Foque em problemas e soluções do mundo real
- Mantenha tom profissional mas didático

IMPORTANTE: COMECE IMEDIATAMENTE COM "# Título do Primeiro Slide" - SEM PREÂMBULOS, SEM "AQUI ESTÃO", SEM EXPLICAÇÕES.

${baseText ? 'LEMBRE-SE: PRESERVE FIELMENTE TODO O CONTEÚDO DO TEXTO BASE! Não remova, não substitua, apenas EXPANDA!' : ''}

CONTE OS SLIDES: Deve haver EXATAMENTE ${slideCount} blocos separados por ----'----

APENAS OS ${slideCount} SLIDES PUROS:`;

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
          temperature: 0.7, 
          topK: 40,         
          topP: 0.95,      
          maxOutputTokens: 16384, 
          candidateCount: 1,
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

    // Ajustar número de slides para bater exatamente com o solicitado
    if (slides.length > slideCount) {
      // Se tem mais slides que o solicitado, corta os extras
      console.log(`IA gerou ${slides.length} slides, cortando para ${slideCount}`);
      return slides.slice(0, slideCount);
    } else if (slides.length < slideCount && !baseText) {
      // Só cria slides extras se NÃO houver texto base (modo criação livre)
      console.log(`IA gerou apenas ${slides.length} slides, solicitado ${slideCount} (modo livre)`);
      const remainingSlides = slideCount - slides.length;
      
      for (let i = 0; i < remainingSlides; i++) {
        const slideNumber = slides.length + i + 1;
        const topicSlide = `# Slide ${slideNumber}: ${prompt} - Aspectos Adicionais

## Detalhamento técnico

Aspectos técnicos importantes relacionados ao tema ${prompt}:

**Considerações de implementação:**
- Planejamento e arquitetura
- Escolha de tecnologias adequadas  
- Boas práticas de desenvolvimento
- Testes e validação

## Fatores de qualidade

**Critérios essenciais:**
- Performance e otimização
- Escalabilidade do sistema
- Manutenibilidade do código
- Documentação adequada

## Próximos passos

**Ações recomendadas:**
- Definir roadmap de desenvolvimento
- Estabelecer métricas de sucesso
- Criar protótipos e validações
- Implementar gradualmente`;
        
        slides.push(topicSlide);
      }
    } else if (slides.length < slideCount && baseText) {
      // Se houver texto base e poucos slides, sugere regeneração ao invés de slides genéricos
      console.log(`⚠️ Texto base fornecido mas IA gerou apenas ${slides.length}/${slideCount} slides. Considere regenerar ou ajustar o prompt.`);
    }

    console.log(`Slides finais: ${slides.length} (solicitado: ${slideCount})`);
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