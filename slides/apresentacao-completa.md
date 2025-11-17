# Padronização Visual: O Problema

Atualmente, os produtos digitais da Unoesc sofrem com a falta de um padrão visual unificado. Isso causa:

- **Inconsistência:** Cada sistema tem sua própria cara, confundindo o usuário.
- **Retrabalho:** Designers e desenvolvedores refazem os mesmos elementos repetidamente.
- **Dificuldade de manutenção:** Corrigir ou atualizar um elemento exige um esforço grande.
- **Experiência do usuário prejudicada:** A falta de familiaridade entre os sistemas dificulta a navegação.
- **Tempo perdido:** Decisões sobre cores, fontes e espaçamentos são tomadas repetidas vezes.

O Aurea Design System busca resolver esses problemas, criando uma base sólida para todos os produtos digitais da Unoesc.

----'----

# Aurea: A Solução em Design System

O Aurea Design System é um conjunto de ferramentas e diretrizes para criar interfaces consistentes e eficientes. Ele oferece:

- **Componentes prontos:** Botões, formulários, alertas e outros elementos já construídos e testados.
- **Tokens de design:** Definições de cores, fontes, espaçamentos e outros estilos visuais.
- **Documentação completa:** Guia de uso, exemplos de código e melhores práticas.
- **Padronização:** Garante que todos os produtos sigam a mesma identidade visual.
- **Eficiência:** Reduz o tempo de desenvolvimento e manutenção.

O objetivo é unificar a experiência do usuário e facilitar o trabalho das equipes de design e desenvolvimento.

----'----

# O Que é um Design System?

Um Design System é como um kit de construção para interfaces digitais. Imagine um conjunto de peças de LEGO, onde cada peça é um componente reutilizável.

- **Tokens:** As cores e fontes padronizadas, como as cores das peças de LEGO.
- **Componentes:** Os blocos de construção prontos, como um botão ou um formulário.
- **Documentação:** O manual de instruções, que explica como usar cada componente.
- **Diretrizes:** As regras de montagem, que garantem a consistência visual.

Com um Design System, é possível criar interfaces complexas de forma rápida e eficiente, mantendo a consistência visual e a qualidade do código.

----'----

# Arquitetura: Monorepo e Turborepo

O Aurea Design System utiliza uma arquitetura de monorepo com Turborepo para organizar e otimizar o desenvolvimento.

- **Monorepo:** Todos os pacotes do Design System (tokens, componentes, documentação) estão em um único repositório. Isso facilita o compartilhamento de código e a manutenção.
- **Turborepo:** Uma ferramenta que otimiza o processo de build, executando apenas as tarefas necessárias e armazenando em cache os resultados. Isso acelera o desenvolvimento e a integração contínua.

**Benefícios:**

- Compartilhamento fácil de código entre os pacotes.
- Versionamento sincronizado.
- Builds rápidos e eficientes.
- Gerenciamento centralizado de dependências.

----'----

# Estrutura de Pacotes: Organização

A estrutura do monorepo é organizada em pacotes, cada um com uma responsabilidade específica:

- **`tokens`:** Define os tokens de design (cores, fontes, espaçamentos) em diferentes formatos (CSS, JS, TS).
- **`react`:** Contém os componentes React reutilizáveis, construídos com base nos tokens de design.
- **`docs`:** A documentação do Design System, gerada com Storybook.
- **`eslint-config`:** Configurações de ESLint para garantir a qualidade do código.
- **`ts-config`:** Configurações do TypeScript para garantir a tipagem forte.

Essa estrutura modular facilita a manutenção e a evolução do Design System.

----'----

# Fluxo de Desenvolvimento: Tokens e Componentes

O fluxo de desenvolvimento do Aurea Design System envolve a criação e atualização de tokens e componentes:

- **Tokens:**
    1. Designers atualizam os tokens no Figma.
    2. Os tokens são exportados para arquivos JSON.
    3. Um script transforma os JSON em CSS, JS e TS.
    4. Os componentes React consomem os tokens automaticamente.
- **Componentes:**
    1. Desenvolvedores criam ou atualizam um componente React.
    2. Eles criam uma Story no Storybook para documentar o componente.
    3. O componente é testado e publicado.

Este fluxo garante que os componentes estejam sempre atualizados com os tokens de design mais recentes.

----'----

# Tecnologias: A Base do Aurea

O Aurea Design System é construído com as seguintes tecnologias:

- **React:** Biblioteca JavaScript para construir interfaces de usuário.
- **TypeScript:** Linguagem que adiciona tipagem estática ao JavaScript, melhorando a qualidade do código.
- **Turborepo:** Ferramenta para otimizar o build de monorepos.
- **Vite:** Ferramenta de build rápida e eficiente.
- **Style Dictionary:** Ferramenta para transformar tokens de design em diferentes formatos.
- **Storybook:** Ferramenta para documentar e testar componentes.

Essas tecnologias foram escolhidas para garantir a qualidade, a performance e a facilidade de uso do Design System.

----'----

# Benefícios e Próximos Passos

O Aurea Design System oferece os seguintes benefícios:

- **Consistência visual:** Todos os produtos da Unoesc terão a mesma identidade visual.
- **Eficiência:** Redução do tempo de desenvolvimento e manutenção.
- **Qualidade:** Código mais limpo e fácil de manter.
- **Acessibilidade:** Componentes acessíveis para todos os usuários.

**Próximos Passos:**

- Criar mais componentes (Inputs, Selects, Modals).
- Implementar o tema escuro.
- Automatizar os testes.
- Integrar o Figma com o código.
- Migrar os projetos existentes para o Aurea Design System.