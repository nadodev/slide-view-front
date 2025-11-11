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

