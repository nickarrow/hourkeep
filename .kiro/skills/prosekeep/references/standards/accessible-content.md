# Accessible content: headings, links, images and tables

Sources: [USWDS design principles](https://designsystem.digital.gov/design-principles/), [W3C WCAG 2.2 headings and labels, 2.4.6](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html), [W3C WCAG 2.2 link purpose, 2.4.4](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html), and [18F accessibility guide on links](https://guides.18f.org/accessibility/links/).

## Content and navigability

- The page title identifies the page. Headings describe the section's topic or purpose accurately; use semantic heading order where feasible.
- Links need meaningful destinations or actions. Evaluate a link in its programmatic context; "click here" alone is generally weak.
- Control labels match the action or input. Do not rely on icon shape or color alone to communicate a state.
- An image's alternative text should convey its purpose. Informative images need useful text; decorative images may intentionally have empty `alt=""`.
- Tables need column or row headers when representing tabular data. Captions clarify what the table shows; do not turn layout into fake tables.
- Error, confirmation and permission copy should tell people the state, the consequence and the next step.
- Check pages with assistive technology, keyboard focus, zoom, mobile viewports and real users when possible.

## What tools can infer

Prosekeep can flag missing HTML alt attributes and structural heading irregularities. It cannot decide whether alt text is accurate, whether a heading truly describes its section, or whether an interface conforms to WCAG. Do not report a passing mechanical scan as accessibility certification.
