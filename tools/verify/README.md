# Verification loop

Every change to a component should prove itself: the tests for that component run in a real
browser against a page in the docs app, and the run leaves behind a video and screenshot of each
test plus its accessibility results. A reviewer reads that proof.

The tests were Cypress tests run against Storybook. All of them now run here, and Cypress is gone.
The stories remain as the source of the test pages.

## One command

```sh
pnpm verify popover          # one or more components
pnpm verify --affected       # whatever your changes can affect, compared with origin/main
pnpm verify --all
pnpm verify popover -- --headed --workers=1    # anything after -- goes to Playwright
```

It checks that the generated files match their sources, runs the Playwright tests, and writes
the proof to `dist/.playwright/ui-e2e/proof/` (`index.html` to look at, `proof.md` for a comment).
The docs dev server is started for you, or reused if `pnpm nx serve app` is already running.

`pnpm verify --all --build` tests the production build instead. It builds the browser bundle once
(`VERIFY_BUILD=1 nx build app`, which leaves out the server bundle, the prerendered docs pages and
the Nitro server) and serves it as plain files with `tools/verify/serve.mjs`. Nothing is compiled
while the tests run, so a selection of any size runs in one go, and the tests see the code users
get. Use the dev server while working on a component and the build in CI.

Against the dev server, a large selection runs in groups of at most 60 test pages, each with a fresh dev server, because
the server keeps every page it has built in memory. The results are joined into one proof. Set
`VERIFY_MAX_PAGES` to change the group size.
First-time setup: `pnpm exec playwright install chromium ffmpeg`.

## Where things live

| What                           | Where                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| Test pages (generated)         | `apps/app/src/app/pages/(test)/test/<component>/` served at `/test/<component>/<story>` |
| Tests                          | `apps/ui-e2e/src/<component>/`                                                          |
| Test helpers                   | `apps/ui-e2e/src/support/`                                                              |
| Stories turned into test pages | `apps/ui-e2e/story-report.json`                                                         |
| CI                             | `.github/workflows/verify.yml`                                                          |

Open `/test` in the running docs app for a list of every test page.

## Test pages come from the stories

```sh
node tools/verify/story-to-test-pages.mjs tabs       # stories  -> test pages
pnpm verify tabs
```

The tool does not guess. A story it does not fully understand is left out and listed in the report
with the reason. It needs either a small change to the story so it fits a shape the tool handles,
or a new shape taught to the tool (`tools/verify/lib/story-parse.mjs`).

Do not edit generated test pages. `pnpm verify` fails when they differ from what the tool produces.

Tests are written by hand in `apps/ui-e2e/src/<component>/`.

## What the test pages keep the same

- **Story ids.** `export const NearViewportEdge` in a file titled `Popover` is
  `popover--near-viewport-edge` in Storybook and `/test/popover/near-viewport-edge` here.
- **Args in the address bar.** `?args=disabled:true;value:apple` works on a test page as it
  did in Storybook.
- **Text queries.** Testing Library's `findByText` matches an element's own text. The
  tests use `byText`, which does the same. Playwright's `getByText` matches differently.
- **Forced clicks.** `forceClick` fires the click events on the element itself, wherever it is.

## Only what a change can affect

`brain` and `helm` are one Nx project each, so Nx cannot tell a popover change from a tabs
change. `tools/verify/lib/affected.mjs` follows imports from each component's test pages into the
libraries and selects the components a changed file reaches. Changes to shared test setup select
everything.

```sh
pnpm verify --affected --list     # show the selection and the reason for each component
```

## Tests for the tools

```sh
node --test tools/verify/__tests__/cy/ tools/verify/__tests__/story/
```
