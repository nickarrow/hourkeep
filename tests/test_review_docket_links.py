"""Tests of how a citation of a court's docket entry is linked on the review pages, as the Formats section of
docs/epics/0001-policy-corpus/design.md says under "The review pages": in a citation that names the number of a case
whose entries are stored, each "docket entry <n>" links to the address the stored entry was fetched from, its
manifest served_url, and an entry not stored stays text. Full review 2026-10-29, mechanism note 6.
"""

from __future__ import annotations

import unittest

from test_review_pages import load_generator

COURTS = "docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-{}.pdf"
DOCKET = "https://example.gov/docket/"  # the address every entry's manifest entry cites, the case's docket page


def entry(number: int) -> dict:
    return {"path": COURTS.format(number), "cited_url": DOCKET,
            "retrievals": [{"served_url": "https://example.gov/entry-{}.pdf".format(number)}]}


MANIFEST = {"sources": [entry(147), entry(148)]}


class DocketEntryLinkTest(unittest.TestCase):
    def assertLinks(self, citation: str, expected: str) -> None:
        self.assertEqual(load_generator().links.cite(citation, MANIFEST), expected)

    def test_each_stored_entry_links_to_the_address_it_was_fetched_from(self):
        self.assertLinks(
            "Massachusetts v. Oz, D. Mass. No. 1:26-cv-12962, docket entry 148, pp. 1-2; docket entry 147, pp. 15-16",
            "Massachusetts v. Oz, D. Mass. No. 1:26-cv-12962, [docket entry 148](https://example.gov/entry-148.pdf), "
            "pp. 1-2; [docket entry 147](https://example.gov/entry-147.pdf), pp. 15-16")

    def test_an_entry_that_is_not_stored_stays_text(self):
        citation = "Massachusetts v. Oz, D. Mass. No. 1:26-cv-12962, docket entry 142, ECF page 19"
        self.assertLinks(citation, citation)

    def test_an_entry_of_a_case_whose_entries_are_not_stored_stays_text(self):
        citation = "Taylor v. Kennedy, D. Md. No. 1:26-cv-03705, docket entry 148"
        self.assertLinks(citation, citation)

    def test_other_parts_of_the_citation_link_as_before(self):
        self.assertLinks(
            "42 CFR 435.554(c)(5)(i); Massachusetts v. Oz, D. Mass. No. 1:26-cv-12962, docket entry 148, pp. 1-2",
            "[42 CFR 435.554(c)(5)(i)](https://www.ecfr.gov/current/title-42/section-435.554"
            "#p-435.554%28c%29%285%29%28i%29); Massachusetts v. Oz, D. Mass. No. 1:26-cv-12962, "
            "[docket entry 148](https://example.gov/entry-148.pdf), pp. 1-2")


if __name__ == "__main__":
    unittest.main()
