# HourKeep static prototype

A runnable, browser-only design baseline for testing the assumptions in [the HourKeep design](https://github.com/quarterback/hourkeep/blob/main/docs/design.md). It uses plain HTML, CSS, and JavaScript with the UAE Government Design System through its Tailwind plugin. It is not a policy engine or a launch-ready service.

## Run it

Use Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

The sample edits stay in this browser's local storage. The app has no server connection and does not submit information. Use only the supplied sample case.

To verify the static output:

```sh
npm run check
npm run build
```

## What this draft tests

The current path is overview, notice details and requested months, described records, hours arithmetic, and a printable packet. The sample case makes that path possible to try without entering real case details.

## Assumptions to challenge

This is a deliberately narrow slice of the written design, not a claim that the requirements are settled. The current draft assumes someone starts at an overview, has a notice with a response date and requested months, describes records without attaching them, enters activities manually, and visits the packet only at the final step.

The design in [docs/design.md](https://github.com/quarterback/hourkeep/blob/main/docs/design.md) calls for more. The next design pass should test at least:

- Different starting reasons, including helping someone, applying or renewing, and keeping track.
- Identifying what kind of letter someone received, and the distinct fair-hearing path for a denial or termination.
- Showing possible exclusions before asking for monthly hours, without treating a skipped question as a "no" or deciding whether the rule applies.
- Adding or photographing records by type, then asking follow-up questions only when a record makes them relevant.
- Showing month-by-month proof gaps and labeling each number Computed, Conditional, or Deferred, with formulas and citations where applicable.
- Keeping the packet available throughout the flow, with attached documents and page references in the printable output.
- Spanish, state-specific sources, device-only storage, and the planned backup and shared-device handoff.

Those are product and design questions for review. This prototype does not implement or validate Medicaid policy, determine eligibility, upload records, send information, or connect to a state.
