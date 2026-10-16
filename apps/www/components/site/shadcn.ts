// The shadcn CLI version the docs pin for `init`. It moves only together with a clean install test
// (CONTRIBUTING.md); packages/ui/test/docs.test.mjs keeps README and Storybook on the same one.
export const shadcnInit = 'npx shadcn@4.21.4';

// After `init`, shadcn is a dependency of the project and `npx shadcn` runs that copy (ADR 0015).
export const shadcn = 'npx shadcn';
