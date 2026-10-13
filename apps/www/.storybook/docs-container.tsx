import { useEffect, useState, type PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import { sanjouDark, sanjouLight } from './sanjou-theme';

type Globals = { theme?: string };

function initialTheme(context: DocsContainerProps['context']) {
  // The store holds the toolbar globals for every Docs page, including MDX pages
  // with no stories of their own. `store` is not in the public DocsContext type.
  const { store } = context as unknown as { store?: { userGlobals?: { get(): Globals } } };
  return store?.userGlobals?.get().theme;
}

/** Switches the Docs page theme with the toolbar theme toggle (addon-themes `theme` global). */
export function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState(() => initialTheme(context));

  useEffect(() => {
    const onGlobals = ({ globals }: { globals: Globals }) => setTheme(globals.theme);
    context.channel.on(GLOBALS_UPDATED, onGlobals);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobals);
  }, [context.channel]);

  return (
    <DocsContainer context={context} theme={theme === 'dark' ? sanjouDark : sanjouLight}>
      {children}
    </DocsContainer>
  );
}
