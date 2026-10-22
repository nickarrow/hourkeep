#!/usr/bin/env python3
"""Check the words inside HourKeep's screens against `.kiro/skills/interface-copy/SKILL.md`.

Run from the repository root. Exits 0 when nothing is reported, 1 when something is, and names each finding.
A clean run means the rules a checker can see did not fire. It is not a review of the screens.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from check_interface_copy import run  # noqa: E402


def main() -> int:
    root = Path.cwd()
    findings = run(root)
    for finding in findings:
        print(finding)
    if findings:
        print(f"\n{len(findings)} interface copy findings. See .kiro/skills/interface-copy/SKILL.md.")
        return 1
    print("Interface copy: nothing reported. The screens still need reading.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
