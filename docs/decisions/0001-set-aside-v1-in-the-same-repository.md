# 0001. Set aside v1 in the same repository, and adopt the bootstrap

Date: 2026-10-16

Status: Accepted

## Context

HourKeep v1 was built between 2025-11-01 and 2026-10-15: 186 commits, package version 7.2.0 plus unreleased work
through its wave W8a. It was a Next.js 16 static export with MUI, Dexie and next-pwa, deployed by GitHub Pages and
served at hourkeep.app through Cloudflare. It started as an experiment to see what was possible, and it became the
place where most of the domain research for this project happened.

On 2026-10-15 the owner decided to build a v2 for real use and to treat v1 as the first experiment. The reasons, each
checked on 2026-10-15:

- v1 had 28,771 lines of non-test TypeScript under `src/`, with five files over 800 lines.
- Its offline promise was not kept. next-pwa is a Webpack plugin, and every version of v1's `package.json` pins
  Next.js 16.0.1 with a plain `next build`, which builds with Turbopack. No build appears to have produced a service
  worker: hourkeep.app/sw.js returns 404 and no `sw.js` appears in any commit.
- Four steering files loaded into every agent session, with two more on file match.
- v1's own validation that day found the Settings screening flow dead-ended and the JSON export wrote ciphertext and
  left out every document. It recorded `npm audit` reporting 23 vulnerable packages across the dependency tree, the one
  critical being a remote code execution advisory against next@16.0.1 (GHSA-9qr9-h5gf-34mp).
- v1 has no users, so nothing has to be migrated.

The owner chose to keep this repository rather than start a new one, and to adopt the agentic engineering bootstrap
as the way of working.

## Decision

v1 is preserved on the branch `experiment-1` and the annotated tag `experiment-1-final`. The tag marks commit
`e8e07ab`, the last commit of v1's working life. The branch starts there and carries one later commit, which adds v1's
review records (see below). The branch is kept indefinitely. Both are pushed to GitHub before `main`, so v1 is on
GitHub before `main` stops carrying it.

v1 is removed from the working tree of `main` rather than moved into an archive folder. Git history already holds every
file. An archive folder would have put v1's 309 files and 2,493 matches for "exempt" in front of every search an agent
runs, and v1's 43 test files in front of any test runner that was not told to skip them (counted 2026-10-16). This
change deletes 310 tracked files: those 309, less `README.md` and the issue form's `config.yml`, which are rewritten in
place, plus three `.DS_Store` files that should never have been committed.

These stay in the tree:

- `docs/domain/`, unchanged apart from a stray `.DS_Store`: the IFC text and its cited extract, the § 435.603 text,
  HR1, and Code for America's service blueprints.
- `LICENSE`, unchanged.
- The icons, `CNAME` and `.nojekyll` in `public/`. Under a GitHub Actions deployment the last two do nothing; the
  custom domain lives in the repository's Pages settings.
- `.github/workflows/deploy.yml`, rewritten to publish the placeholder below.

The bootstrap is adopted unmodified, at release 2026.10.15 (commit `198a400` of
github.com/nickarrow/agentic-engineering-bootstrap). Its 12 starter files were copied byte for byte. Its `.gitignore`
was merged with the v1 rules that still apply, minus v1's Next.js rules.

Until v2 is ready, hourkeep.app serves one static placeholder page, in English with a Spanish section. It tells
someone holding a letter to contact the office that sent it before the letter's deadline, and explains the right to
appeal through a fair hearing. GitHub Pages also serves it as the 404 page, so old v1 links land on it. The file has no
scripts and loads nothing from other sites. On 2026-10-16, though, Cloudflare added its Web Analytics script
(static.cloudflareinsights.com) to v1's live pages for browser requests, and sent Network Error Logging headers that
ask browsers to report failed requests to Cloudflare. Both are zone settings, so the placeholder will get them too
unless the owner switches them off.

## Where v1's material went

| v1 material | Where it is now |
|---|---|
| Code, tests, configuration, build scripts | `experiment-1` |
| Planning: PRD, gap analysis, nine ADRs, wave files, audits (`docs/hr1-readiness/`, `docs/audit/`) | `experiment-1` |
| Kiro steering, hooks, specs, archived specs (`.kiro/`) | `experiment-1` |
| README, ROADMAP, CHANGELOG, release notes, branding, deployment and PWA guides | `experiment-1` |
| Issue templates, which described v1's Settings screen | `experiment-1` |
| Review records v1's `.gitignore` kept out of every commit: the 2026-10-15 status report and the four validation reports that checked it, reviewer reports from waves W6a, W7a and W8a, three multi-model review runs and one semantic review, 25 files | `experiment-1`, in `docs/v1-records/`, added by the commit after `e8e07ab` |
| Domain research (`docs/domain/`) | Kept in the tree |
| The local branch `feat-find-your-path`, three commits from November 2025 that were never merged, and one stash on it | Not preserved. The owner chose to let them go on 2026-10-16. They remain on the owner's machine only |

v2's design will argue, rather than assume, which of v1's decisions carry forward. The likeliest are evidence rather
than adjudication (v1 ADR-0003), the export rules (ADR-0006), State elections kept in a policy profile (ADR-0001), and
the rejection of a MAGI service (ADR-0008). Whatever survives will be restated in `docs/design.md` with its citations,
so v2 does not depend on reading v1.

v1's always-on domain steering summarized `docs/domain/cms-2454-ifc/rule-extract.md`. Two of its corrections are
confirmed present in that file: the § 435.603(d)(2) filing-threshold reading at lines 225 to 227, and the withdrawn
claim that seasonal-worker status is an objective test at lines 255 to 257. The rest of that file was not compared.

## Setup checks

Run on 2026-10-16, as the bootstrap's README asks:

- The owner merged the bootstrap's deny and ask rules into a permissions file that already held one allow-all rule.
  Read back, it holds three rules. Kiro's documentation says deny beats ask beats allow in every scope.
- The guard refused to read `sensitive/FAKE-eligibility-extract.csv` and named both the rule and the file it came from.
- `AGENTS.md` reached this session as rules once it was copied in, and the five skills were offered. All five review
  steps that ran as Kiro workflow steps the same day reported both too, which answers an open question in the
  bootstrap's changelog: workflow steps do get skills that sit at the top level.
- The owner turned off Kiro's content collection for service improvement on 2026-10-16. It had been on until then.

## Consequences

Sessions now start from `AGENTS.md` and five skills that load on demand, instead of v1's four always-on steering files.
Searches and test runners see only v2.

Thirty-two lines in four kept files under `docs/domain/` name v1 decision records, wave names or files, `src/` paths
or v1 steering files (counted 2026-10-16). They resolve on `experiment-1` and get fixed when that material is next
edited. So do four errors found by the 2026-10-15 SNAP research: `what-matters-most.md` line 140 cites 91 FR 33385 for
a sentence on 91 FR 33377; `medicaid-work-requirements-cfa-service-blueprint.md` line 68 says "meeting" SNAP rules
where the test is being subject to them; `snap-work-requirements-cfa-service-blueprint.md` line 51 says "18 or
younger" where the statute says under 18; and `hr1/HR1-Impact-Summary.md` lines 17 to 34 omit the section 10102(a)
changes to SNAP.

There is no HourKeep-specific domain skill yet. Until v2 writes one, the generic `hhs-benefits` skill and
`docs/domain/` carry the rules, and a session working on domain logic has to be pointed at `docs/domain/` by name.

Pushing `main` replaces v1 at hourkeep.app with the placeholder, once the deploy workflow finishes. Pages sends the HTML
with a ten-minute cache lifetime, so a browser can show v1 for up to ten minutes after that. If the deploy fails, v1
stays live.

Left for later, each its own fix:

- The workflow's four actions are majors written for Node.js 20, which GitHub now runs on Node.js 24 with a
  deprecation warning. v1's last deploy used them and succeeded on 2026-10-15. Upgrading changes what gets published,
  because upload-pages-artifact v4 and later leave out dotfiles by default.
- hourkeep.app is not a verified domain in the owner's GitHub account, which GitHub recommends against takeover, and
  GitHub cannot enforce HTTPS while Cloudflare proxies the domain. Plain-HTTP requests are answered without a redirect.
  Both are settings for the owner, in GitHub and in Cloudflare.
- The repository's description and latest release on GitHub still describe v1.

"v2" is a nickname. v1's tags `v2.0.0` through `v7.0.0` already exist, so v2's releases need another scheme. Dated
versions, as the bootstrap uses, are proposed and not yet decided.

The license stays GPL-3.0-or-later for now. The bootstrap files travel under MIT through `NOTICE.md`. Whether v2 keeps
GPL is open.

## Alternatives considered

A new repository. The bootstrap's `HOW-TO-WORK.md` suggests a new repository with the old one kept as a reference,
for an inherited codebase that is hard to read. Rejected by the owner: with no users there is nothing to protect, and
keeping the repository keeps the domain, the Pages configuration and the history in one place.

An archive folder inside the tree. Rejected for the search and tooling noise counted above.

Leaving v1 live until v2 is ready. Rejected, because v1 claimed to work offline when it did not and its Settings
screening flow led nowhere.
