# 🎨 Design Tokens

O que são: variáveis que armazenam valores de design (cores, tipografia, espaçamentos). Mudou o token, mudou em todo o sistema.

Exemplo (CSS gerado):

```css
:root {
  --aurea-color-primary: #0066cc;
  --aurea-color-surface: #ffffff;
  --aurea-space-16: 1rem;
  --aurea-font-size-lg: 1.125rem;
}

.button {
  background: var(--aurea-color-primary);
  padding: var(--aurea-space-16);
}
```

Formatos: CSS • JS • TS • JSON

## Boas práticas

- Use `var(--aurea-...)` em CSS/Styled Components
- Evite cores hardcoded no app; prefira tokens
- Nomeie tokens por função (ex.: `color-primary`), não por valor (`blue-500`)

## Dica

Atualize o token uma vez, todos os componentes herdam a mudança automaticamente.

