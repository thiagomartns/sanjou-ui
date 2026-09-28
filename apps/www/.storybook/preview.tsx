import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Axe violations fail the Vitest run (and show in the a11y panel).
    a11y: { test: 'error' },
    backgrounds: { disable: true },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;
