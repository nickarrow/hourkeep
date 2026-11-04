"""The generator of the review pages in docs/review/, run as scripts/build-review-pages.py. Modules: constants,
corpus, which reads what the pages are made from, links, the words and links each entry shows, pages, the text of
each page, and landing, the landing page's words.

What it reads: the extract, docs/domain/community-engagement-extract.md; the skill's SKILL.md and the topic files its
## Topics links; docs/domain/states/*.json; docs/domain/open-questions.md; and docs/domain/sources/MANIFEST.json, for
the addresses of the stored sources a citation links to. The pages depend on those files alone, so two builds give
identical bytes. What each page shows is in the Formats section of docs/epics/0001-policy-corpus/design.md, under
"The review pages".
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Mapping, Optional, Sequence

from corpus_check.constants import MOVED_FIELD

from . import links
from .constants import (
    LANDING_PAGE, OPEN_QUESTIONS_PAGE, ORIENTATION, ORIENTATION_QUESTIONS, REVIEW, START_HERE, STATE_FACTS_PAGE,
)
from .corpus import read_manifest, read_questions, read_rows, read_states, read_topics
from .landing import landing_page
from .pages import questions_page, state_facts_page, topic_page

__all__ = ["REVIEW", "START_HERE", "build", "links"]


def build(root: Path, start_here: Optional[Mapping[str, Sequence[str]]] = None,
          orientation: Optional[Mapping[str, str]] = None,
          orientation_questions: Optional[Mapping[str, Sequence[str]]] = None) -> Dict[str, bytes]:
    """Every review page as UTF-8 bytes, keyed by its path from the repository root. `start_here`, `orientation`
    and `orientation_questions` default to START_HERE, ORIENTATION and ORIENTATION_QUESTIONS, and a key that names no
    topic file is passed over, since the tests' corpora have topic files of their own. Raises ValueError when the
    extract cannot be read, a start-here row is not in its topic file, or an orientation names a row that does not
    exist or a question that is not still open, names more or fewer questions than it holds, or holds more than one
    and names none."""
    start_here = START_HERE if start_here is None else start_here
    orientation = ORIENTATION if orientation is None else orientation
    orientation_questions = ORIENTATION_QUESTIONS if orientation_questions is None else orientation_questions
    rows = {row.identifier: row for row in read_rows(root)}
    topics = read_topics(root)
    manifest = read_manifest(root)
    questions = read_questions(root)
    headings = {question.heading for question in questions if MOVED_FIELD not in question.fields}
    pages = {identifier: topic.name for topic in topics for _, group in topic.groups for identifier in group}
    texts = {LANDING_PAGE: landing_page(topics, start_here)}
    for topic in topics:
        if topic.name + ".md" in (LANDING_PAGE, OPEN_QUESTIONS_PAGE, STATE_FACTS_PAGE):
            raise ValueError("the topic file {}.md has the name of another review page".format(topic.name))
        texts[topic.name + ".md"] = topic_page(topic, rows, start_here.get(topic.name, ()), manifest, pages,
                                               orientation.get(topic.name, ""),
                                               orientation_questions.get(topic.name, ()), headings)
    texts[OPEN_QUESTIONS_PAGE] = questions_page(questions, rows, pages)
    texts[STATE_FACTS_PAGE] = state_facts_page(read_states(root), pages, manifest)
    return {REVIEW + name: text.encode("utf-8") for name, text in sorted(texts.items())}
