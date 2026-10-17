# Research records

The research behind HourKeep's policy corpus, kept exactly as it was written. AI agents wrote all of it. Read it as
evidence for what the corpus says, and never as authority in place of the sources it cites.

- `2026-10-15-snap/report.md` asks whether HourKeep should support SNAP work requirements, and what the Medicaid rule's
  SNAP exclusion means for a person in both programs. Each claim carries its source tier and whether the agent read it
  in that source (V) or did not (U).
- `2026-10-16-policy/` holds eight research lanes, `L1` to `L8`, each a report on one area, and `ledger.md`, in which a
  separate agent rechecked 105 of their findings against their sources: all 43 the lanes marked as corrections or
  stale, and 62 of the 64 they marked as additions. A finding's ID, such as L6-12, is its lane and its number in that
  lane's summary.

HourKeep's documents cite these records in four forms:

- "research L6-12" for a finding the ledger rechecked. After the first tag in a passage, later ones may drop the word
  research.
- "research L5, finding 10" for a finding in a lane's summary that the ledger did not recheck.
- "research L5, section 11" for a lane's own evidence, which the ledger did not recheck.
- "SNAP research, section 4.4" for a section of the SNAP report.

The reports were written in a scratch folder that git ignores, and the scratch files they mention were never
committed. The `docs/domain/` line numbers they cite are as of 2026-10-16. When a record and the source it cites
disagree, the source wins.
