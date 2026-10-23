"""Tests of a state's choice between the two rows of a pair, in docs/domain/states/*.json, and of CHOICE_PAIRS in
scripts/corpus_check/constants.py, which lists the pairs. The fixture is corpus_fixture.py. Moved out of
test_state_facts.py on 2026-10-23, mechanism review finding 4."""

from __future__ import annotations

import copy
import importlib
import sys
import unittest

from corpus_fixture import (
    CHECK_PAIR, CHECKER, COLORADO, COUNTS_LINE, EXTRACT, RENEWAL_PAIR, TOPIC, Corpus, CorpusTestCase, fact_line,
    pair_item, pair_row, run_checker, with_choice_pairs,
)


# The two words a fact's choice may take besides its pair's two identifiers, CHOICE_WORDS in constants.py.
CHOICE_WORDS = ("not published", "not applicable")
SEARCH_NOTE = "Searched the stored Colorado sources for 'renewal' on 2026-10-23; nothing published."
# Where a problem with CHOICE_PAIRS is reported: the file that holds it, as a whole.
CHOICE_PAIRS_FILE = "scripts/corpus_check/constants.py"
# The third pair of CHOICE_PAIRS, which no fixture holds rows for, written out again rather than imported.
RESCHEDULE_PAIR = ("reschedule-2027-renewals-to-six-months", "keep-scheduled-2027-renewals")


def load_states():
    """The checker's module for the state facts, scripts/corpus_check/states.py, for tests that call one of its
    functions directly."""
    if str(CHECKER.parent) not in sys.path:
        sys.path.insert(0, str(CHECKER.parent))
    return importlib.import_module("corpus_check.states")


def pairs_of(*pairs):
    """CHOICE_PAIRS's shape for `pairs`, each a pair of identifiers: each identifier beside some words."""
    return tuple(((first, "takes the first"), (second, "takes the second")) for first, second in pairs)


class ChoiceFactTest(CorpusTestCase):
    """Formats, "State facts", as decision record 0006 changes them. A state file holds at most one fact per row. A
    choice between the two rows of a pair is one fact, on the pair's first row, and that fact holds `choice` and no
    other fact does. `choice` is one of the pair's identifiers, `not published` or `not applicable`, and is `not
    published` in a fact marked not published. `value`, `choice` and `counts_from` are the only keys that may be
    `not published`, and each so written, like a `choice` of `not applicable`, needs a note. The pair cases use
    with_choice_pairs, which adds the rows of two pairs to the valid corpus."""

    def corpus_with(self, **keys) -> Corpus:
        """with_choice_pairs, with Colorado gaining a second fact, index 1, on the renewal pair's first row and with
        that row as its choice. `keys` replace or add keys; a key given as None is deleted."""
        corpus = with_choice_pairs()
        fact = copy.deepcopy(corpus.states[COLORADO]["facts"][0])
        fact.update(row=RENEWAL_PAIR[0], setting="at renewal", choice=RENEWAL_PAIR[0])
        for key, value in keys.items():
            if value is None:
                fact.pop(key, None)
            else:
                fact[key] = value
        corpus.states[COLORADO]["facts"].append(fact)
        return corpus

    def assertSecondFactFails(self, corpus: Corpus, words: str) -> None:
        self.assertFails(run_checker(corpus), COLORADO, fact_line(corpus.states[COLORADO], 1), words)

    def test_one_fact_on_a_row_passes_and_two_fail(self):
        self.assertPasses(run_checker(Corpus()))
        corpus = Corpus()
        corpus.states[COLORADO]["facts"].append(copy.deepcopy(corpus.states[COLORADO]["facts"][0]))
        self.assertSecondFactFails(corpus, "at most one fact per row")
        with self.subTest("the same row in two state files"):
            corpus = Corpus()
            corpus.states[COLORADO]["facts"][0]["row"] = "hearing-request-period"
            self.assertPasses(run_checker(corpus))

    def test_the_pair_fixture_passes_and_keeps_the_valid_corpus_counts(self):
        result = run_checker(with_choice_pairs())
        self.assertPasses(result)
        match = COUNTS_LINE.search(result.stdout)
        self.assertEqual((match.group(1), match.group(5), match.group(8)), ("6", "2", "6"), result.stdout)
        match = COUNTS_LINE.search(run_checker(Corpus()).stdout)
        self.assertEqual((match.group(1), match.group(5), match.group(8)), ("2", "2", "2"))

    def test_a_fact_on_a_pairs_first_row_passes_and_on_its_second_fails(self):
        for pair in (RENEWAL_PAIR, CHECK_PAIR):
            with self.subTest(row=pair[0]):
                self.assertPasses(run_checker(self.corpus_with(row=pair[0], choice=pair[0])))
            with self.subTest(row=pair[1]):
                self.assertSecondFactFails(self.corpus_with(row=pair[1], choice=None), "the second row of a pair")

    def test_a_fact_on_a_pairs_second_row_with_choice_gets_only_the_second_row_message(self):
        # Mechanism review 2026-10-23, finding 6: such a fact also got the message for a row in no pair.
        corpus = self.corpus_with(row=RENEWAL_PAIR[1], choice=RENEWAL_PAIR[0])
        result = run_checker(corpus)
        self.assertFails(result, COLORADO, fact_line(corpus.states[COLORADO], 1), "the second row of a pair")
        self.assertNotIn("only a fact on the first row of a pair has choice", result.stdout)

    def test_a_fact_on_a_pairs_first_row_without_choice_fails(self):
        self.assertSecondFactFails(self.corpus_with(choice=None), "lacks choice")

    def test_a_choice_on_a_row_in_no_pair_fails(self):
        for choice in (RENEWAL_PAIR[0], "not published"):
            with self.subTest(choice=choice):
                corpus = with_choice_pairs()
                corpus.states[COLORADO]["facts"][0].update(choice=choice, note=SEARCH_NOTE)
                self.assertFails(run_checker(corpus), COLORADO, fact_line(corpus.states[COLORADO], 0),
                                 "only a fact on the first row of a pair has choice")

    def test_each_allowed_choice_passes(self):
        for pair in (RENEWAL_PAIR, CHECK_PAIR):
            for choice in pair:
                with self.subTest(row=pair[0], choice=choice):
                    self.assertPasses(run_checker(self.corpus_with(row=pair[0], choice=choice)))
            for choice in CHOICE_WORDS:
                with self.subTest(row=pair[0], choice=choice):
                    self.assertPasses(run_checker(self.corpus_with(row=pair[0], choice=choice, note=SEARCH_NOTE)))

    def test_a_choice_outside_its_pair_and_the_two_words_fails(self):
        for bad in (CHECK_PAIR[0], CHECK_PAIR[1], "notice-response-period", "Not published", "not-applicable",
                    "neither"):
            with self.subTest(choice=bad):
                self.assertSecondFactFails(self.corpus_with(choice=bad, note=SEARCH_NOTE),
                                           "the fact's choice {!r} is not one of".format(bad))

    def test_a_not_published_fact_has_the_choice_not_published(self):
        not_published = dict(status="not published", value="not published", note=SEARCH_NOTE)
        self.assertPasses(run_checker(self.corpus_with(choice="not published", **not_published)))
        for bad in RENEWAL_PAIR + ("not applicable",):
            with self.subTest(choice=bad):
                self.assertSecondFactFails(self.corpus_with(choice=bad, **not_published),
                                           "a fact marked not published has the choice 'not published'")

    def test_a_key_written_not_published_or_a_choice_not_applicable_needs_a_note(self):
        # The fact is known, so only the key written so asks for the note.
        for key, value in (("value", "not published"), ("counts_from", "not published"), ("choice", "not published"),
                           ("choice", "not applicable")):
            with self.subTest(key=key, value=value, note=True):
                self.assertPasses(run_checker(self.corpus_with(**{key: value, "note": SEARCH_NOTE})))
            for note in (None, ""):
                with self.subTest(key=key, value=value, note=note):
                    self.assertSecondFactFails(self.corpus_with(**{key: value, "note": note}), "lacks note")

    def test_no_other_key_is_not_published(self):
        # status may be `not published`, which is one of its three values; setting may not.
        self.assertSecondFactFails(self.corpus_with(setting="not published"),
                                   "the fact's setting is 'not published'")
        corpus = Corpus()
        corpus.states[COLORADO]["facts"][0].update(setting="not published")
        self.assertFails(run_checker(corpus), COLORADO, fact_line(corpus.states[COLORADO], 0),
                         "the fact's setting is 'not published'")


def with_pair_rows(*identifiers: str) -> Corpus:
    """The valid corpus with a row for each of `identifiers`, in that order, after the extract's two, and a rule item
    for each under a new ## group of the topic file, as with_choice_pairs adds them."""
    corpus = Corpus()
    corpus.files[EXTRACT] = corpus.files[EXTRACT] + "".join(pair_row(identifier) for identifier in identifiers)
    corpus.files[TOPIC] = (corpus.files[TOPIC] + "\n## Choices a state makes\n\n"
                           + "".join(pair_item(identifier) for identifier in identifiers))
    return corpus


class ChoicePairsTest(CorpusTestCase):
    """Formats, "State facts": CHOICE_PAIRS lists each pair a state chooses between, its first row first in the
    extract's order, and a later topic adds its pair. Red team review 2026-10-23, finding 7: for each pair of which
    the extract holds a row, both rows exist and the first comes first; a pair's two rows differ; and no row is in two
    pairs. The suite runs the checker in a fresh process and cannot change a constant, so the cases on malformed
    pairs call choice_pair_problems directly; the cases through the checker change the extract against the real
    CHOICE_PAIRS."""

    def test_the_real_pairs_with_their_rows_in_order_or_with_none_pass(self):
        problems = load_states().choice_pair_problems
        constants = importlib.import_module("corpus_check.constants")
        in_order = list(RENEWAL_PAIR + CHECK_PAIR + RESCHEDULE_PAIR)
        self.assertEqual(problems(constants.CHOICE_PAIRS, in_order), [])
        self.assertEqual(problems(constants.CHOICE_PAIRS, ["hearing-request-period", "notice-response-period"]), [])
        self.assertEqual(problems(constants.CHOICE_PAIRS, []), [])

    def test_a_pair_with_one_row_in_the_extract_fails_naming_the_missing_row(self):
        problems = load_states().choice_pair_problems
        for present, missing in (("a-first", "a-second"), ("a-second", "a-first")):
            with self.subTest(present=present):
                self.assertEqual(problems(pairs_of(("a-first", "a-second")), ["other-row", present]), [
                    "CHOICE_PAIRS pairs 'a-first' with 'a-second', and the extract holds no row {!r}".format(
                        missing)])

    def test_a_pair_whose_second_row_comes_first_in_the_extract_fails(self):
        problems = load_states().choice_pair_problems
        self.assertEqual(problems(pairs_of(("a-first", "a-second")), ["a-first", "a-second"]), [])
        self.assertEqual(problems(pairs_of(("a-first", "a-second")), ["a-second", "other-row", "a-first"]), [
            "CHOICE_PAIRS puts 'a-first' first in its pair, and the extract has 'a-second' before it; a pair's first "
            "row comes first in the extract"])

    def test_a_pair_of_one_row_with_itself_fails(self):
        problems = load_states().choice_pair_problems
        for rows in (["a-first"], []):
            with self.subTest(rows=rows):
                self.assertEqual(problems(pairs_of(("a-first", "a-first")), rows), [
                    "CHOICE_PAIRS pairs 'a-first' with itself; a pair's two rows differ"])

    def test_a_row_in_two_pairs_fails(self):
        # The extract holds none of the rows, so only this check speaks.
        problems = load_states().choice_pair_problems
        self.assertEqual(problems(pairs_of(("a-first", "a-second"), ("b-first", "b-second")), []), [])
        for pairs in (pairs_of(("a-first", "a-second"), ("a-first", "b-second")),
                      pairs_of(("a-first", "a-second"), ("b-first", "a-first"))):
            with self.subTest(pairs=pairs):
                self.assertEqual(problems(pairs, []), [
                    "CHOICE_PAIRS has 'a-first' in more than one pair; a row is in one pair at most"])

    def test_through_the_checker_a_pair_reversed_or_halved_in_the_extract_fails(self):
        self.assertPasses(run_checker(with_pair_rows(*RENEWAL_PAIR)))
        self.assertFails(run_checker(with_pair_rows(RENEWAL_PAIR[1], RENEWAL_PAIR[0])), CHOICE_PAIRS_FILE, 0,
                         "CHOICE_PAIRS puts {!r} first in its pair, and the extract has {!r} before it".format(
                             *RENEWAL_PAIR))
        self.assertFails(run_checker(with_pair_rows(RENEWAL_PAIR[0])), CHOICE_PAIRS_FILE, 0,
                         "the extract holds no row {!r}".format(RENEWAL_PAIR[1]))


if __name__ == "__main__":
    unittest.main()
