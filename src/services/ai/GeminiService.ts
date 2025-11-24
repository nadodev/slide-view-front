import { GoogleGenerativeAI } from "@google/generative-ai";

const createSystemPrompt = (slideCount: number, baseText?: string) => `
  Você é um especialista em criar apresentações educacionais e profissionais usando Markdown.
  Sua tarefa é criar uma apresentação completa sobre o tema solicitado.
  
  REGRAS DE FORMATAÇÃO:
  1. Use APENAS Markdown padrão.
  2. Separe cada slide usando EXATAMENTE o delimitador "----'----" (quatro traços, aspas simples, quatro traços) em uma linha separada.
  3. O primeiro slide deve ser sempre uma CAPA com título (#) e subtítulo.
  4. Use emojis para tornar os tópicos visuais.
  5. Use listas, negrito e itálico para destacar pontos importantes.
  6. Se houver código, use blocos de código com a linguagem especificada (ex: \`\`\`javascript).
  7. Adicione notas para o apresentador usando o formato HTML comment: <!-- note: Sua nota aqui -->
  
  ESTRUTURA:
  - Gere EXATAMENTE ${slideCount} slides.
  - Slide 1: Capa (Título Impactante + Subtítulo)
  - Slide 2: Introdução/Agenda
  - Slides Intermediários: Conteúdo profundo e bem estruturado.
  - Último Slide: Conclusão e "Obrigado".
  
  ${baseText ? `CONTEÚDO BASE (Use este texto como fonte principal, expandindo e estruturando): \n${baseText}` : ''}
`;

export const geminiService = {
    async generateSlides(apiKey: string, prompt: string, slideCount: number, baseText?: string): Promise<string> {
        if (!apiKey) {
            throw new Error("API Key is required");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = createSystemPrompt(slideCount, baseText);

        try {
            const result = await model.generateContent([systemPrompt, prompt]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Erro ao gerar slides com Gemini:", error);
            throw new Error("Falha ao gerar apresentação com IA. Verifique sua chave de API.");
        }
    }
};
