# 0013 — Figma espelha o código; tokens só pelo gerador

- **Status:** Aceito
- **Data:** 2026-10-13

## Contexto

A biblioteca do Sanjou no Figma (`Sanjou UI — Library`) passa a existir para desenhar apps com o DS e fazer o handoff para o código. O plano é Figma Professional, que não inclui Code Connect. O handoff é feito pelo servidor MCP do Figma, lendo o nome das instâncias e os valores das propriedades. Variáveis editadas à mão no Figma e nomes diferentes dos do código exigiriam uma tabela de tradução, que desatualiza.

O importador nativo de variáveis do Figma não cria text styles nem effect styles. Até aqui, o gerador emitia só cor, `space` e `radius`, e as sombras estavam definidas em `generate.mjs`, fora de `config.mjs`.

## Decisão

- O código manda. Componentes, propriedades e valores de variante no Figma têm os mesmos nomes do código (`Button`, `variant=primary`, `size=md`).
- Tokens entram no Figma só pelo gerador. `packages/tokens/figma/` traz as variáveis (`native/`, `plugin-hex/`) e os estilos (`styles.json`). Os estilos são aplicados por script (Plugin API, pelo MCP), com correspondência por nome. Ninguém edita variável ou estilo direto no Figma.
- Depois da primeira criação, a sincronização atualiza por nome em vez de reimportar, para preservar os IDs das variáveis e as ligações dos componentes.
- A `scale` e as cores das camadas de sombra saem marcadas `hiddenFromPublishing`. Quem usa a biblioteca só vê os tokens semânticos, como no código.
- Sombras, fontes e easings passam para `config.mjs`, que volta a ser a fonte única.

## Alternativas consideradas

- **Code Connect:** só existe nos planos Organization e Enterprise. Com nomes iguais e um `CLAUDE.md` de mapeamento no app, ele não faz falta.
- **Editar tokens no Figma e exportar para o código:** cria uma segunda fonte de verdade e tira o contraste WCAG do gate de CI.
- **Text e effect styles criados à mão no Figma:** divergem em silêncio do `TYPE_SCALE` e das sombras do CSS.

## Consequências

- O handoff não precisa de tradução: uma instância no Figma vira um import de `@sanjou/ui/<nome>` com as mesmas props.
- Mudar um token continua sendo `config.mjs` → `pnpm tokens`, e a sincronização com o Figma vira um passo explícito do fluxo (README, "Changing a token").
- Effect styles ficam corretos nos dois temas, porque cada camada aponta para uma variável de cor com modo Light e Dark.
- O script que aplica os estilos não fica no repositório: roda pelo MCP, lendo `styles.json`.
