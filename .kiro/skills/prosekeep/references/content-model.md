# Content models, metadata and document anatomy

Each publisher defines its own source-of-truth and page types. Prosekeep's Vloora-derived example follows a consistent hierarchy while leaving decisions configurable.

## Anatomy of a substantive article

1. **Metadata:** `title`, `subtitle`, `kind`, publication date, author, revision date when needed, canonical URL or slug, and status. Record additional fields that the actual publisher requires.
2. **Publication line:** A date and author as required by the content type, not repeated decorative labels.
3. **Title:** A meaningful name for the specific material, in the publisher's selected case convention.
4. **Subtitle:** One or two sentences establishing the specific claim, question, audience, or scope.
5. **Opening:** The reader's situation or the central finding. Avoid previewing the table of contents or promising to explore a vague topic.
6. **Sections:** Each heading helps a scanning reader understand the argument or procedure. H3 subsections have a real parent H2.
7. **Ending:** Stop after the final supported point; don't automatically add a moral or future-looking send-off.
8. **Sources:** Use the publication's citation policy. Preserve titles and link destinations exactly when making revisions; verify dates and claims.
9. **Related material:** Show only when it adds a clear way to continue, instead of duplicating the article.

Example generic source front matter:

```yaml
---
title: When an agent should ask for approval
subtitle: Which decisions require the customer before the agent proceeds.
kind: Technical note
date: 2026-10-22
author: Example Publisher
revised: 2026-10-22
---
```

The values above illustrate a schema, not a real article or evidence about agents. Keep publication metadata apart from narrative claims.

## Guide model

Guides give maintainable instructions at durable URLs. Consider `published`, `updated`, `listed`, `summary`, `author`, and a description of where the guide is used. A new update revises the existing page unless the publisher has a specific versioning policy. When a guide has a public listing, confirm its index and sitemap entry.

## Research and discussion papers

Use the project's method for notes, source references, figure labels and scope. A formal paper may have numbered sections and endnotes; a short research note may use ordinary headings and linked primary sources. Never convert a research claim into a marketing claim by dropping limitations.

## Case studies and product pages

A case study should record what was done, by whom, with what evidence, and which outcomes were observed. A product page needs a usable example, actual installation or access route, relevant status and clear distinction between working functionality and proposed work. Screenshots and fixtures must not be misrepresented as a customer's live experience.

## Multi-page publishing audit

Assign each page one responsibility. Check for identical or semantically repeated paragraphs across Home, Company, Product, Guides and Writing. Compare the source Markdown or source template with the generated page and verify metadata, routes, navigation, canonical URLs, link targets and sitemaps. Prosekeep detects exact normalized duplicates only; an editor must decide whether ideas duplicate one another.
