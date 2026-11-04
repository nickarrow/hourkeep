"""Tests that a rule item sits in the topic file of its row's topic, as the Formats section of
docs/epics/0001-policy-corpus/design.md says under "The skill": the file's title is the ## heading its row stands
under in the extract. Full review 2026-10-29, mechanism note 4. The fixture is corpus_fixture.py's valid corpus with a
second topic added to the extract, holding one row.
"""

from __future__ import annotations

import unittest

from corpus_fixture import (
    COUNTS_LINE, EXTRACT, EXTRACT_TEXT, SKILL, TOPIC, TOPIC_TEXT, Corpus, CorpusTestCase, run_checker, skill_with,
)

SECOND_TOPIC = "Who the requirement applies to"
SECOND_ROW = """
## Who the requirement applies to

### adult-group-member-is-an-applicable-individual

- Rule: An adult in the expansion group is an applicable individual.
- Citation: 42 CFR 435.119(d)
- Source: not stored, https://www.ecfr.gov/current/title-42/section-435.119
- Tier: regulation
- State election: no
- Verified: no
- Error direction: dangerous
- Recheck: eCFR amendment
"""
SECOND_ITEM = ("- An adult in the expansion group is an applicable individual.\n"
               "  [adult-group-member-is-an-applicable-individual] 42 CFR 435.119(d)\n")
SECOND_FILE = ".kiro/skills/medicaid-community-engagement/references/who-applies.md"
SECOND_LINK = ("- [Who applies](references/who-applies.md): who must meet the requirement. Read it before "
               "answering.\n")


def with_second_topic() -> Corpus:
    """The valid corpus with SECOND_ROW's topic in the extract and no rule item for its row yet."""
    corpus = Corpus()
    corpus.files[EXTRACT] = EXTRACT_TEXT + SECOND_ROW
    return corpus


class RuleItemTopicTest(CorpusTestCase):
    def test_a_rule_item_in_its_rows_topic_file_passes(self):
        corpus = with_second_topic()
        corpus.files[SKILL] = skill_with("\n## Precedence", SECOND_LINK + "\n## Precedence")
        corpus.files[SECOND_FILE] = "# " + SECOND_TOPIC + "\n\n## Who is an applicable individual\n\n" + SECOND_ITEM
        self.assertPasses(run_checker(corpus))

    def test_a_rule_item_in_another_topics_file_fails_at_the_item_and_is_not_counted(self):
        corpus = with_second_topic()
        corpus.files[TOPIC] = TOPIC_TEXT + "\n## Who is an applicable individual\n\n" + SECOND_ITEM
        line = corpus.files[TOPIC].split("\n").index(SECOND_ITEM.split("\n")[0]) + 1
        result = run_checker(corpus)
        self.assertFails(result, TOPIC, line, "adult-group-member-is-an-applicable-individual's row is under the topic "
                         "'Who the requirement applies to'")
        self.assertIn("not in the file titled 'Notices of noncompliance and fair hearings'", result.stdout)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(8), "2", result.stdout)


if __name__ == "__main__":
    unittest.main()
