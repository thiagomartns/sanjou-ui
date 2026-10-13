# 0011 — Site e registry na Vercel, com deploy de produção pela CLI na release

- **Status:** Aceito
- **Data:** 2026-10-05
- **Implementação:** `apps/www/vercel.json` e `.github/workflows/site.yml`

## Contexto

O registry do shadcn é servido pelo app Next.js em `apps/www` (`/r/{name}.json`), junto com o site de docs. A URL `sanjou-ui.vercel.app` estava no README, no `registry.json`, na home e na Introduction do Storybook como placeholder. O GitHub Pages publica só o Storybook ([0007](0007-storybook-on-github-pages.md)). Produção só pode ser implantada na release ([0005](0005-production-deploy-on-release-only.md)), e a integração Git da Vercel implanta a branch de produção a cada push.

## Decisão

- Hospedar o site e o registry na **Vercel**, num projeto com Root Directory `apps/www` e branch de produção `main`.
- Desligar o deploy automático da `main` em `apps/www/vercel.json` (`git.deploymentEnabled.main: false`). As outras branches continuam gerando previews.
- Fazer o deploy de produção no workflow `site.yml`, na release: `vercel pull`, `vercel build --prod` e `vercel deploy --prebuilt --prod`, como no guia da Vercel para deploy por tag.
- Guardar `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` no environment `production` do GitHub, liberado só para tags `v*`.

## Alternativas consideradas

- **Registry no GitHub Pages, junto com o Storybook:** os JSON são estáticos e caberiam no mesmo deploy, mas o site de docs não seria publicado e o Pages ficaria com dois produtos sob o mesmo subpath.
- **Deploy hook da Vercel disparado na release:** dispensa token, mas a documentação não garante que o hook funcione com o deploy automático da branch desligado, e a Vercel recomenda a CLI para deploy por tag.
- **Integração Git com deploy automático da `main`:** publicaria código não lançado entre a promoção da `develop` e o merge do Release PR, o que o [0005](0005-production-deploy-on-release-only.md) proíbe.

## Consequências

- O site e o registry em produção sempre correspondem a uma tag `vX.Y.Z`. PRs ganham previews da Vercel.
- O `VERCEL_TOKEN` tem acesso à conta Vercel inteira: criar com expiração, guardar só no environment `production` e rotacionar se vazar.
- Passos manuais: criar o projeto na Vercel, criar o token, criar o environment `production` com a regra de tags `v*` e os três secrets.
- O plano Hobby da Vercel é para uso não comercial. Se o projeto mudar de natureza, rever o plano.
