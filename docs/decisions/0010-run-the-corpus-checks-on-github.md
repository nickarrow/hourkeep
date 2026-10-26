# 0010. Run the corpus checks on GitHub for every push and pull request

Date: 2026-10-26

Status: Accepted on 2026-10-26, decided by the owner

## Context

`AGENTS.md` asks for the checker's tests and the checker to pass under `python3` and under Python 3.9, the oldest the
checker supports, after any change to `docs/domain/`, the domain skill, the checker or its tests. Until now they ran
only when a session or a person remembered to run them. `.github/workflows/deploy.yml`, which publishes the placeholder
site, was the repository's only workflow. The first pull request from outside,
[#1](https://github.com/nickarrow/hourkeep/pull/1), was made in a container with only Python 3.13, and its description
said so. `CONTRIBUTING.md` says both checks must pass under Python 3.9 and under a current Python before a change
merges, and asks a contributor who adds a workflow for a passing run of it (decision record 0008). Nothing but a
contributor's own report showed whether the checks passed, and under which Python.

## Decision

`.github/workflows/checks.yml` runs both checks under Python 3.9 and Python 3.14 on every push, on every pull request,
and by hand. Running on every push, a branch's included, lets a branch pushed before its merge show its run. Python
3.14 is the newer of the owner's two Pythons, `/opt/homebrew/bin/python3`, and the second entry moves when that one
does.

- It asks for `contents: read` and nothing else, uses no secret beyond the job's own read-only token, and checks out
  without keeping that token in the clone (`persist-credentials: false`).
- Each action is pinned to the full commit of a release, with the release named in a comment: `actions/checkout`
  v7.0.1 and `actions/setup-python` v7.1.0. A tag can be moved to point at other code, and a commit cannot. Both are
  MIT, which decision record 0002 lists as compatible.
- It runs on `ubuntu-24.04`. `ubuntu-latest` becomes Ubuntu 26.04 in November 2026, and `actions/setup-python`
  installs only the versions built for an image: Python 3.9 has builds for 22.04 and 24.04 and none for 26.04.
- Each job stops after 20 minutes. The two Pythons run side by side, and one failing does not cancel the other.
- The check does not block a merge. No branch protection requires it, because the owner merges his own branches into
  `main` without a pull request, as `AGENTS.md` describes under "How to work". `AGENTS.md`, under "This repository",
  says a red check on `main` is fixed before the next change.

The repository's Actions settings change with it. Every run from an outside contributor's pull request waits for the
owner's approval, where before only a first-time contributor's did, and only actions created by GitHub may run.
`CONTRIBUTING.md` and `README.md` say the checks run on GitHub.

## Consequences

A contributor sees the result on their pull request once the owner approves the run. Before approving, the owner reads
what the pull request changes under `.github/`, `scripts/` and `tests/`, because the run uses the pull request's own
versions of them. For the same reason, a green check on a pull request that changes them counts only after reading
those changes, and the run on `main` after the merge is the one that counts. A pull request with a merge conflict gets
no run until the conflict is resolved. Only the owner can merge, since nobody else has access to the repository.

The check reads what was committed. A local run also reads files not yet committed, so the check catches what a local
run cannot, such as review pages rebuilt and never committed.

The tests of the PDF extraction script skip on Linux, as they do on any machine without macOS and swift, so they still
run only on a Mac with swift, such as the owner's.

The pinned commits move by hand: a new release means editing the commit and its comment together, prompted by a Node
deprecation warning in a run's log or an advisory against either action.

When GitHub retires `ubuntu-24.04`, the choice is a job in a `python:3.9` container or raising the oldest supported
Python, with a record of its own.

`deploy.yml` keeps its actions on major tags, written for Node.js 20, which decision record 0001 left for a fix of its
own.

## Alternatives considered

Staying local, as before: each person runs the two commands, and only their report shows the result.

Major tags such as `@v7`, the style `deploy.yml` uses. Shorter to read, but a tag can be moved.

A workflow dependency lockfile, which GitHub now ranks above pinning to commits. It is in public preview, and neither
action here has actions of its own to lock. Revisit it when it is generally available, together with `deploy.yml`.

Dependabot, to raise each new release as a pull request. The owner does not work through pull requests, and two pins
move rarely.

Running only on pushes to `main` and on pull requests. A branch pushed before its merge would show no run.

Running only when a path the checks cover changes. One input left out of the filter would fail silently, with no run
at all, and the checks take three to five minutes on the owner's Mac and cost nothing on a public repository.

A required status check on `main`. It would make the owner open a pull request for his own work, which `AGENTS.md`
rules out.

`3.x`, the newest Python, in place of 3.14. It would catch a change in a new release sooner, and it would change under
the project without anyone choosing it.

A macOS job as well, so the extraction tests run. Not now: they cover one script, and they run on the owner's Mac.
