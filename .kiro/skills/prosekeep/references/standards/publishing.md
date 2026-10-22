# Editorial publishing and quality assurance

Prosekeep's editorial workflow is based on the Vloora site's source-first publishing system and on [GSA content standards](https://www.gsa.gov/reference/gsa-web-style-guide/content-standards). Each adopting project supplies its own generator, routes and required tests.

## Content model

Specify a job for every page type. A homepage introduces the organization, a product page shows one product and its tested capabilities, research explains evidence, essays carry an author's argument, guides maintain a method, and news records dated events. A site's actual roles override these examples.

Define front matter requirements for each document type: title, subtitle, kind, dates, author, status, canonical URL or slug, and sources when applicable. Identify the real source files; generated HTML is output rather than the editorial source of truth.

## Editorial release checklist

1. Confirm audience, page purpose, approved claims and authorial voice.
2. Review outline/headings, body, link names, source citations, captions and alt text.
3. Verify product status and claims against actual evidence.
4. Compare any rewrite against its original claims and citations.
5. Run source-file mechanical checks, site-specific builds, regression tests and link validation.
6. Review the rendered result on small and large screens, by keyboard and with required accessibility tools.
7. Record findings, open questions, human decisions, changes made, and the CI result.
8. Publish only after the project's designated approver accepts the content.

Do not claim validation that was not performed. An automated checker cannot replace human editorial review, user research, browser QA or subject-matter approval.
