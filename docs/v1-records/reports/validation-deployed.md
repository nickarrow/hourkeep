# Validation — Deployed State of HourKeep (READ-ONLY)

**Scope:** Reconcile the DEPLOYED STATE claims in `.agents/reports/w8a-status-report.md` §4 against the
actual build output, not just source. Validated at commit `1307625847a0565908b109d74438993662fc9f91`
(`main`, matches the report's "Deployed commit: 1307625"). Working tree clean at validation time.

**Method:** Read the source files named in the brief, ran `npm run build` (exit 0), and inspected the
emitted `out/` bundle (HTML + minified JS chunks). Every claim below is tagged in-source and/or in-bundle.

---

## Summary answer

| # | Claim under test | Verdict |
|---|---|---|
| 1 | Build emits `out/export/package` (new route) and `out/export` | **CONFIRMED** (bundle) |
| 2 | Export page offers all three: Build Evidence Package + Download JSON + Download Report | **CONFIRMED** (source + bundle) |
| 3 | Legacy `handleExportJSON` reads `db.profiles` directly (ciphertext) and omits documents/blobs | **CONFIRMED** (source + bundle) |
| 4 | Deploy gates on tsc+test+lint+build, uploads `./out`, and does NOT run `test:e2e` | **CONFIRMED** (source) |
| 5a | Manifest basePath correct ("(none)"), no stale `/hourkeep` base-path refs | **CONFIRMED** (bundle) |
| 5b | Build emits a service worker + manifest | **PARTIAL — manifest yes, service worker NO** |
| 6 | No user-facing verdict string in the deployed bundle | **CONFIRMED** (bundle), with identifier-level caveat |
| §4 | Pre-rebuild dangerous verdicts ("COMPLIANT", "you are exempt", "automatically meet") gone from running app | **CONFIRMED** (bundle) |

**Headline:** Every §4 claim the brief asked about is CONFIRMED, with one adjacent finding the report does
not surface and should: **the deployed PWA ships no service worker.** `next-pwa@5.6.0` is configured but
is a Webpack plugin, and the build runs on **Turbopack** (Next 16), so the SW/workbox step never runs.
HourKeep is therefore not offline-capable or installable as a PWA in the shipped `out/`, despite being
described as an offline-first PWA in the project docs.

---

## Evidence

### 1. Build output contains both routes — CONFIRMED (bundle)

`npm run build` completed with exit 0. The Next route table printed both:

```
├ ○ /export
├ ○ /export/package
```

Full route list in `out/` (12 HTML pages):
`/`, `/_not-found`, `/exemptions`, `/export`, `/export/package`, `/how-to-hourkeep`,
`/how-to-hourkeep/results`, `/onboarding`, `/settings`, `/tracking`, plus `404.html` and
`generate-icons.html`.

On disk: `out/export.html` (12,655 bytes) and `out/export/package.html` (13,638 bytes) both exist and are
non-empty. The package route's `__next.export.package.__PAGE__.txt` references real client chunks
(`ClientPageRoot` + hydration bundles), i.e. a rendered page, not a stub.

### 2. All three export surfaces are reachable — CONFIRMED (source + bundle)

`src/app/export/page.tsx` renders four MUI `<Paper>` cards, three with action buttons:

- **"Download JSON"** → `onClick={handleExportJSON}`
- **"Build Evidence Package"** → `onClick={() => router.push("/export/package")}`
- **"Download Report"** → `onClick={handleExportReadable}`

(A fourth card header "Evidence Package" is the section title above the Build button.)

Because these are `"use client"` components, the labels are not in the server-prerendered HTML; they live
in the hydration JS. Confirmed in the shipped bundle:

```
"Download JSON"           -> in 1 chunk
"Build Evidence Package"  -> in 1 chunk
"Download Report"         -> in 1 chunk
```

A user landing on `/export` can reach all three. CONFIRMED.

### 3. Legacy JSON artifact is weak — CONFIRMED (source + bundle)

`handleExportJSON` in `src/app/export/page.tsx` builds its export object from:

```ts
const profiles = await db.profiles.toArray();   // RAW table read — ciphertext, not getProfile()
...
const exportData = {
  exportDate, profile: profiles[0] || null,
  activities, incomeEntries, exemptions, complianceModes,
  version: "2.0",
};
```

- **Ciphertext path:** it reads `db.profiles` directly rather than decrypting through `getProfile`
  (contrast `handleExportReadable`'s evidence-package path, which the report says decrypts). So the stored
  profile ciphertext is written verbatim into the JSON.
- **Omits documents:** the object includes no `documents`, `documentBlobs`, `incomeDocuments`, or
  `incomeDocumentBlobs`. Those tables exist in the schema (`src/lib/db.ts`: `documents`, `documentBlobs`,
  `incomeDocuments`, `incomeDocumentBlobs`). The JSON leaves the user's pay stubs and attachments behind.

Verified in the shipped minified bundle (identical shape):

```
exportDate:new Date().toISOString(),profile:e[0]||null,activities:t,incomeEntries:r,
exemptions:o,complianceModes:a,version:"2.0"
```

`profile:e[0]` is the raw `toArray()` element; no document tables are referenced. CONFIRMED at bundle
level. The report's §3/§4 characterization ("legacy JSON ships ciphertext + omits documents") is accurate.

### 4. CI gate — CONFIRMED (source)

`.github/workflows/deploy.yml`, `build` job, in order:

1. `npm ci`
2. **Type check** — `npx tsc --noEmit`
3. **Test** — `npm test` (Vitest)
4. **Lint** — `npm run lint`
5. **Build** — `npm run build`
6. **Upload artifact** — `actions/upload-pages-artifact@v3` with `path: ./out`

Trigger: `push` to `main` (and manual `workflow_dispatch`). The `deploy` job `needs: build` and runs
`actions/deploy-pages@v4`.

**`test:e2e` is absent from CI.** There is no Playwright step anywhere in the workflow, so the e2e specs
(the report says 88) do NOT gate deployment. A push to `main` that passes tsc + Vitest + lint + build
deploys regardless of e2e state. This matches the report and the project's own engineering standard
("Not in the CI deploy gate, so nothing forces it").

### 5. PWA / service worker / manifest / basePath

**5a. Manifest + basePath — CONFIRMED (bundle).**
- `out/manifest.json` is emitted (954 bytes), well-formed, with `start_url: "/"` and icon `src` values
  rooted at `/` (e.g. `/icon-192x192.png`) — no `/hourkeep` prefix.
- `out/export.html` links it as `<link rel="manifest" href="/manifest.json"/>` — correct, no base-path
  prefix. The build log line "✓ Updated manifest.json with basePath: (none)" matches
  `next.config.ts` ("No basePath needed with custom domain (hourkeep.app)").
- **No stale `/hourkeep` base-path references.** A full-text scan of `out/` found exactly one `/hourkeep`
  occurrence, and it is a benign GitHub repository URL in a JS chunk
  (`https://github.com/naretakis/hourkeep`), not a routing/asset path. The old GitHub-Pages base-path bug
  is NOT present in this bundle.

**5b. Service worker — NOT emitted (bundle). This is a finding the report omits.**
- No `sw.js`, `sw.js.map`, `workbox-*.js`, or any `*service-worker*` file exists in `out/` or in `public/`
  (next-pwa's configured `dest`). No `serviceWorker.register` call appears in any HTML or JS chunk in
  `out/`.
- `next-pwa@5.6.0` IS installed and IS wired up in `next.config.ts`
  (`withPWA({ dest: "public", register: true, skipWaiting: true, disable: NODE_ENV === "development" })`).
- Root cause: next-pwa 5.6.0 is a **Webpack** plugin; it injects the SW via a Webpack build hook. The
  build runs on **Turbopack** ("▲ Next.js 16.0.1 (Turbopack)" in the log), which does not run next-pwa's
  Webpack hook. So the manifest (written by the separate `scripts/update-manifest.js` post-step) ships,
  but the service worker silently does not. `NODE_ENV` is `production` during build, so the `disable`
  flag is not the cause.
- **Impact:** the deployed app has a manifest (so the browser may offer an install prompt) but no runtime
  caching and no offline capability — contradicting the "offline-first PWA" framing in
  `getting-started.md`. This is distinct from the previously-fixed "dead manifest link" bug noted in that
  doc; the manifest is now correct, but the SW is absent entirely.
- **Caveat:** this validates the *static build artifact only*. If a service worker was emitted by a
  previous (Webpack-based) build and committed/deployed earlier, a browser could still have a stale SW
  registered against hourkeep.app. I could not verify the live site's runtime from here (read-only, no
  network check of production). The report's §5 item 1 ("service-worker offline path unautomated") gestures
  at this area but understates it: the issue is not that the path is *unautomated*, it is that the artifact
  is *not produced at all* under Turbopack.

### 6. User-facing verdict strings in the bundle — CONFIRMED gone, with identifier caveat

Case-insensitive scans of the entire `out/` bundle:

- **"you are exempt" / "you're exempt" / "youre exempt": 0 matches.**
- **"automatically meet": 0 matches.**
- **"compliant": 29 matches — all internal identifiers/data values, none user-facing copy.** Every hit is
  one of: the `isCompliant:` object property (a data-model field, e.g. `isCompliant:m>=g`),
  `complianceStatus:"compliant"` (an enum value), or a local risk-level variable `c="compliant"`. None is
  a rendered sentence such as "You are compliant" or "✓ COMPLIANT".
- **"exempt": 368 matches — overwhelmingly domain identifiers** (`exemptions` table, `isExempt`,
  `exemptionCategory`, `onCheckExemption`, DB store declarations). The only user-facing strings in that
  set are **hedged, not verdicts**: "Your answers suggest …", "Answers suggested this …", "Check if I'm
  exempt anyway", "let's check if you might be exempt". These are invitational/suggestive, consistent with
  the ADR-0003 "never assert status" rule.

**The ambiguity the brief flagged is real and resolves favorably:** the raw grep counts are dominated by
the `isCompliant` / `exempt*` *identifiers* in minified JS, which are code, not copy. Separating them from
rendered text shows **no banned verdict copy ships**. The §4 claim ("COMPLIANT verdicts, 'you are exempt'
gone from running app") is CONFIRMED at the bundle level.

Note (not a §4 defect): the persistence of `isCompliant` as a property name and `exemption*` as the domain
vocabulary is the known, deferred terminology/identifier work (report §3: "isCompliant renames → W7b";
domain rule prefers "community engagement" and three-tier "exclusion" language). It is a code-identifier
smell, not a user-facing verdict, and out of scope for the §4 deployed-copy claim.

---

## Supporting facts verified in passing

- Schema `HourKeepDB` is at **Dexie version 6** (`this.version(6)` is the highest in `src/lib/db.ts`),
  matching the report's "HourKeepDB still v6 / No Dexie bump."
- `package.json` version is **7.2.0** (build banner `hourkeep@7.2.0`), matching report §6's note that the
  package version was not bumped for the HR1 behavior changes.
- Build is clean (exit 0). Only noise is a repeated `baseline-browser-mapping` "data over two months old"
  advisory — informational, not a failure.

---

## Conclusions

1. **The report's §4 deployed-state claims are accurate.** Routes, the three export surfaces, the weak
   legacy JSON, the CI gate shape (no e2e), and the absence of verdict copy all check out against the
   actual `out/` bundle, not just source.
2. **One real gap the report does not call out: the shipped bundle contains no service worker.** The app
   is described as offline-first but ships without offline capability under the Turbopack build. This is
   the most consequential finding here and belongs in the deployed-state picture.
3. **The verdict-string "gone" claim survives scrutiny** once code identifiers are separated from rendered
   copy — but the lingering `isCompliant` / `exemption` identifiers mean an automated grep gate on those
   words would false-positive. Any future "no verdict strings" check must target rendered text, not raw
   token matches.

## Recommendations (implement nothing — for triage)

- **PWA/SW (high):** Decide explicitly whether offline is in-scope for the deployed app. If yes, next-pwa
  5.6.0 is incompatible with the Turbopack build; options are (a) build this app with Webpack rather than
  Turbopack, (b) move to a Turbopack-compatible SW approach (e.g. Serwist / a hand-rolled SW + manifest
  injection), or (c) formally downgrade the "offline-first PWA" claim in the docs until a SW ships. Add an
  e2e/Lighthouse assertion that a SW registers, so this cannot silently regress again. Verify the *live*
  hourkeep.app registration separately, since a stale SW from an earlier Webpack build may still be active
  in some browsers.
- **Legacy JSON (medium, already tracked → W8b):** the ciphertext-leaking, document-omitting JSON is a
  real data-fidelity and privacy wart. Until W8b, consider at minimum a UI caveat that the JSON export is
  incomplete (no documents) and raw.
- **CI (low, by design):** `test:e2e` not gating deploy is deliberate per the engineering standard, but
  given the two production bugs e2e previously caught, consider adding it as a required check (or a
  Lighthouse PWA budget) before the Jan 2027 reliance window.
- **Verdict-string guard (low):** if a CI guard scans for banned verdict copy, scope it to user-facing
  content/rendered text, not minified identifiers, to avoid false positives on `isCompliant`/`exemption*`.

---

*Validation performed read-only. No files were edited, no commits made, no servers started. `npm run build`
was run and regenerated `out/` and `.next/` (both gitignored build artifacts).*
