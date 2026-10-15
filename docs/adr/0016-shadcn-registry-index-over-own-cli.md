# 0016 — Versão do shadcn fixa só no `init`, e o índice oficial em vez de um CLI próprio

- **Status:** Aceito
- **Data:** 2026-10-15

## Contexto

O PR #32 fixou o shadcn CLI (`npx shadcn@4.21.4`) em todos os comandos de instalação, porque o CLI já mudou seus padrões entre versões e as flags `--base radix --preset nova` dependem dele. Com isso, o usuário digitava a versão em cada `add`, inclusive no comando de cada componente no site. Uma instalação limpa em 2026-10-14 (`create-next-app@15.5.0`, npm) mostrou que o `init` grava `"shadcn": "^4.x"` nas dependências do projeto e que, depois disso, `npx shadcn` usa essa cópia local. A registry também atravessa majors: ela é gerada com shadcn 3.8.5 e foi consumida pelo 4.21.5 sem erro.

Para tirar o passo de editar `components.json` e encurtar os comandos, consideramos um CLI próprio (`npx sanjou add …`). O shadcn tem um índice oficial de registries (`ui.shadcn.com/r/registries.json`): uma registry listada nele funciona com `npx shadcn add @namespace/item` sem configuração, e o CLI grava a entrada no `components.json`. Os requisitos são ser pública e plana e não ter `content` em `files` na `registry.json`, o que a nossa já atende. Em 2026-10-15 o namespace `@sanjou` estava livre.

## Decisão

- As docs (README, site e Storybook) fixam a versão do shadcn só no `init`. Os `add` usam `npx shadcn`.
- A configuração automática da registry vem da inclusão de `@sanjou` no índice oficial do shadcn, não de um pacote nosso. A inclusão é um PR no `shadcn-ui/ui`, feito depois que a 0.2.0 estiver em produção.

## Alternativas consideradas

- **Manter a versão em todos os comandos:** é reproduzível, mas cobra do usuário uma versão que o `add` não precisa.
- **`npx shadcn@latest` em tudo:** traz de volta o risco do #32 no `init`.
- **CLI próprio (`sanjou`, `@sanjou/create`):** seria mais um pacote para publicar, testar e manter compatível com o shadcn. Para o `add`, ele só repetiria o que o `npx shadcn` já faz, e a configuração da registry o índice já resolve.

## Consequências

- O `add` roda com a versão do projeto, não com a testada. Num projeto sem shadcn nas dependências, o `npx` baixa a última versão. O `pnpm dlx` sempre baixa a última (testado em 2026-10-15), por isso as docs indicam `pnpm exec shadcn` para quem usa pnpm.
- `packages/ui/test/docs.test.mjs` continua exigindo uma única versão exata por doc, agora só no `init`.
- Depois da inclusão no índice, o passo de `registries` sai do README, do site e do Storybook, e o teste de instalação limpa do `CONTRIBUTING.md` passa a cobrir o caminho sem configuração.
- Se o índice deixar de atender, um CLI próprio volta a ser opção, com um novo ADR.
