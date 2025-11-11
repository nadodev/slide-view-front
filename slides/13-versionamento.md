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

