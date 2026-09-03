/**
 * A policy value can hide as an English word — ADR-0001. W2b.
 *
 * ## Why this exists
 *
 * W5 shipped **"We've assumed six"** in user-facing copy. Every numeric scan in the repo
 * missed it, the shell gate missed it, and review caught it by reading. It was the contested
 * `renewalIntervalMonths` figure — the one value in the whole profile that does not come
 * from this rule — spelled out as a word directly above a paragraph explaining that it was
 * uncertain.
 *
 * `wave-2b-policy-profile.md` § 2.1.4 makes the lesson a gate: **grep for spelt numbers as
 * well as digits.**
 *
 * ## What it does and does not police
 *
 * It looks for number-words immediately qualifying a policy UNIT — "eighty hours", "thirty
 * days", "six months" — in user-facing strings. It does not ban number-words generally,
 * because "one of the categories the rule sets aside" and "two things decide it" are good
 * plain-language writing and the app is full of them.
 *
 * `getting-started.md` and W5 both record how the previous repo-wide numeric grep died: it
 * matched `width: 80` and `1920x1080`, was noise on day one and disabled by day three. So
 * this pattern is narrow by construction, and `mustNotFire` fixtures pin that narrowness
 * from the start rather than after the first false positive.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { stripComments } from "./support/stripComments";

const SRC = resolve(process.cwd(), "src");

/**
 * Number-words that would carry a policy value, followed by a unit that makes it one.
 *
 * The unit is what turns a word into a threshold: "three months of your release" is
 * 42 CFR 435.553(b)'s recent-inmate window, whereas "three things to bring" is prose.
 *
 * ## "one" IS DELIBERATELY EXCLUDED, and this was decided by running the scan
 *
 * The first version included it and produced **six hits, all six prose**: "a lot of hours
 * for one day", "more than one month in the future", "If any one month in this list works",
 * "instead of that one month on its own" (twice). In English `one` is doing the work of an
 * article or a pronoun far more often than it is naming a quantity, and every one of those
 * six sentences is good plain-language writing.
 *
 * Two things make the exclusion cheap rather than a hole:
 *
 * 1. The federal default for both month-count elections is **1** — `renewalMonthsRequired`
 *    and `applicationLookbackMonths` — so a spelled "one month" that really is a policy value
 *    states the least-restrictive figure, which is also the figure the profile holds. It
 *    cannot mislead in the direction that costs coverage.
 * 2. The values actually at risk of being spelled are the ones W5 got wrong and the ones
 *    still outstanding: **six** months (renewal interval), **three** months (recent-inmate
 *    window), **thirty** and **ninety** days, **eighty** hours, **twelve** months. All still
 *    caught.
 *
 * `getting-started.md` records what happens otherwise: the previous repo-wide numeric grep
 * "was noise on day one, disabled by day three". A guard that fires six times on correct
 * prose does not survive to catch the seventh case that matters.
 */
const SPELT_POLICY_VALUE =
  /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\b[\s-]+(hours?|months?|days?|weeks?)\b/i;

/**
 * Known spelt policy values that are NOT W2b's to fix, each with the wave that owns it.
 *
 * Same shape as `no-verdict.source.test.ts`'s `DEAD_FILE_ALLOWLIST`, and for the same
 * reason: W2a's handoff to W0 became a passing test rather than a line in a document, so
 * nobody had to remember it. Three tests below keep this list honest.
 *
 * `owner` is a closed union. Widening it requires a deliberate type change, which is the
 * point — an allowlist that accepts any string becomes a place to put new violations.
 */
interface SpeltAllowlistEntry {
  /** Path relative to `src/`, POSIX separators. */
  file: string;
  /** The exact spelt value expected there. */
  phrase: string;
  owner: "W3";
  why: string;
}

const SPELT_ALLOWLIST: readonly SpeltAllowlistEntry[] = [
  {
    file: "lib/exemptions/calculator.ts",
    phrase: "three months",
    owner: "W3",
    why: "42 CFR 435.553(b)'s recent-inmate window: any month within 3 months of release is a mandatory exception. A real policy value, but not in state-options.md's schema, and § 435.553 is W3's territory. Adding a profile field with no reader would be the speculation W5's semantic reviewer flagged.",
  },
  {
    file: "lib/exemptions/questions.ts",
    phrase: "three months",
    owner: "W3",
    why: "Same value, in the question rather than the explanation. W4 rewrites these questions and W3 models the exception; either way not W2b.",
  },
  {
    file: "lib/exemptions/definitions.ts",
    phrase: "three months",
    owner: "W3",
    why: "Same value again, in the plain-language definition. 42 CFR 435.553(b); W3 models the exception.",
  },
];

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "__tests__") continue;
      sourceFiles(full, out);
      continue;
    }
    if (/\.tsx?$/.test(full) && !/\.(test|spec)\.tsx?$/.test(full))
      out.push(full);
  }
  return out;
}

interface Hit {
  file: string;
  n: number;
  phrase: string;
  excerpt: string;
}

function findSpeltValues(): Hit[] {
  const hits: Hit[] = [];

  for (const full of sourceFiles(SRC)) {
    const rel = relative(SRC, full).split(/[\\/]/).join("/");
    const source = readFileSync(full, "utf8");

    for (const { line, n } of stripComments(source)) {
      const match = SPELT_POLICY_VALUE.exec(line);
      if (!match) continue;

      hits.push({
        file: rel,
        n,
        phrase: `${match[1]} ${match[2]}`.toLowerCase(),
        excerpt: line.trim().slice(0, 140),
      });
    }
  }

  return hits;
}

function isAllowlisted(hit: Hit): boolean {
  return SPELT_ALLOWLIST.some(
    (e) =>
      e.file === hit.file &&
      hit.phrase.replace(/s$/, "") === e.phrase.replace(/s$/, ""),
  );
}

describe("no policy value is spelled as a word in user-facing copy", () => {
  it("src/ contains no unallowlisted spelt policy value", () => {
    const offenders = findSpeltValues().filter((h) => !isAllowlisted(h));

    const message = offenders
      .map((h) => `  ${h.file}:${h.n}  [${h.phrase}]\n      ${h.excerpt}`)
      .join("\n");

    expect(
      offenders,
      `\n${offenders.length} spelt policy value(s):\n${message}\n`,
    ).toEqual([]);
  });

  it("interpolates the renewal interval rather than spelling it — the W5 regression", () => {
    /**
     * The specific thing that got through, asserted as a property rather than trusted to the
     * scan above. W5's copy said "We've assumed six"; it now interpolates.
     *
     * Positive twin: the panel must still STATE the figure. Deleting the sentence would
     * satisfy "no spelt value" while removing the disclosure that the number is an
     * assumption, which is the opposite of the intent.
     */
    /**
     * Comments stripped before checking, and that is not a detail: the code comment three
     * lines above the fixed copy QUOTES the old wording — "A first version wrote 'We've
     * assumed six', which review caught" — because recording what went wrong is what
     * `engineering-standards.md` asks for. A guard reading raw source would fire on the
     * explanation of its own violation.
     */
    const panel = stripComments(
      readFileSync(
        resolve(SRC, "components/tracking/ReviewPeriodPanel.tsx"),
        "utf8",
      ),
    )
      .map(({ line }) => line)
      .join("\n")
      /**
       * Join template-literal concatenation seams before matching.
       *
       * Prettier wraps long copy as `` `…text ` + `more…` ``, so "We've assumed " and
       * `${period.months.length}` sit on different lines with a `+` between them. Asserting
       * they were adjacent made the test depend on line width rather than on the code —
       * it went red on correct source. Normalising the seam asserts the sentence.
       */
      .replace(/`\s*\+\s*`/g, "");

    expect(panel).not.toMatch(/assumed six/i);
    // Positive twin: it still discloses the assumption, and interpolates the figure.
    expect(panel).toMatch(/We've assumed \$\{period\.months\.length\}/);
  });
});

describe("the spelt-value scan is narrow enough to survive", () => {
  /**
   * `mustNotFire` fixtures, present from the first commit rather than added after the first
   * false positive. W5's guard fired on `DuplicateActivityDialog.tsx` on day one and had to
   * be narrowed; the repo-wide policy grep before it was disabled outright.
   */
  const mustNotFire = [
    "one of the categories the rule sets aside",
    "Two things decide it: whether your condition is on the list",
    "There are two ways to get there and they work together",
    "Both count, and they add together",
    "a four-year college",
    "one monthly total across everything you do",
    // The six real sentences the first version of this pattern fired on. Every one is
    // correct copy, and they are pinned here so a later tightening cannot break them
    // silently. See the note on `SPELT_POLICY_VALUE`.
    "This is a lot of hours for one day. Please double-check.",
    "Date cannot be more than one month in the future",
    "If any one month in this list works, that counts.",
    "instead of that one month on its own",
    "rather than looking at one month alone",
  ];

  it.each(mustNotFire)("does not fire on: %s", (text) => {
    expect(SPELT_POLICY_VALUE.test(text)).toBe(false);
  });

  const mustFire = [
    "We've assumed six months",
    "you have thirty days to respond",
    "eighty hours a month",
    "within three months of your release",
    "twelve-month renewal",
  ];

  it.each(mustFire)("does fire on: %s", (text) => {
    expect(SPELT_POLICY_VALUE.test(text)).toBe(true);
  });
});

describe("the allowlist stays honest", () => {
  /**
   * Three assertions, copied in shape from `no-verdict.source.test.ts` because they worked:
   * an entry that no longer applies has to be removed rather than lingering, and the handoff
   * to W3 lives in an executing test rather than in prose.
   */
  it("every allowlisted file still exists", () => {
    for (const entry of SPELT_ALLOWLIST) {
      expect(
        existsSync(resolve(SRC, entry.file)),
        `${entry.file} is allowlisted but gone — remove the entry`,
      ).toBe(true);
    }
  });

  it("every allowlisted file still contains the phrase it is excused for", () => {
    // The forcing function. When W3 fixes one of these, this fails until the entry goes.
    const hits = findSpeltValues();

    for (const entry of SPELT_ALLOWLIST) {
      const found = hits.some(
        (h) =>
          h.file === entry.file &&
          h.phrase.replace(/s$/, "") === entry.phrase.replace(/s$/, ""),
      );
      expect(
        found,
        `${entry.file} no longer spells "${entry.phrase}" — delete the allowlist entry`,
      ).toBe(true);
    }
  });

  it("every entry names W3 and says why", () => {
    for (const entry of SPELT_ALLOWLIST) {
      expect(entry.owner).toBe("W3");
      expect(entry.why.length, `${entry.file}: needs a reason`).toBeGreaterThan(
        40,
      );
      // A reason that does not cite anything is an opinion.
      expect(entry.why, `${entry.file}: cite the provision`).toMatch(
        /435\.55|W3|W4/,
      );
    }
  });

  it("has exactly three entries, all for the same 42 CFR 435.553(b) value", () => {
    // A count, so growth is visible. All three are one policy value stated in three places —
    // if a fourth appears it is either a new violation or the same value spreading.
    expect(SPELT_ALLOWLIST).toHaveLength(3);
    expect(new Set(SPELT_ALLOWLIST.map((e) => e.phrase))).toEqual(
      new Set(["three months"]),
    );
  });
});
