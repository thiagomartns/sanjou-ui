# 0012 — Publicação na npm por trusted publishing (OIDC)

- **Status:** Aceito
- **Data:** 2026-10-13

## Contexto

O `release.yml` publicava com o secret `NPM_TOKEN`, como previsto no [0003](0003-release-please-conventional-commits.md) "até migrar para trusted publishing". Na `0.1.0`, o token sem "Bypass 2FA" falhou com `EOTP`, e a publicação foi feita à mão, na máquina do mantenedor. Um token de publicação é um segredo de longa duração: se vazar, quem o tiver publica qualquer versão.

Trusted publishing troca o token OIDC do job do GitHub Actions por uma credencial de curta duração, válida só para o pacote e o workflow cadastrados na npm. Exige npm CLI >= 11.5.1 e Node >= 22.14, e gera provenance sozinho. O `pnpm publish` da linha 10 (a do repositório, `pnpm@10.13.1`) não tem suporte a OIDC; ele só chegou no pnpm 11.

## Decisão

- Publicar `@sanjou/tokens` e `@sanjou/ui` por trusted publishing, a partir do `release.yml` deste repositório.
- No job `publish`, o pnpm só empacota (`pnpm pack`, que resolve as faixas `workspace:`), e o npm 11, com versão fixa, publica os tarballs. É o mesmo caminho usado à mão na `0.1.0`.
- Versões que já estão na npm são puladas, então rodar o job de novo é seguro.
- O secret `NPM_TOKEN` é apagado e o token é revogado. Nos dois pacotes, a npm passa a recusar tokens ("Require two-factor authentication and disallow tokens").

## Alternativas consideradas

- **Manter o `NPM_TOKEN` com "Bypass 2FA":** continua sendo um segredo de longa duração com permissão de publicar, e a npm vai acabar com esse bypass para publicação direta em jan/2027.
- **Subir para o pnpm 11 (no repositório todo ou só no job de release):** é uma troca de versão maior, com mudanças de configuração, só por causa do `publish`. Usar uma versão no job e outra no resto dá margem para builds diferentes. Pode ser revisto quando o repositório migrar para o pnpm 11.
- **Publicação manual a cada release:** depende da máquina e do 2FA do mantenedor, e não gera provenance.

## Consequências

- Nenhum segredo da npm no repositório; o provenance continua sendo gerado.
- A publicação só funciona a partir de `thiagomartns/sanjou-ui` com o workflow `release.yml`. Renomear o workflow, o repositório ou o dono exige atualizar o trusted publisher dos dois pacotes na npm.
- Um pacote publicável novo precisa ter o trusted publisher cadastrado na npm antes da primeira release, além de entrar nos `extra-files` do release-please.
- O npm do job tem versão fixa e precisa ser atualizado à mão.
