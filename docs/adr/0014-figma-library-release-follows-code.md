# 0014 — Release da biblioteca do Figma segue o release do código

- **Status:** Aceito
- **Data:** 2026-10-14

## Contexto

A biblioteca `Sanjou UI — Library` espelha o código ([0013](0013-figma-mirrors-code-tokens-from-generator.md)), mas não tinha regra de quando publicar. No Figma não existe versão semântica: "Publish library" já é a distribuição, porque os arquivos consumidores recebem a atualização e a aceitam. O version history aceita versões nomeadas, que servem como snapshot restaurável. O plano é Professional, que não tem branching: toda edição acontece no arquivo publicado. O código sai com uma versão única `vX.Y.Z` para todos os pacotes ([0004](0004-single-version-for-all-packages.md)) e só vai para produção no release ([0005](0005-production-deploy-on-release-only.md)).

## Decisão

- A biblioteca só é publicada em um release, como último passo, depois do publish na npm, e leva a mesma versão.
- No release: sincronizar os tokens (se `packages/tokens/figma/` mudou), definir a variável `Docs/version` como `X.Y.Z`, publicar com a descrição `vX.Y.Z — <resumo>` e o link da GitHub Release, e salvar a versão nomeada `vX.Y.Z` no version history.
- Entre releases o arquivo pode mudar, mas não é publicado. Um hotfix publica junto com o patch.
- O badge de versão no arquivo (cover e headers de seção) mostra a versão completa, `vX.Y.Z`.

## Alternativas consideradas

- **Publicar a cada mudança:** quem consome receberia componentes que ainda não existem na versão do npm.
- **Arquivo separado de rascunho:** duplica componentes e IDs, e as instâncias teriam que ser religadas a cada release.
- **Página de changelog no Figma:** repete o `CHANGELOG.md` e fica desatualizada. A descrição do publish aponta para a GitHub Release.
- **Badge `major.minor` (`v0.2`):** não distingue um patch, e o código sempre usa a versão completa.

## Consequências

- Um arquivo do Figma corresponde exatamente a um `@sanjou/ui@X.Y.Z`, e cada release tem um ponto de restauração.
- Os passos do Figma são manuais. O publish e a versão nomeada não estão disponíveis no MCP, e a API de variáveis por REST exige o plano Enterprise.
- O `CONTRIBUTING.md` (Releases) ganha o passo do Figma, e o README deixa de mandar publicar a biblioteca ao trocar um token.
