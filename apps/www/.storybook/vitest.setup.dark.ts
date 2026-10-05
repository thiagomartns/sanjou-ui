import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import type { Decorator } from '@storybook/react-vite';
import { setProjectAnnotations } from '@storybook/react-vite';

import * as projectAnnotations from './preview';

// addon-themes applies its class in a Storybook `useEffect`, which only runs on the real preview's
// render event, never in Vitest. Apply `.dark` synchronously so axe checks the dark colors.
const withDarkClass: Decorator = (Story) => {
  document.documentElement.classList.add('dark');
  return Story();
};

// Same as vitest.setup.ts, but every story renders in the dark theme.
setProjectAnnotations([
  a11yAddonAnnotations,
  projectAnnotations,
  { initialGlobals: { theme: 'dark' }, decorators: [withDarkClass] },
]);
