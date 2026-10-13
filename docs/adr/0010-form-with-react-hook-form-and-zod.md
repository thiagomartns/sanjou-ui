# 0010 — Formulários com `react-hook-form` e `zod`

- **Status:** Aceito
- **Data:** 2026-10-05

## Contexto

O lote 4 do plano de componentes pede um Form: ligar label, campo, texto de ajuda e mensagem de erro de forma acessível (`id`, `aria-invalid`, `aria-describedby`), validar antes do envio e mostrar o erro de cada campo. Até aqui, cada story e pattern fazia essa ligação à mão, com `FormData` e ids escritos no código.

Os componentes do registry seguem a API do shadcn/ui v4, cujo `form.tsx` é construído sobre `react-hook-form`, com `zod` como validador nos exemplos. Os campos do Sanjou (Input, Textarea, Select, Checkbox, Switch, RadioGroup) já mostram o estado de erro a partir de `aria-invalid`.

## Decisão

O Form do Sanjou (`registry/sanjou/ui/form.tsx`, item `form`) segue o `form.tsx` do shadcn v4: `Form` (o `FormProvider`), `FormField` (um `Controller`), `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` e o hook `useFormField`. O `FormControl` passa `id`, `aria-invalid` e `aria-describedby` ao controle por `Slot`. A validação usa `zod` com `zodResolver` de `@hookform/resolvers`. O item lista as três bibliotecas como dependências, e o Label como `registryDependencies`.

## Alternativas consideradas

- **Só HTML e `FormData`, sem biblioteca:** é o que as stories faziam. Funciona para formulários pequenos, mas cada tela repete a ligação de ids e o estado de erro, e os controles do Radix (Select, Checkbox) exigem estado controlado escrito à mão.
- **TanStack Form:** API moderna e tipada, mas sem um `form.tsx` de referência no shadcn. Adotá-lo afastaria o registry do ecossistema que os consumidores já conhecem.
- **Valibot ou Yup em vez de `zod`:** o resolver aceita os dois. O `zod` é o padrão da documentação do shadcn e do `react-hook-form`, e o schema serve também para validar no servidor.

## Consequências

- Quem instala o item ganha `react-hook-form`, `zod` e `@hookform/resolvers`. Quem não usa `zod` pode trocar o resolver sem mudar o componente.
- Os controles do Radix precisam de ligação explícita no `render` do `FormField`: `value`/`onValueChange` no Select, `checked`/`onCheckedChange` no Checkbox e no Switch. O Select usa `value ?? ''` para continuar controlado e mostrar o placeholder.
- O `FormMessage` mostra o erro do campo; um erro vazio (como um erro do servidor apontado pelo `setError` sem mensagem) marca o campo inválido sem mostrar texto. O `aria-describedby` só aponta para a descrição e a mensagem que estão renderizadas: cada uma se registra no `FormItem` ao montar. O pattern `Sign in` usa isso, com o Alert levando a mensagem.
- No envio, o `react-hook-form` move o foco para o primeiro campo inválido. As stories testam esse comportamento.
