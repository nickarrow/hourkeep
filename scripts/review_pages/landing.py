"""The landing page, docs/review/README.md: how to review the rows and comment, then a link to every other page."""

from __future__ import annotations

from typing import List, Mapping, Sequence

from .constants import (CODE_OF_CONDUCT_FROM_REVIEW, CONDUCT_EMAIL, DOMAIN_FROM_REVIEW, EMAIL, EXTRACT_FROM_REVIEW,
                        GOOGLE_FORM, ISSUE_FORM, LEDGER_FROM_REVIEW, OPEN_QUESTIONS_PAGE, STATE_FACTS_PAGE)
from .corpus import Topic

# The page's words, read on GitHub, often on a phone, by a Medicaid policy expert who may never have used GitHub.
# {start_here} and {pages} are lists of links the generator fills in, and the other fields are the links and addresses
# held in constants.py; the rest is fixed text.
TEMPLATE = """\
# Review HourKeep's policy rules

HourKeep is a free, open-source app being built for people on Medicaid facing the new work requirements, which CMS
calls community engagement. Before HourKeep tells anyone anything, every rule it relies on has to be right.

## What you are reviewing

Each rule is a row. A row gives the rule in plain words, where it comes from, whether a state can choose differently,
and which way a mistake would hurt a person on Medicaid.

AI agents drafted the rows and checked them against the stored text of the law. Now we are asking people who know
Medicaid policy to check them too.

## Where to start

One row helps. If you have a few minutes, start with these rows:

{start_here}

For each row, check three things:

- Is the rule right, and is it complete?
- Is the answer to "Can a state choose differently?" right?
- Is "If this row were wrong" right about which way a mistake would hurt a person on Medicaid?

"If this row were wrong" tells which way a mistake in the row would push a person on Medicaid: toward doing less than
the rules ask of them, or toward doing more. A row where a mistake would change only a citation, a date or context
says so.

## How to comment

There are three ways to comment, and every row, open question and state fact links to all three. Use whichever is
easiest.

- [On GitHub]({issue_form}). You need a GitHub account for this one only.
- [The comment form on Google Forms]({google_form}), with no account or sign-in.
- Email [{email}](mailto:{email}).

Every row has a short name, such as `notice-response-period`, shown as its heading. A state fact's name adds its
state, such as `co: hearing-request-window-at-most-90-days`. An open question's name is its title. The links on each
of them fill in its name for you. If you comment by email, or on the comment form opened from this page, give that
name.

Never post or send anything about a real person's case. That means no names, case numbers, dates of birth, addresses
or other details that could identify someone.

Everyone who comments, in any of the three ways, follows HourKeep's [code of conduct]({code_of_conduct}).
Report a breach of it to [{conduct_email}](mailto:{conduct_email}).

## What happens to your comment

The project's owner reads every comment. Before any row changes, the comment is checked against a source. A comment
may be posted publicly on GitHub. It is posted without your name unless you ask to be credited: tick the box on GitHub
or on the comment form, or say so in your email. A comment made on GitHub always shows its account name.

The links in each row go to the current official text. Each row was checked against a copy stored in this repository,
the one its "Checked" date names. The two can differ once the text is amended.

## What HourKeep is not

HourKeep is not part of any government. It cannot see or change anyone's Medicaid case. Nothing here is legal advice.

## Words used on these pages

- **Stored text**: the copy of an official text kept in this repository, so a check can be repeated.
- **HCPF**: Colorado's Department of Health Care Policy and Financing, which runs Health First Colorado, the state's
  Medicaid program.
- **A research ID**, such as L5-3: a finding in the [research records]({ledger}).
- **eCFR with a date**, such as eCFR 2026-10-15 in a citation: the date the eCFR text was read.
- **The rule extract**: [the file]({extract}) that holds every row in full.
- **Corpus**: HourKeep's collection of policy rows, state facts, open questions and the stored copies of their
  sources, kept in [docs/domain/]({domain}).

## The pages

{pages}
"""


def landing_page(topics: List[Topic], start_here: Mapping[str, Sequence[str]]) -> str:
    """The landing page's text. The start-here links go to each topic page's Start here section."""
    starts = ["- [{}: start here]({}.md#start-here)".format(topic.title, topic.name)
              for topic in topics if start_here.get(topic.name)]
    if not starts:
        starts = ["- [{}]({}.md)".format(topic.title, topic.name) for topic in topics]
    pages = ["- [{}]({}.md)".format(topic.title, topic.name) for topic in topics]
    pages += ["- [Open questions]({})".format(OPEN_QUESTIONS_PAGE), "- [State facts]({})".format(STATE_FACTS_PAGE)]
    return TEMPLATE.format(start_here="\n".join(starts), pages="\n".join(pages), issue_form=ISSUE_FORM,
                           google_form=GOOGLE_FORM, email=EMAIL, ledger=LEDGER_FROM_REVIEW,
                           extract=EXTRACT_FROM_REVIEW, domain=DOMAIN_FROM_REVIEW,
                           code_of_conduct=CODE_OF_CONDUCT_FROM_REVIEW, conduct_email=CONDUCT_EMAIL)
