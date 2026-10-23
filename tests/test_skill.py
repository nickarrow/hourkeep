"""Tests of the skill, .kiro/skills/medicaid-community-engagement/: its main file, SKILL.md, and its topic files in
references/. The fixture is corpus_fixture.py."""

from __future__ import annotations

import subprocess
import unittest

from corpus_fixture import (
    COUNTS_LINE, Corpus, CorpusTestCase, EXTRACT, NOTICE_ITEM, RULE_ITEM, SKILL, SKILL_TEXT, TOPIC, TOPIC_HEADING,
    TOPIC_TEXT, extract_with, run_checker, skill_with, topic_with,
)

REFERENCES = ".kiro/skills/medicaid-community-engagement/references/"
# A second ## topic in the extract, before its second row, so a second topic file has a title of its own.
SECOND_TOPIC = "Another topic"
TWO_TOPICS_EXTRACT = extract_with("### notice-response-period", "## {}\n\n### notice-response-period".format(
    SECOND_TOPIC))


def skill_items(result: subprocess.CompletedProcess) -> str:
    return COUNTS_LINE.search(result.stdout).group(8)


class SkillMainFileTest(CorpusTestCase):
    """Formats, "The skill", SKILL.md. Line numbers are the valid main file's: 2 name, 3 description, 8 ## Topics,
    10 its one link, 12 ## Precedence, 14 its prose, 16 ## Watch list, 18 its one item."""

    def check_skill(self, text) -> subprocess.CompletedProcess:
        corpus = Corpus()
        corpus.files[SKILL] = text
        return run_checker(corpus)

    def test_an_absent_skill_is_reported_and_the_rest_still_checked(self):
        result = self.check_skill(None)
        self.assertPasses(result)
        self.assertIn("the skill is absent", result.stdout)
        self.assertEqual(skill_items(result), "0", result.stdout)
        corpus = Corpus()
        corpus.files[SKILL] = None
        corpus.files[EXTRACT] = extract_with("- Tier: regulation\n- State election: no", "- Tier: rule\n"
                                             "- State election: no")
        self.assertFails(run_checker(corpus), EXTRACT, 25, "rule")

    def test_an_absent_skill_leaves_references_unchecked(self):
        # Formats: if SKILL.md is absent, the skill is absent, and references/ is not checked.
        corpus = Corpus()
        corpus.files[SKILL] = None
        corpus.files[TOPIC] = topic_with("[hearing-request-period] 42", "[no-such-row] 42")
        corpus.files[REFERENCES + "unlinked.md"] = "No title here.\n"
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertIn("the skill is absent", result.stdout)
        self.assertNotIn("references/", result.stdout)
        # Nor whether a topic file holds a rule item or each row has one: unlinked.md holds none, and
        # hearing-request-period has none.
        self.assertNotIn("rule item", result.stdout)

    def test_a_skill_git_ignores_is_reported_absent_and_the_rest_still_checked(self):
        # Formats: the checker skips anything git ignores, and an absent skill is reported and the rest checked.
        corpus = Corpus()
        corpus.files[".gitignore"] = SKILL + "\n"
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertIn("the skill is absent", result.stdout)
        self.assertEqual(skill_items(result), "0", result.stdout)
        corpus.files[EXTRACT] = extract_with("- Tier: regulation\n- State election: no", "- Tier: rule\n"
                                             "- State election: no")
        result = run_checker(corpus)
        self.assertIn("the skill is absent", result.stdout)
        self.assertFails(result, EXTRACT, 25, "rule")

    def test_the_valid_skill_matches_its_rule_items(self):
        result = self.check_skill(SKILL_TEXT)
        self.assertPasses(result)
        self.assertEqual(skill_items(result), "2", result.stdout)

    def test_name_must_equal_the_folder_name(self):
        result = self.check_skill(skill_with("name: medicaid-community-engagement", "name: medicaid-rules"))
        self.assertFails(result, SKILL, 2, "medicaid-community-engagement")

    def test_a_missing_name_or_frontmatter_fails(self):
        result = self.check_skill(skill_with("name: medicaid-community-engagement\n", ""))
        self.assertFails(result, SKILL, 0, "name")
        result = self.check_skill(SKILL_TEXT.split("---\n", 2)[2])
        self.assertFails(result, SKILL, 0, "frontmatter")

    def test_a_frontmatter_with_no_closing_line_fails(self):
        # Formats: the frontmatter holds name and description between --- lines.
        result = self.check_skill(skill_with("exemptions.\n---\n", "exemptions.\n"))
        self.assertFails(result, SKILL, 0, "the skill's frontmatter has no closing --- line")

    def test_an_empty_or_missing_description_fails(self):
        for old, line in (("Use when a person asks about Medicaid work requirements, letters, deadlines and "
                           "exemptions.", 3),
                          ("description: Use when a person asks about Medicaid work requirements, letters, deadlines "
                           "and exemptions.\n", 0)):
            with self.subTest(old=old[:20]):
                self.assertFails(self.check_skill(skill_with(old, "")), SKILL, line, "description")

    def test_a_description_of_1024_characters_passes_and_1025_fails(self):
        # Formats, "The skill": the description is at most 1,024 characters, the Agent Skills specification's limit.
        old = "Use when a person asks about Medicaid work requirements, letters, deadlines and exemptions."
        for length in (1024, 1025):
            with self.subTest(length=length):
                description = old + " " + "x" * (length - len(old) - 1)
                self.assertEqual(len(description), length)
                result = self.check_skill(skill_with(old, description))
                if length == 1024:
                    self.assertPasses(result)
                else:
                    self.assertFails(result, SKILL, 3, "the skill's description has 1025 characters, more than 1,024")

    def test_500_lines_pass_and_501_fail(self):
        padding_500 = "\n" * (500 - SKILL_TEXT.count("\n"))
        self.assertPasses(self.check_skill(SKILL_TEXT + padding_500))
        self.assertFails(self.check_skill(SKILL_TEXT + padding_500 + "\n"), SKILL, 0, "500 lines")

    def test_a_skill_without_a_topics_heading_fails(self):
        # Formats: a misspelled heading would switch the topic files' checks off without a sound, so it fails.
        for heading in ("## Topic\n", "##  Topics\n", "### Topics\n", "```\n## Topics\n```\n", ""):
            with self.subTest(heading=heading):
                result = self.check_skill(skill_with("## Topics\n", heading))
                self.assertFails(result, SKILL, 0, "the skill has no ## Topics heading")
                self.assertFails(result, TOPIC, 0, "not linked from ## Topics")

    def test_the_three_headings_must_appear_exactly_once(self):
        for old, new, line, heading in (("## Precedence\n", "", 0, "## Precedence"),
                                        ("## Precedence\n", "## precedence\n", 0, "## Precedence"),
                                        ("## Watch list\n", "## Watch List\n", 0, "## Watch list"),
                                        ("## Watch list\n", "", 0, "## Watch list"),
                                        ("## Precedence\n", "## Precedence\n\n## Precedence\n", 14, "## Precedence"),
                                        ("## Topics\n", "## Topics\n\n## Topics\n", 10, "## Topics")):
            with self.subTest(new=new or "removed", heading=heading):
                result = self.check_skill(skill_with(old, new))
                words = "more than once" if line else "the skill has no {} heading".format(heading)
                self.assertFails(result, SKILL, line, words)

    def test_a_topics_heading_that_links_no_topic_file_fails(self):
        link = "- [Fair hearings](references/fair-hearings.md): asking for a fair hearing."
        for replacement in ("", "Fair hearings are in references/fair-hearings.md."):
            with self.subTest(replacement=replacement):
                result = self.check_skill(skill_with(link, replacement))
                self.assertFails(result, SKILL, 8, "## Topics links no topic file")

    def test_a_topic_link_to_a_file_that_does_not_exist_fails(self):
        result = self.check_skill(skill_with("references/fair-hearings.md", "references/hearings.md"))
        self.assertFails(result, SKILL, 10, "references/hearings.md names no file")
        self.assertFails(result, TOPIC, 0, "not linked from ## Topics")
        corpus = Corpus()
        corpus.files[TOPIC] = None
        self.assertFails(run_checker(corpus), SKILL, 10, "references/fair-hearings.md names no file")

    def test_a_topic_file_name_must_be_lowercase_words_joined_by_hyphens(self):
        for name in ("Fair-hearings.md", "fair_hearings.md", "fair--hearings.md", "fair-hearings.txt"):
            with self.subTest(name=name):
                corpus = Corpus()
                corpus.files[SKILL] = skill_with("references/fair-hearings.md", "references/" + name)
                corpus.files[TOPIC] = None
                corpus.files[REFERENCES + name] = TOPIC_TEXT
                self.assertFails(run_checker(corpus), SKILL, 10, "lowercase words joined by hyphens")

    def test_a_topics_item_must_start_with_its_link_and_link_one_file_once(self):
        result = self.check_skill(skill_with("- [Fair hearings](references/fair-hearings.md)",
                                             "- See [Fair hearings](references/fair-hearings.md)"))
        self.assertFails(result, SKILL, 10, "starts with a link to its topic file")
        result = self.check_skill(skill_with("\n## Precedence", "- [Fair hearings](references/fair-hearings.md): "
                                             "again.\n\n## Precedence"))
        self.assertFails(result, SKILL, 11, "references/fair-hearings.md is linked from ## Topics more than once")

    def test_every_md_file_directly_in_references_must_be_linked(self):
        corpus = Corpus()
        corpus.files[EXTRACT] = TWO_TOPICS_EXTRACT
        corpus.files[TOPIC] = topic_with(NOTICE_ITEM, "")
        corpus.files[REFERENCES + "extra.md"] = "# " + SECOND_TOPIC + "\n\n## The 30 days\n\n" + NOTICE_ITEM
        self.assertFails(run_checker(corpus), REFERENCES + "extra.md", 0, "not linked from ## Topics")
        corpus.files[SKILL] = skill_with("\n## Precedence", "- [Extra](references/extra.md): more. Read it first."
                                         "\n\n## Precedence")
        self.assertPasses(run_checker(corpus))
        corpus = Corpus()
        corpus.files[REFERENCES + "notes.txt"] = "Not a topic file.\n"
        corpus.files[REFERENCES + "old/earlier.md"] = "Not directly in references/.\n"
        self.assertPasses(run_checker(corpus))

    def test_the_skill_items_are_counted_across_all_topic_files(self):
        corpus = Corpus()
        corpus.files[EXTRACT] = TWO_TOPICS_EXTRACT
        corpus.files[TOPIC] = topic_with(NOTICE_ITEM, "")
        corpus.files[REFERENCES + "notices.md"] = (
            "# " + SECOND_TOPIC + "\n\n## The 30 days\n\n- You have 30 calendar days to respond.\n"
            "  [notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030\n")
        corpus.files[SKILL] = skill_with("\n## Precedence", "- [Notices](references/notices.md): the 30 days. Read "
                                         "it first.\n\n## Precedence")
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertEqual(skill_items(result), "2", result.stdout)

    def test_list_items_in_skill_md_are_not_rule_items(self):
        result = self.check_skill(skill_with("## Precedence\n", "## Precedence\n\n- 1 regulation outranks 2 pages.\n"))
        self.assertPasses(result)
        self.assertEqual(skill_items(result), "2", result.stdout)

    def test_a_bracketed_letter_or_number_anywhere_fails(self):
        for old, new, line, bracketed in (("deadlines and exemptions.", "deadlines and exemptions [x].", 3, "[x]"),
                                          ("The regulation wins", "The regulation [1] wins", 14, "[1]")):
            with self.subTest(bracketed=bracketed):
                result = self.check_skill(skill_with(old, new))
                self.assertFails(result, SKILL, line, bracketed + " names no row")

    def test_a_bracketed_identifier_anywhere_must_name_a_row(self):
        result = self.check_skill(skill_with("2026-12-01 board meeting: [hearing-request-period]",
                                             "2026-12-01 board meeting: [no-such-row]"))
        self.assertFails(result, SKILL, 18, "no-such-row")
        result = self.check_skill(skill_with("The regulation wins", "The [regulation] wins"))
        self.assertFails(result, SKILL, 14, "regulation")

    def test_a_bracketed_word_followed_by_a_parenthesis_or_not_identifier_shaped_passes(self):
        result = self.check_skill(skill_with("The regulation wins", "The [regulation](https://www.ecfr.gov/) and "
                                             "[Some Page] win"))
        self.assertPasses(result)


class TopicFileTest(CorpusTestCase):
    """Formats, "The skill", a topic file and its rule items. Line numbers are the valid topic file's: 1 its title,
    3 its prose, 5 its ## group heading, 7 and 8 its first rule item, 9 and 10 its second."""

    def check_topic(self, text) -> subprocess.CompletedProcess:
        corpus = Corpus()
        corpus.files[TOPIC] = text
        return run_checker(corpus)

    def test_the_valid_topic_file_passes(self):
        result = self.check_topic(TOPIC_TEXT)
        self.assertPasses(result)
        self.assertEqual(skill_items(result), "2", result.stdout)

    def test_a_topic_file_with_no_rule_item_fails(self):
        # Formats: a topic file holds at least one rule item. Mechanism review S1, 2026-10-21: an emptied topic file
        # passed, where an emptied ## Rules section had failed.
        for text in ("# " + TOPIC_HEADING + "\n\nThe row in the extract wins wherever the two differ.\n",
                     "# " + TOPIC_HEADING + "\n\n## Asking for a hearing\n\nNo items here.\n"):
            with self.subTest(text=text):
                self.assertFails(self.check_topic(text), TOPIC, 0, "the topic file holds no rule item")
        corpus = Corpus()
        corpus.files[REFERENCES + "empty.md"] = "# Empty\n"
        corpus.files[SKILL] = skill_with("\n## Precedence", "- [Empty](references/empty.md): nothing. Read it first."
                                         "\n\n## Precedence")
        self.assertFails(run_checker(corpus), REFERENCES + "empty.md", 0, "the topic file holds no rule item")

    def test_a_row_with_no_rule_item_fails(self):
        # Formats: each row in the extract has exactly one rule item across the topic files. Mechanism review S2.
        result = self.check_topic(topic_with(NOTICE_ITEM, ""))
        self.assertFails(result, EXTRACT, 20, "notice-response-period has no rule item")
        result = self.check_topic(topic_with("[hearing-request-period] 42", "[notice-response-period] 42"))
        self.assertFails(result, EXTRACT, 7, "hearing-request-period has no rule item")

    def test_a_row_with_two_rule_items_fails(self):
        result = self.check_topic(topic_with(NOTICE_ITEM, NOTICE_ITEM + NOTICE_ITEM))
        self.assertFails(result, TOPIC, 11, "notice-response-period has more than one rule item")
        corpus = Corpus()
        corpus.files[REFERENCES + "more.md"] = "# More\n\n## Asking again\n\n" + RULE_ITEM
        corpus.files[SKILL] = skill_with("\n## Precedence", "- [More](references/more.md): again. Read it first."
                                         "\n\n## Precedence")
        self.assertFails(run_checker(corpus), REFERENCES + "more.md", 5,
                         "hearing-request-period has more than one rule item")

    def test_a_first_line_that_is_not_a_title_fails(self):
        for first in ("## Fair hearings", "#Fair hearings", "# ", "---\nname: fair-hearings\n---\n# Fair hearings",
                      "Fair hearings"):
            with self.subTest(first=first):
                result = self.check_topic(topic_with("# " + TOPIC_HEADING, first))
                self.assertFails(result, TOPIC, 1, "a topic file's first line is # and its title")

    def test_a_title_that_is_a_heading_of_the_extract_passes_and_one_that_is_not_fails(self):
        # Formats, "The skill": a topic file's title, its first line after "# ", is the ## heading of one topic in
        # the extract. Decision record 0006: the heading, the title and the link name one topic.
        self.assertPasses(self.check_topic(TOPIC_TEXT))
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("### notice-response-period", "## Another topic\n\n"
                                             "### notice-response-period")
        corpus.files[TOPIC] = topic_with("# " + TOPIC_HEADING, "# Another topic")
        self.assertPasses(run_checker(corpus))
        # Not a heading at all; another case; part of one; the extract's # title; a row's ### heading; and the
        # topic file's own ## group heading.
        for title in ("Fair hearings", TOPIC_HEADING.lower(), "Notices of noncompliance",
                      "Community engagement extract", "hearing-request-period", "Asking for a hearing"):
            with self.subTest(title=title):
                result = self.check_topic(topic_with("# " + TOPIC_HEADING, "# " + title))
                self.assertFails(result, TOPIC, 1, "the topic file's title {!r} is not the ## heading of a topic in "
                                 "the extract".format(title))

    def test_two_topic_files_sharing_a_title_fail(self):
        # Decision record 0006 gives each topic one title, so two topic files with the same title fail, the second
        # where its title stands. Mechanism review 2026-10-23, finding 2.
        corpus = Corpus()
        corpus.files[EXTRACT] = TWO_TOPICS_EXTRACT
        corpus.files[TOPIC] = topic_with(NOTICE_ITEM, "")
        corpus.files[REFERENCES + "other.md"] = "# " + SECOND_TOPIC + "\n\n## The 30 days\n\n" + NOTICE_ITEM
        corpus.files[SKILL] = skill_with("\n## Precedence", "- [Other](references/other.md): the 30 days. Read it "
                                         "first.\n\n## Precedence")
        self.assertPasses(run_checker(corpus))
        corpus.files[REFERENCES + "other.md"] = "# " + TOPIC_HEADING + "\n\n## The 30 days\n\n" + NOTICE_ITEM
        self.assertFails(run_checker(corpus), REFERENCES + "other.md", 1, "the topic file's title {!r} is the title "
                         "of {} too; each topic has one topic file".format(TOPIC_HEADING, TOPIC))

    def test_500_lines_pass_and_501_fail(self):
        padding_500 = "\n" * (500 - TOPIC_TEXT.count("\n"))
        self.assertPasses(self.check_topic(TOPIC_TEXT + padding_500))
        self.assertFails(self.check_topic(TOPIC_TEXT + padding_500 + "\n"), TOPIC, 0, "500 lines")

    def test_a_list_item_above_the_first_group_heading_fails(self):
        result = self.check_topic(topic_with("## Asking for a hearing\n\n" + RULE_ITEM,
                                             RULE_ITEM + "\n## Asking for a hearing\n"))
        self.assertFails(result, TOPIC, 5, "a list item in a topic file sits under a ## heading")

    def test_a_list_item_above_the_first_group_heading_is_still_checked(self):
        result = self.check_topic(topic_with("## Asking for a hearing\n", "- No row here.\n\n## Asking for a "
                                             "hearing\n"))
        self.assertFails(result, TOPIC, 5, "a list item in a topic file sits under a ## heading")
        self.assertFails(result, TOPIC, 5, "[identifier] citation")

    def test_a_list_item_after_a_later_title_heading_fails(self):
        result = self.check_topic(TOPIC_TEXT + "\n# More\n\n" + RULE_ITEM)
        self.assertFails(result, TOPIC, 14, "a list item in a topic file sits under a ## heading")

    def test_a_deeper_heading_keeps_its_items_in_the_group(self):
        result = self.check_topic(topic_with("## Asking for a hearing\n", "## Asking for a hearing\n\n### Where\n"))
        self.assertPasses(result)
        self.assertEqual(skill_items(result), "2", result.stdout)

    def test_a_rule_item_with_no_words_before_its_identifier_fails(self):
        for item in ("- [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14\n",
                     "-   [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14\n"):
            with self.subTest(item=item):
                result = self.check_topic(topic_with(RULE_ITEM, item))
                self.assertFails(result, TOPIC, 7, "words before its identifier")

    def test_a_rule_item_continuation_indented_otherwise_fails(self):
        for indent in (" ", "   ", "\t"):
            with self.subTest(indent=repr(indent)):
                result = self.check_topic(topic_with(RULE_ITEM, RULE_ITEM.replace("\n  [", "\n" + indent + "[")))
                self.assertFails(result, TOPIC, 8, "indented exactly two spaces")

    def test_a_rule_item_without_an_identifier_fails(self):
        result = self.check_topic(topic_with(RULE_ITEM, RULE_ITEM + "- A rule with no row.\n"))
        self.assertFails(result, TOPIC, 9, "[identifier] citation")

    def test_a_rule_item_on_one_line_passes(self):
        self.assertPasses(self.check_topic(topic_with(RULE_ITEM, RULE_ITEM.replace(".\n  [", ". ["))))

    FENCE = "\n```sh\n# run from the repository root\n- not an item [no-such-row]\n```\n\n"

    def test_a_fenced_line_cannot_end_a_group(self):
        # Formats: a line inside a fenced code block is neither a heading nor a rule item, so the fenced # line
        # cannot end the group. The item after the fence, line 15, is still checked; the bracket scan reads the fence.
        bad = "- You can ask within 60 days. [hearing-request-period] 42 CFR 431.221(e); eCFR 2026-10-14\n"
        result = self.check_topic(topic_with(RULE_ITEM, RULE_ITEM + self.FENCE + bad))
        self.assertFails(result, TOPIC, 15, "citation")
        self.assertFails(result, TOPIC, 15, "the number 60")
        self.assertFails(result, TOPIC, 12, "[no-such-row] names no row")
        self.assertNotIn("a rule item ends with", result.stdout)  # the fenced list line is not a rule item
        self.assertNotIn("sits under a ## heading", result.stdout)
        result = self.check_topic(topic_with(RULE_ITEM, RULE_ITEM + self.FENCE.replace(" [no-such-row]", "")))
        self.assertPasses(result)
        self.assertEqual(skill_items(result), "2", result.stdout)

    def test_a_fenced_heading_cannot_stand_in_for_a_group_heading(self):
        result = self.check_topic(topic_with("## Asking for a hearing\n", "```\n## Asking for a hearing\n```\n"))
        self.assertFails(result, TOPIC, 9, "a list item in a topic file sits under a ## heading")

    def test_the_identifier_must_name_a_row(self):
        result = self.check_topic(topic_with("[hearing-request-period] 42", "[hearing-request-periods] 42"))
        self.assertFails(result, TOPIC, 8, "hearing-request-periods")

    def test_the_citation_must_equal_the_row_citation_exactly(self):
        for citation in ("42 CFR 431.221(d)", "42 CFR 431.221(d);  eCFR 2026-10-14", "42 CFR 431.221(e); eCFR "
                         "2026-10-14"):
            with self.subTest(citation=citation):
                result = self.check_topic(topic_with("42 CFR 431.221(d); eCFR 2026-10-14", citation))
                self.assertFails(result, TOPIC, 7, "citation")

    def test_a_number_not_in_the_row_rule_fails(self):
        for number in ("60", "9", "900", "90.5", "9,0"):
            with self.subTest(number=number):
                result = self.check_topic(topic_with("more than 90 days", "more than {} days".format(number)))
                self.assertFails(result, TOPIC, 7, number)

    def test_a_number_in_the_row_rule_passes_whole_against_whole(self):
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("than 90 days.", "than 90 days, or 8.8 weeks, or 1,000 hours.")
        corpus.files[TOPIC] = topic_with("more than 90 days", "more than 90 days, 8.8 weeks or 1,000 hours")
        self.assertPasses(run_checker(corpus))
        corpus.files[TOPIC] = topic_with("more than 90 days", "more than 9 days")
        self.assertFails(run_checker(corpus), TOPIC, 7, "9")
        corpus.files[TOPIC] = topic_with("more than 90 days", "more than 1 day")
        self.assertFails(run_checker(corpus), TOPIC, 7, "1")

    def notice_item(self, words: str) -> str:
        """The valid topic file with its second rule item, at line 9, for notice-response-period, holding `words`
        before its identifier."""
        return topic_with(NOTICE_ITEM, "- " + words + "\n  [notice-response-period] 42 CFR 435.558(a)(2); "
                          "91 FR 39030\n")

    def test_a_number_in_a_citation_paragraph_in_the_rule_does_not_count(self):
        # do-it review 2026-10-19: the Rule's "(c)(4)" let a skill item say 4 where the Rule says 30.
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("respond to a notice of noncompliance.",
                                             "respond to a notice of noncompliance under paragraph (c)(4).")
        corpus.files[TOPIC] = self.notice_item("You have 30 calendar days to respond.")
        self.assertPasses(run_checker(corpus))
        corpus.files[TOPIC] = self.notice_item("You have 4 calendar days to respond.")
        self.assertFails(run_checker(corpus), TOPIC, 9, "the number 4 is not in notice-response-period's Rule")

    def test_a_number_in_a_citation_paragraph_in_the_skill_does_not_count(self):
        # A number in parentheses straight after a letter, a digit or a closing parenthesis is part of a citation.
        for words in ("You have 30 calendar days to respond, under paragraph (c)(4).",
                      "You have 30 calendar days to respond, under subsection e(14).",
                      "You have 30 calendar days to respond, under section 30(14)."):
            with self.subTest(words=words):
                self.assertPasses(self.check_topic(self.notice_item(words)))

    def test_a_number_in_parentheses_after_a_space_still_counts(self):
        result = self.check_topic(self.notice_item("You have thirty (31) calendar days to respond."))
        self.assertFails(result, TOPIC, 9, "the number 31 is not in notice-response-period's Rule")
        result = self.check_topic(self.notice_item("You have thirty (30) calendar days to respond."))
        self.assertPasses(result)

    def test_numbers_after_the_identifier_are_not_checked(self):
        self.assertPasses(self.check_topic(TOPIC_TEXT))  # the citation holds 42, 431.221 and 2026, not in the Rule

    def test_a_bracketed_word_in_topic_prose_must_name_a_row_unless_it_is_a_link(self):
        for new, bracketed in (("The row [x] wins", "[x]"), ("The [row] wins", "[row]")):
            with self.subTest(bracketed=bracketed):
                self.assertFails(self.check_topic(topic_with("The row", new)), TOPIC, 3, bracketed + " names no row")
        self.assertPasses(self.check_topic(topic_with("The row", "The [row](../../../../docs/domain/) and [A Page]")))


if __name__ == "__main__":
    unittest.main()
