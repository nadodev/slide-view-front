# 🐳 Docker (Dev)

Arquivos:

- `builds/Dockerfile`
- `builds/docker-compose-dev.yml`

Comandos principais:

```bash
docker compose -f builds/docker-compose-dev.yml build --no-cache
docker compose -f builds/docker-compose-dev.yml up -d
docker compose -f builds/docker-compose-dev.yml logs -f --tail=100 aurea-storybook-dev
```

Vantagens: ambiente idêntico, isolamento, setup rápido, pronto para prod.

## Dicas de porta e healthcheck

- Porta interna do Storybook: `6006`
- Prefira mapear `6006:6006` para previsibilidade
- Healthcheck coerente com a porta interna

