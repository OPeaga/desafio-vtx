# Contrato de design — frontend

Este documento define como o trabalho visual é dividido entre agentes neste projeto. Usamos **Tailwind CSS v4** (config CSS-first, sem `tailwind.config.js`).

## Divisão de responsabilidade

A divisão não é mais "por arquivo", é **por tipo de mudança dentro do arquivo**:

- **Camada estrutural/comportamental** (props, tipos, lógica, estado, event handlers, atributos de acessibilidade, integração com hooks/services): responsabilidade de quem constrói os componentes. Isso não muda.
- **Camada visual** (quais utilities Tailwind são aplicadas em cada `className`, valores em [`src/styles/theme.css`](src/styles/theme.css), estrutura de markup puramente decorativa como wrappers extras para efeito visual): pode ser editada pelo agente criativo, inclusive diretamente nos `.tsx` de `src/components/ui/` e `src/components/layout/`.

Ou seja: o agente criativo tem liberdade para redesenhar `className`, reorganizar markup decorativo e reescrever `theme.css` à vontade — desde que não toque na API do componente.

## Regra de ouro

> Editar `className`, markup puramente decorativo (wrappers, ícones, divs de efeito visual) ou `theme.css` está dentro do contrato. Editar a assinatura de props/tipos exportados, lógica, estado, handlers ou atributos de acessibilidade está fora — isso quebra quem consome o componente.

Isso significa:

- ✅ Trocar a paleta de cores → editar os valores de `--color-*` no `@theme` (e o espelho no bloco dark) em `theme.css`.
- ✅ Trocar a tipografia → editar `--font-display` / `--font-sans` / `--font-mono`, inclusive adicionando `@font-face` no topo do `theme.css` (ex. self-host de Google Fonts para funcionar offline no PWA).
- ✅ Ajustar raio de borda ou sombra → editar `--radius-*` / `--shadow-*`.
- ✅ Editar diretamente o `className` de qualquer elemento dentro de `src/components/ui/*.tsx` e `src/components/layout/*.tsx` para mudar aparência (cores, espaçamento, tipografia, animação, layout interno).
- ✅ Adicionar markup puramente decorativo (um ícone, uma div de gradiente, uma borda extra) desde que não altere o que o componente recebe (`props`) nem o que ele expõe (`onClick`, `value`, `children`, etc.).
- ❌ Mudar a interface exportada de um componente (nome/tipo de uma prop, remover uma prop existente, mudar o que uma função de callback recebe).
- ❌ Mudar lógica: como o componente decide `disabled`, como valida, o que dispara `onLogout`/`onClick`, etc.
- ❌ Remover atributos de acessibilidade (`aria-*`, `htmlFor`, `role`, `sr-only`) — pode reestilizar o elemento que carrega o atributo, mas o atributo em si fica.
- ❌ Adicionar cor/fonte fora do sistema de tokens (`className="bg-[#123456]"`, `style={{ color: '#fff' }}`) — sempre via utility ligada a um token de `theme.css`; se faltar um token, adicionar um novo em `theme.css` (não usar valor solto).
- ❌ Remover ou renomear uma variável de `theme.css` já em uso por outro componente sem avisar.
- ❌ Não editar `tailwind.config.js` — o Tailwind v4 deste projeto é 100% CSS-first, todo o tema vive em `theme.css`.

## Tokens disponíveis (`@theme` em `theme.css`)

| Grupo | Variáveis | Utilities geradas |
|---|---|---|
| Superfície/texto | `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-on-primary` | `bg-bg`, `bg-surface`, `bg-surface-raised`, `border-border`, `text-text`, `text-text-muted`, `text-on-primary` |
| Ação/marca | `--color-primary`, `--color-primary-hover` | `bg-primary`, `hover:bg-primary-hover`, `text-primary` |
| Estado | `--color-danger`, `--color-danger-bg`, `--color-success`, `--color-success-bg`, `--color-focus-ring` | `text-danger`, `bg-danger-bg`, `text-success`, `bg-success-bg` |
| Domínio (tipo de anúncio) | `--color-venda`, `--color-venda-bg`, `--color-doacao`, `--color-doacao-bg`, `--color-category`, `--color-category-bg` | `bg-venda-bg text-venda`, `bg-doacao-bg text-doacao`, `bg-category-bg text-category` |
| Tipografia | `--font-display`, `--font-sans`, `--font-mono` | `font-display`, `font-sans`, `font-mono` |
| Forma | `--radius-sm/md/lg` | `rounded-sm/md/lg` |
| Elevação | `--shadow-xs/sm` | `shadow-xs`, `shadow-sm` |

O espaçamento (`p-*`, `gap-*`, `m-*`) e o restante da escala tipográfica de tamanho (`text-sm`, `text-lg` etc.) usam a escala **padrão** do Tailwind — não foram sobrescritos, então não precisam de token próprio.

Todo o `@theme` tem um espelho em `@media (prefers-color-scheme: dark)` — a identidade visual deve cobrir os dois modos.

## Onde ficam os componentes

- `src/components/ui/` — primitivos (Button, Input, Select, Badge, Card, Spinner). Usados em qualquer página.
- `src/components/layout/` — casca da aplicação (Header, Footer).

Cada componente aplica as utilities Tailwind direto no JSX via `className` — não há `.css` por componente. Estados (`hover:`, `focus-visible:`, `disabled:`) também são utilities Tailwind, nunca CSS solto.

Ao editar um `.tsx` só para fins visuais, prefira mudar os valores dentro dos objetos `variantClasses`/`sizeClasses`/`paddingClasses` (onde existirem) e as strings passadas para `clsx(...)` — é onde a aparência de fato vive em cada componente.

## Placeholders atuais

`theme.css` hoje tem uma paleta neutra em escala de cinza só para os componentes serem visíveis e testáveis. Isso é intencionalmente "sem identidade" — é o estado esperado até a IA criativa aplicar a paleta/tipografia reais.
