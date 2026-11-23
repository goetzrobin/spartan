# Ratchet

`pnpm ratchet` counts things we want to see less of in `libs/brain` and `libs/helm`, and compares each count
with `baseline.json`. It fails (exit 1) if any count is above its baseline. Counts may only go down. Run one section with
`--only <section>`, for example `pnpm ratchet --only structure`. The run prints how long each section took.

## Sections

All counts cover library source only. Specs, tests, stories, `test-setup.ts` and `src/testing/` are left out.

- `lint`: findings of the type-safety rules in `eslint.ratchet.config.cjs`.
- `structure`, read with the TypeScript parser:
  - `commentLines`: lines inside comments. JSDoc on an exported declaration, a class member, or a member of an
    exported interface or type alias does not count, and neither do directives (`eslint-disable`,
    `prettier-ignore`, `@ts-...`).
  - `cdkImportFiles`: files that import from `@angular/cdk`.
  - `filesOver300Lines`: files longer than 300 lines.
  - `classesThatExtend`: classes with an `extends` clause.
  - `lintDisables`: `eslint-disable`, `eslint-disable-next-line` and `eslint-disable-line` comments.
  - `privateGetters`: `get` accessors that are private.
- `types`, `exactOptionalPropertyTypes`: compiler errors when each library is built with that flag
  (`ngc --noEmit`). This is the slow section.
- `shadcnParity`, helm only: compares helm's classes for each `spartan-<part>` with shadcn's for `cn-<part>`,
  in the `vega` style (set once, as `STYLE` in `lib/parity.mjs`). Each side's classes are its CSS `@apply`
  rule for the part (`libs/registry/src/styles/style-vega.css` for helm) plus the string in the code that
  carries the marker and the plain strings next to it in the same call or array. It counts classes only in
  helm, classes only in shadcn, and shadcn parts with no helm marker.
  `pnpm ratchet --only shadcnParity --report` lists the differences part by part.

## Lowering a baseline

When you fix something, the run says which baseline can come down. Run `pnpm ratchet --update` and commit the
new `baseline.json`. `--update` only lowers numbers (and adds new metrics). It never raises one.

## Accessibility baseline

`a11y-baseline.json` holds, for every test page, the number of axe violations (rules, not elements) the
page check in `apps/ui-e2e` records. `pnpm ratchet` does not read it. The `proof` job of the verify workflow
compares it with the pages that ran in that pull request and fails if a page has more violations or is not in
the baseline. Pages that did not run are not judged. After fixing violations, lower it from a results file
that covers the fixed pages (numbers only go down; new pages are added):

```sh
node tools/verify/decision.mjs --results <file> --a11y-baseline tools/ratchet/a11y-baseline.json --a11y-update tools/ratchet/a11y-baseline.json
```

## Refreshing the shadcn snapshot

The shadcn side is read from `shadcn-classes.json`, so CI does not need a shadcn checkout. To refresh it:

```sh
node tools/ratchet/shadcn-snapshot.mjs --from ../shadcn-ui/ui
```

This reads `style-vega.css` and the base `ui/*.tsx` files of that checkout and records its commit. Then run
`pnpm ratchet --only shadcnParity --report` to see what changed, and commit the snapshot with the baseline.

## Allowing an intended difference

Add the classes to `shadcn-allow.json` under the part, with a reason. Allowed classes are not counted; lower
the baseline afterwards with `pnpm ratchet --update`.

```json
{
	"tooltip-content": {
		"onlyInHelm": ["text-balance"],
		"onlyInShadcn": [],
		"reason": "Long tooltips wrap more evenly."
	}
}
```
