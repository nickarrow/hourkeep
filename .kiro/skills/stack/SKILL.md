---
name: stack
description: Use when the user types /stack, or when a project needs a starting technology choice and nobody has mandated one. One person's preference as of September 2026, covering staying in the browser with no backend, the default web stack, when to move to cloud infrastructure, and how to drive infrastructure work through a command line rather than generating it in bulk.
---

# Starting technology preference

Type `/stack` to load this. Delete the file if your team has its own stack, and delete it without touching
`AGENTS.md`, which holds the rules that matter.

This is one person's preference as of September 2026, not a recommendation for your programme. Tooling in this space
turns over fast and this file will age badly. That is fine. It exists so an agent has a default instead of picking
something at random.

## Default to no backend

Start with something that runs in the browser. Static build, local storage, no server, no accounts. Stay there as
long as the problem allows.

For a government agency the governance cost of a backend is enormous. No server means no protected data in transit,
none at rest on agency infrastructure, no data sharing agreement, no new system of record.

Two things that are true anyway. Hosting choice does not remove authorization work, and an application handling
protected data needs its own authority to operate wherever it runs. And "the data never leaves the device" is no
privacy guarantee on a shared or library machine. It is also a records problem, because somebody with no server-side
copy has nothing to bring to a hearing, so export and print are part of the design rather than extras.

Progressive web apps fit this population and are underused. Offline, installable, no app store, no backend.

## The stack

TypeScript and React, built with Vite. Tailwind for styling, or a design system if the work needs one. IndexedDB
through Dexie for local storage in a progressive web app.

Tests as the thing that tells you when to stop. The `writing-code` skill covers that and the file layout.

## When you outgrow the browser

Move when you need multi-user state, real identity, integration with a system of record, or protected data at rest.
Not before.

When you do, keep the domain logic free of vendor-specific code so the infrastructure stays replaceable. That is the
part that protects you, whoever you end up hosting with.

Prefer managed services over machines you have to run. My own default is AWS, serverless first, and the reason is
narrow: the AWS command line driven through an agent is the most productive infrastructure tooling I have used.
Buckets, roles, users, teardown scripts, whole deployments, one command at a time with each command read before it
runs. Before taking that as neutral advice: the person who wrote it works at AWS, and Kiro is an AWS product. The full
disclosure is at https://github.com/nickarrow/agentic-engineering-bootstrap

Read each command before it runs rather than generating a large infrastructure module in one go. A command you read is
inspectable in a way a module is not, and infrastructure mistakes cost money and are slow to reverse. There is a public
measurement of how much worse models are at infrastructure code: on IaC-Eval, a NeurIPS 2024 benchmark of 458 AWS
Terraform scenarios, GPT-4 passed 19.36% against 86.6% on the EvalPlus Python benchmark, and the paper draws that
comparison itself ([IaC-Eval](https://proceedings.neurips.cc/paper_files/paper/2024/hash/f26b29298ae8acd94bd7e839688e329b-Abstract-Datasets_and_Benchmarks_Track.html)).
That is a 2024 result from an older model, so read it as direction rather than a current figure, and it matches my own
experience that the failures are quieter and more expensive. Build the pipeline that checks the infrastructure first,
then let the agent write into it.

The credential rules are in `AGENTS.md` because they hold whether or not you loaded this file.

## Working on the interface

`HOW-TO-WORK.md` covers the screenshot habit, which is the cheap version and the one to start with. The
`writing-code` skill covers the browser automation version and what it buys.
