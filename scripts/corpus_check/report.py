"""A problem, reported as `file:line: message`, and the counts the checker prints last."""

from __future__ import annotations

from typing import NamedTuple


class Problem(NamedTuple):
    path: str
    line: int  # 0 when the problem is with the file as a whole
    message: str

    def __str__(self) -> str:
        return "{}:{}: {}".format(self.path, self.line, self.message)


class Counts:
    def __init__(self) -> None:
        self.rows = 0
        self.unverified_rows = 0
        self.sources = 0
        self.state_facts = 0
        self.not_published = 0
        self.warnings = 0
        self.skill_items = 0

    def __str__(self) -> str:
        return (
            "Checked {} rows ({} say Verified: no), {} sources, {} state facts ({} marked not published), "
            "{} warnings, {} skill items.".format(
                self.rows,
                self.unverified_rows,
                self.sources,
                self.state_facts,
                self.not_published,
                self.warnings,
                self.skill_items,
            )
        )
