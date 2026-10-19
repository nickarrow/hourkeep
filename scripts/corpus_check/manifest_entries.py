"""The shape of one entry of the manifest, docs/domain/sources/MANIFEST.json: its keys and
their types, its retrievals and superseded items, its addresses and times, and a PDF extraction's derivation."""

from __future__ import annotations

from typing import List, Optional, Tuple

from .constants import (
    ADDRESS, DERIVED_KEYS, ECFR_FOLDER, ENTRY_KEYS, HEX_DIGEST, KINDS, LIST_KEYS, NOT_RECORDED, OPTIONAL_ENTRY_KEYS,
    PDF_EXTRACTION_COMMAND, RETRIEVAL_KEYS, SHA256, SUPERSEDED_KEYS,
)
from .dates import is_date, is_utc_time


def entry_problems(entry: object) -> List[str]:
    """Why a manifest entry is malformed. An empty string counts as missing, wherever it is."""
    if not isinstance(entry, dict):
        return ["an entry is a JSON object"]
    path = entry.get("path")
    name = "the entry for {}".format(path) if isinstance(path, str) and path else "an entry"
    reasons = []
    required = list(ENTRY_KEYS)
    if entry.get("kind") == "derived":
        required += DERIVED_KEYS
    if isinstance(path, str) and path.startswith(ECFR_FOLDER):
        required.append("ecfr_date")
    for key in required + [key for key in entry if key not in required]:
        if key not in entry and key in required or entry.get(key) == "":
            reasons.append("{} lacks {}".format(name, key))
        elif key in LIST_KEYS and not isinstance(entry[key], list):
            reasons.append("{}'s {} is a list".format(name, key))
        elif key not in LIST_KEYS and not isinstance(entry[key], str):
            reasons.append("{}'s {} is a string".format(name, key))
    kind, sha256 = entry.get("kind"), entry.get("sha256")
    for key in entry:
        if key in DERIVED_KEYS and kind != "derived":
            reasons.append("{} holds {}, but only a derived entry holds {}".format(name, key, key))
        elif key not in ENTRY_KEYS + DERIVED_KEYS + OPTIONAL_ENTRY_KEYS:
            reasons.append("{} holds the key {!r}, which is not one an entry may hold".format(name, key))
    if isinstance(kind, str) and kind and kind not in KINDS:
        reasons.append("{}'s kind {!r} is not verbatim or derived".format(name, kind))
    if isinstance(sha256, str) and sha256 and not SHA256.match(sha256):
        reasons.append("{}'s sha256 is not 64 lowercase hex digits".format(name))
    cited_url = entry.get("cited_url")
    if isinstance(cited_url, str) and cited_url and cited_url != NOT_RECORDED and not ADDRESS.match(cited_url):
        reasons.append("{}'s cited_url {!r} is not an http:// or https:// address, or 'not recorded'".format(
            name, cited_url))
    derived_from, derivation = entry.get("derived_from"), entry.get("derivation")
    if kind == "derived" and isinstance(path, str) and isinstance(derived_from, str) \
            and derived_from.lower().endswith(".pdf") and isinstance(derivation, str) and derivation:
        reason = derivation_problem(path, derived_from, derivation)
        if reason is not None:
            reasons.append(reason)
    ecfr_date = entry.get("ecfr_date")
    if isinstance(ecfr_date, str) and ecfr_date and not is_date(ecfr_date):
        reasons.append("{}'s ecfr_date {!r} is not YYYY-MM-DD".format(name, ecfr_date))
    retrievals, superseded = entry.get("retrievals"), entry.get("superseded")
    if isinstance(retrievals, list):
        if kind == "verbatim" and not retrievals:
            reasons.append("{} is verbatim, so it needs at least one retrieval".format(name))
        for item in retrievals:
            reasons += item_problems(item, "a retrieval in " + name, RETRIEVAL_KEYS)
    if isinstance(superseded, list):
        for item in superseded:
            reasons += item_problems(item, "a superseded item in " + name, SUPERSEDED_KEYS)
    return reasons


def item_problems(item: object, what: str, keys: Tuple[str, ...]) -> List[str]:
    """Why a retrieval or a superseded item is malformed: an object with each of `keys`, each a non-empty string,
    no other key, and no key of any name holding an empty string. A retrieval's served_url is an address or
    `not recorded`, and its retrieved a UTC time or `not recorded`."""
    if not isinstance(item, dict):
        return ["{} is a JSON object".format(what)]
    reasons = []
    for key in list(keys) + [key for key in item if key not in keys]:
        if item.get(key, "") == "":
            reasons.append("{} lacks {}".format(what, key))
        elif key in keys and not isinstance(item[key], str):
            reasons.append("{}'s {} is a string".format(what, key))
    for key in item:
        if key not in keys:
            reasons.append("{} holds the key {!r}, which is not one of {}".format(what, key, ", ".join(keys)))
    served_url = item.get("served_url") if "served_url" in keys else None
    if isinstance(served_url, str) and served_url and served_url != NOT_RECORDED and not ADDRESS.match(served_url):
        reasons.append("{}'s served_url {!r} is not an http:// or https:// address, or 'not recorded'".format(
            what, served_url))
    retrieved = item.get("retrieved") if "retrieved" in keys else None
    if isinstance(retrieved, str) and retrieved and retrieved != NOT_RECORDED and not is_utc_time(retrieved):
        reasons.append("{}'s retrieved {!r} is not a UTC time in ISO 8601 with a Z, such as 2026-10-17T03:10:00Z, "
                       "or 'not recorded'".format(what, retrieved))
    return reasons


def derivation_problem(path: str, derived_from: str, derivation: str, may_be_unrecorded: bool = True) -> Optional[str]:
    """Why a PDF's extraction, an entry derived from a .pdf, names its derivation wrongly, or None. The derivation
    is the extraction script's command for this PDF and this path, then the script's SHA-256 and the macOS and Swift
    versions; or, as any derivation may, 'not recorded', unless `may_be_unrecorded` is False, as it is for the
    extraction beside a PDF under docs/domain/sources/."""
    if derivation == NOT_RECORDED and may_be_unrecorded:
        return None
    command = PDF_EXTRACTION_COMMAND.format(pdf=derived_from, txt=path)
    rest = derivation[len(command):]
    if not derivation.startswith(command) or not HEX_DIGEST.search(rest) or "macOS" not in rest \
            or "Swift" not in rest:
        return "the derivation of {}, a PDF's extraction, is '{}' run from the repository root, followed by the " \
               "script's SHA-256 and the macOS and Swift versions it ran on".format(path, command)
    return None


def extraction_entry_problems(extraction: str, pdf: str, entry: object) -> List[str]:
    """Why the entry for the extraction beside a PDF under docs/domain/sources/ is not derived from that PDF by the
    script's command. entry_problems has already reported a missing key, a wrong type and an unknown kind, and,
    where derived_from is this PDF, a derivation other than its command or 'not recorded'; this adds the rest."""
    if not isinstance(entry, dict):
        return []
    name = "the entry for {}, the extraction of {},".format(extraction, pdf)
    kind, derived_from, derivation = entry.get("kind"), entry.get("derived_from"), entry.get("derivation")
    if kind != "derived":
        return ["{} has kind {!r}; a PDF's extraction is derived".format(name, kind)] if kind in KINDS else []
    reasons = []
    if isinstance(derived_from, str) and derived_from and derived_from != pdf:
        reasons.append("{} has derived_from {!r}; it is derived from {}".format(name, derived_from, pdf))
    if isinstance(derivation, str) and derivation and (derivation == NOT_RECORDED or derived_from != pdf):
        reason = derivation_problem(extraction, pdf, derivation, may_be_unrecorded=False)
        if reason is not None:
            reasons.append(reason)
    return reasons
