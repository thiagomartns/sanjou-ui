# 0009 — Toast com `sonner`

- **Status:** Aceito
- **Data:** 2026-10-05

## Contexto

O lote 4 do plano de componentes pede um Toast: aviso curto, não bloqueante, disparado de qualquer ponto do código (depois de salvar, de um deploy, de um erro de rede). Precisa empilhar vários avisos, fechar sozinho, ter ação opcional ("Undo") e ser anunciado por leitor de tela.

Os componentes do registry seguem a API do shadcn/ui v4, e o shadcn v4 já trocou o próprio Toast (sobre `@radix-ui/react-toast`) pelo `sonner`. O `sonner` 2.x aceita React 18 e 19, não tem dependências e expõe as cores em variáveis CSS.

## Decisão

O Toast do Sanjou é um wrapper `Toaster` sobre o `sonner` (`registry/sanjou/ui/sonner.tsx`, item `sonner`). Os avisos são disparados com `toast()` importado direto do `sonner`. O wrapper aponta as variáveis do `sonner` para os tokens semânticos (`popover`, `border`, `*-subtle`, `*-text`) e usa os ícones do `lucide-react`. Com isso, o tema segue a classe `.dark`, como nos outros componentes, sem `next-themes` nem a prop `theme`.

## Alternativas consideradas

- **`@radix-ui/react-toast`:** coerente com o resto do registry, mas a fila, o empilhamento e a API imperativa (`toast()`) teriam de ser escritos e mantidos aqui. O shadcn abandonou esse caminho pelo mesmo motivo.
- **Toast próprio sem biblioteca:** o mesmo custo do Radix, e ainda sem a base de acessibilidade.
- **`react-hot-toast`:** API parecida, mas menos aderente ao visual do shadcn e sem a ponte de variáveis CSS que o `sonner` oferece.

## Consequências

- Quem instala o item ganha a dependência `sonner` e monta um `<Toaster />` perto da raiz. A API de disparo é a do `sonner`, documentada fora daqui.
- O `sonner` injeta CSS próprio com seletores de atributo. Sobrescrever descrição, botões e sombra exige classes com `!`, e uma atualização do `sonner` pode mudar esses seletores: conferir as stories do Toast a cada bump.
- O `sonner` guarda os toasts num store de módulo. As stories limpam esse store num `beforeEach` (`toast.dismiss()`).
- Os toasts entram com animação de opacidade. Testes esperam a visibilidade com `waitFor`.
