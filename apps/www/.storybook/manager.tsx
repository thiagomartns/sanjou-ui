// The manager bundle compiles JSX with the classic runtime (React.createElement).
import React from 'react';
import { GithubIcon } from '@storybook/icons';
import { addons, types } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';

import { sanjouDark, sanjouLight } from './sanjou-theme';

const REPO_URL = 'https://github.com/thiagomartns/sanjou-ui';

const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({ theme: dark ? sanjouDark : sanjouLight });

// The logo goes to the Storybook home (default `./`); the repository gets its own toolbar link.
addons.register('sanjou/github', () => {
  addons.add('sanjou/github/link', {
    type: types.TOOLEXTRA,
    title: 'GitHub repository',
    render: () => (
      <IconButton asChild>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the GitHub repository"
          title="Open the GitHub repository"
        >
          <GithubIcon />
        </a>
      </IconButton>
    ),
  });
});
