"""Dates and times as the corpus writes them: YYYY-MM-DD, and UTC in ISO 8601 with a Z."""

from __future__ import annotations

import datetime

from .constants import DATE, UTC_TIME


def is_date(text: str) -> bool:
    """YYYY-MM-DD, and a day that exists."""
    if not DATE.match(text):
        return False
    try:
        datetime.date(int(text[0:4]), int(text[5:7]), int(text[8:10]))
    except ValueError:
        return False
    return True


def is_utc_time(text: str) -> bool:
    """YYYY-MM-DDTHH:MM, with optional seconds and fraction, then Z; a day and a time that exist."""
    match = UTC_TIME.match(text)
    if match is None or not is_date(match.group(1)):
        return False
    hour, minute, second = match.group(2), match.group(3), match.group(4) or "00"
    return int(hour) < 24 and int(minute) < 60 and int(second) < 60
