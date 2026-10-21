"""The words and links each row, open question and state fact shows: its citation linked to the official text,
whether a state can choose differently, which way an error would cost a person, who checked it and how, and the
three ways to comment on it."""

from __future__ import annotations

import re
from typing import Callable, List, Optional
from urllib.parse import quote

from corpus_check.constants import STATE_ELECTION

from .constants import (
    CCR_DRAFT_PART, CCR_DRAFT_SOURCE, CCR_PART, CCR_SOURCE, CFR_LISTED, CFR_PARAGRAPH, CFR_PART, CFR_SECTION_SIGN,
    CFR_TITLE, CFR_URL, EMAIL, FR_PART, FR_URL, GOOGLE_FORM_FOR, ISSUE_FORM, NOT_RECORDED, PUBLIC_LAW_PART,
    PUBLIC_LAW_URL, SMD_PART, SMD_SOURCE, SSA_PART, SSA_URL,
)

IF_WRONG = {
    "dangerous": "a person on Medicaid could do less than the rules ask of them.",
    "burdensome": "a person on Medicaid could do more than the rules ask of them.",
    "neither": "only a citation, a date or context would be off.",
}

# A Verified value: its date, its method, and the person who checked it, if one did.
VERIFIED = re.compile(r"^(\d{4}-\d{2}-\d{2}), (read in source|ledger \S+|expert review)(?:, by (.+))?$")


def source_address(manifest: dict, path_matches) -> Optional[str]:
    """The cited_url of the last manifest entry whose path `path_matches` accepts, or else the first served_url it
    records; None when no entry gives one."""
    found = None
    for entry in manifest.get("sources", []):
        if isinstance(entry, dict) and path_matches(str(entry.get("path", ""))):
            found = entry
    if found is None:
        return None
    if found.get("cited_url", NOT_RECORDED) != NOT_RECORDED:
        return found["cited_url"]
    for retrieval in found.get("retrievals", []):
        if isinstance(retrieval, dict) and retrieval.get("served_url", NOT_RECORDED) != NOT_RECORDED:
            return retrieval["served_url"]
    return None


def section_address(section: str, paragraph: str) -> str:
    """The eCFR's current page for a title 42 section, at the paragraph, such as (c)(2), if one is given."""
    address = CFR_URL.format(section)
    return address + CFR_PARAGRAPH.format(quote(section + paragraph, safe="")) if paragraph else address


def cfr_address(match) -> str:
    """The eCFR's current section a CFR_PART match names, at the paragraph it names, if it names one."""
    return section_address(match.group(1), match.group(2))


def cite_part(part: str, manifest: dict) -> str:
    """One part of a citation, the words its pattern matches linked to the official text, or the part as it is."""
    linkers = (
        (CFR_PART, cfr_address),
        (FR_PART, lambda match: FR_URL.format(match.group(1), match.group(2))),
        (SMD_PART, lambda match: source_address(manifest, lambda path: path == SMD_SOURCE)),
        (CCR_PART, lambda match: source_address(manifest, lambda path: CCR_SOURCE.match(path) is not None)),
        (CCR_DRAFT_PART,
         lambda match: source_address(manifest, lambda path: CCR_DRAFT_SOURCE.match(path) is not None)),
        (SSA_PART, lambda match: SSA_URL),
        (PUBLIC_LAW_PART, lambda match: PUBLIC_LAW_URL),
    )
    for pattern, address in linkers:
        match = pattern.search(part)
        if match is None:
            continue
        url = address(match)
        if url is None:
            return part
        return part[:match.start()] + "[" + match.group(0) + "](" + url + ")" + part[match.end():]
    return part


def cite(citation: str, manifest: dict) -> str:
    """A Citation, each part, separated by '; ', linked where the pages know its official text."""
    return "; ".join(cite_part(part, manifest) for part in citation.split("; "))


def cite_in_text(text: str) -> str:
    """Prose with every CFR and Federal Register citation in it linked to the official text, as a Citation's are.
    The bare sections listed straight after a 42 CFR reference link to title 42 too, and so does a section-sign
    reference where the text names 42 CFR and no other title. A full stop that ends the sentence stays outside the
    link."""
    def linked(words: str, address: str) -> str:
        stop = "." if words.endswith(".") else ""
        return "[" + words[:len(words) - len(stop)] + "](" + address + ")" + stop

    titles = set(CFR_TITLE.findall(text))
    pieces, position = [], 0
    for match in CFR_PART.finditer(text):
        pieces += [text[position:match.start()], linked(match.group(0), cfr_address(match))]
        position = match.end()
        listed = CFR_LISTED.match(text, position)
        while listed is not None:
            separator = listed.group(1)
            pieces += [separator, linked(listed.group(0)[len(separator):], section_address(*listed.group(2, 3)))]
            position = listed.end()
            listed = CFR_LISTED.match(text, position)
    text = "".join(pieces) + text[position:]
    if titles == {"42"}:
        text = CFR_SECTION_SIGN.sub(lambda match: linked(match.group(0), section_address(*match.group(1, 2))), text)
    return FR_PART.sub(lambda match: linked(match.group(0), FR_URL.format(match.group(1), match.group(2))), text)


def sentence(text: str) -> str:
    text = text.strip()
    if not text:
        return text
    text = text[0].upper() + text[1:]
    return text if text.endswith(".") else text + "."


def state_choice(election: str, linked: Callable[[str], str] = lambda text: text) -> List[str]:
    """The list lines saying whether a state can choose differently: 'No.', or 'Yes.' and what the state chooses,
    then what applies where it has not chosen on a line of its own. `linked` adds links to the words of a yes."""
    match = STATE_ELECTION.match(election)
    if match is None:
        return ["- Can a state choose differently? " + sentence(election)]
    applies = match.group(2).strip()
    return ["- Can a state choose differently? Yes. " + linked(sentence("the state chooses " + match.group(1))),
            "- If the state has not chosen: " + linked(applies if applies.endswith(".") else applies + ".")]


def if_wrong(direction: str) -> str:
    return IF_WRONG.get(direction, direction)


def checked(verified: str) -> str:
    """Who checked a row or state fact and how, from a row's Verified value or a fact's checked value, which share a
    vocabulary. A value outside the vocabulary is shown as it is; the checker reports it."""
    if verified == "no":
        return "not yet."
    match = VERIFIED.match(verified)
    if match is None:
        return sentence(verified)
    date, method, person = match.groups()
    if person is None and method == "read in source":
        return date + " by an AI agent reading the stored text."
    if person is None and method.startswith("ledger "):
        return date + " by an AI agent, through the 2026-10-16 research ledger."
    if person is not None and method == "read in source":
        return "{} by {}, reading the official text.".format(date, person)
    if person is not None and method.startswith("ledger "):
        return "{} by {}, through the 2026-10-16 research ledger.".format(date, person)
    if person is not None and method == "expert review":
        return "{} by {}, from their own knowledge.".format(date, person)
    return sentence(verified)


def comment_links(name: str) -> str:
    """The three ways to comment on the row, open question or state fact `name`, each carrying the name."""
    encoded = quote(name, safe=":")
    return ("[on GitHub]({0}&row={1}&title=Review:%20{1}), [on Google Forms (no account needed)]({2}{1}), "
            "[by email](mailto:{3}?subject=Review:%20{1})").format(ISSUE_FORM, encoded, GOOGLE_FORM_FOR, EMAIL)
