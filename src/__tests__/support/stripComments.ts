/**
 * Strip comments from TypeScript source, tracking block comments across lines.
 *
 * Shared by the two W2b scan guards — `src/lib/__tests__/policyInjection.test.ts` (policy
 * literals) and `src/__tests__/no-spelt-policy-value.test.ts` (policy values spelled as
 * words). Extracted on the W2b review, which pointed out ~30 near-identical lines living in
 * two files while `src/__tests__/support/` exists for exactly this.
 *
 * ## Why any of this is needed
 *
 * Both guards search for numbers. This codebase's comments are *full* of numbers, because
 * `engineering-standards.md` requires every domain claim to carry a CFR citation and a
 * Federal Register page — "42 CFR 435.552(a): 80 hours", "91 FR 33470", "60 to 90 days".
 * A guard that fired on its own provenance would be switched off within a day.
 *
 * A line-prefix test is not enough, and that was found by running the scan rather than by
 * reasoning: the second and later lines of a `/* … *\/` block start with ordinary prose, so
 * four files reported hits that were comments quoting the very standard being enforced. One
 * of them was the comment three lines above a fix, quoting the wording it had replaced.
 *
 * ## The two things callers must know
 *
 * 1. **`raw` is returned alongside `line`.** Suppression markers such as
 *    `// policy-literal-ok` are themselves comments, so by the time a caller sees `line` the
 *    marker is gone. Filter suppressions on `raw`, everything else on `line`. Found by
 *    running the scan, after the stripper silently swallowed every marker.
 * 2. **It is not a parser.** A `//` sequence inside a string literal is treated as a comment.
 *    Acceptable here because both callers scan for numeric and word patterns rather than
 *    parsing code, and the cost of a miss is a false negative in one line rather than a wrong
 *    answer. `[^:]` guards `https://` specifically, because URLs appear in citations.
 */
export interface StrippedLine {
  /** The line with comments removed. Empty string if the whole line was a comment. */
  line: string;
  /** The line exactly as written, for suppression-marker checks. */
  raw: string;
  /** 1-indexed line number. */
  n: number;
}

export function stripComments(source: string): StrippedLine[] {
  let inBlock = false;

  return source.split("\n").map((raw, i) => {
    let line = raw;

    if (inBlock) {
      const end = line.indexOf("*/");
      if (end === -1) return { line: "", raw, n: i + 1 };
      line = line.slice(end + 2);
      inBlock = false;
    }

    // Remove every complete block comment on this line, then note an unterminated one.
    for (;;) {
      const start = line.indexOf("/*");
      if (start === -1) break;
      const end = line.indexOf("*/", start + 2);
      if (end === -1) {
        line = line.slice(0, start);
        inBlock = true;
        break;
      }
      line = line.slice(0, start) + line.slice(end + 2);
    }

    // Line comments. `[^:]` guards `https://` — without it any pattern after a URL on the
    // same line would be silently skipped. Borrowed from the no-verdict source scan.
    line = line.replace(/(^|[^:])\/\/.*$/, "$1");

    return { line, raw, n: i + 1 };
  });
}
