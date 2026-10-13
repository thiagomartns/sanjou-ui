# Contributing to Sanjou UI

Thanks for helping. This guide covers how changes get in and how releases go out. For setup and commands, see the [README](README.md). For how to build a component, see the checklist in [`CLAUDE.md`](CLAUDE.md#adding-a-component-checklist).

## How to contribute

**Without write access** (most people): fork the repository, create a branch from your fork's `develop`, and open a pull request against `develop` here. CI runs on your PR without access to any secret; first-time contributors wait for a maintainer to approve the run.

**With write access:** create the branch in this repository, from an up-to-date `develop`.

Either way you push with your own credentials. What gets merged is controlled by the branch rulesets and by review.

## Branches

| Branch                                                  | Branches off | Merges into            |
| ------------------------------------------------------- | ------------ | ---------------------- |
| `feature/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*` | `develop`    | `develop`              |
| `hotfix/*`                                              | `main`       | `main`                 |
| `develop` (integration)                                 | —            | `main` (promotion)     |
| `main` (released code; never commit to it directly)     | —            | `develop` (back-merge) |

## Pull request titles

Pull requests into `develop` are squash-merged, and the PR title becomes the commit message. Release automation reads those commits to pick the next version, so **the title must follow [Conventional Commits](https://www.conventionalcommits.org/)**. The `PR title` check enforces it.

```
feat(select): add a clearable variant
fix(tokens): raise muted-foreground contrast in dark mode
docs: explain the back-merge
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. The scope is optional and free-form.

| Title                                        | Version bump while in `0.x` | After `1.0.0` |
| -------------------------------------------- | --------------------------- | ------------- |
| `fix: …`                                     | patch                       | patch         |
| `feat: …`                                    | minor                       | minor         |
| `feat!: …` or a `BREAKING CHANGE:` footer    | minor                       | major         |
| `docs`, `chore`, `ci`, `test`, `refactor`, … | none on its own             | none          |

Commits inside your branch are squashed away, but please write them in Conventional Commits too.

## Merge methods

| Pull request                      | Method                         | Title                                     |
| --------------------------------- | ------------------------------ | ----------------------------------------- |
| Feature or fix branch → `develop` | **Squash**                     | Conventional Commits, as above            |
| `develop` → `main` (promotion)    | **Merge commit**               | `chore(release): promote develop to main` |
| Release PR → `main`               | **Squash**                     | Generated: `chore(main): release X.Y.Z`   |
| `hotfix/*` → `main`               | **Squash**                     | `fix: …`                                  |
| `main` → `develop` (back-merge)   | **Merge commit, never squash** | `chore: back-merge vX.Y.Z into develop`   |

The rulesets allow both squash and merge commit on `main` and `develop`, so picking the right one is on whoever merges. A squashed back-merge does not link the histories, and the next promotion conflicts in `package.json` and `CHANGELOG.md`. If that happens, fix it with a new merge-commit back-merge that resolves the conflicts.

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please). All published packages (`@sanjou/tokens` and `@sanjou/ui`) share one version and one `vX.Y.Z` tag.

1. A maintainer opens the promotion PR `develop` → `main` and merges it with a merge commit.
2. release-please opens (or updates) the Release PR against `main`, with the version bump and the `CHANGELOG.md` entry. Review both.
3. Merging the Release PR tags `vX.Y.Z`, creates the GitHub Release and publishes both packages to npm with provenance.
4. The GitHub Release deploys the docs site and registry (Vercel) and the Storybook (GitHub Pages), and opens the back-merge PR `main` → `develop`.
5. A maintainer merges the back-merge PR with a merge commit.

Production only deploys on a release. Feature branches never get a version. Moving to `1.0.0` is an explicit decision, made with `release-as` in `release-please-config.json`.

A version published to npm can never be reused. A bad release is fixed with `npm deprecate` and a new patch release, never with `npm unpublish`.

## Hotfixes

1. Branch `hotfix/<name>` off `main`.
2. Open a PR into `main` titled `fix: …` and squash-merge it. release-please updates the Release PR with a patch version.
3. Merge the Release PR: tag, npm publish and deploy, as in a normal release.
4. The automatic back-merge PR brings the fix to `develop`. Merge it with a merge commit.

## Decisions and AI artifacts

Architecture and tooling decisions (a library, a pattern, a workflow) are recorded as ADRs in [`docs/adr/`](docs/adr/README.md). If your change makes one, add an ADR from the template in the same PR.

Plans, run reports and session drafts, including those written with AI tools, go in `.ai/`, which is git-ignored. Do not commit them; put task reports in the PR description. See [ADR 0001](docs/adr/0001-adrs-and-ai-artifacts-outside-git.md).
