"""Tests of scripts/extract-pdf-text.swift, run on small PDFs written here by hand: the [[page N]] lines, nothing
printed unless every page has text, and the exit codes. They need macOS and swift on the PATH, and skip otherwise."""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import List, Optional

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = "scripts/extract-pdf-text.swift"
TIMEOUT = 300  # seconds; the first run of a Swift script compiles it
FIRST = "First page words"
SECOND = "Second page words"


def pdf(pages: List[Optional[str]]) -> bytes:
    """A PDF with one page per item, showing the item's text in Helvetica, or drawing a line and no text for None.

    Objects 1 to 3 are the catalog, the pages tree and the font; each page is a page object and its content stream.
    """
    page_numbers = [4 + 2 * index for index in range(len(pages))]
    kids = " ".join("{} 0 R".format(number) for number in page_numbers)
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [{}] /Count {} >>".format(kids, len(pages)).encode("ascii"),
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    for number, text in zip(page_numbers, pages):
        objects.append(
            "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> "
            "/Contents {} 0 R >>".format(number + 1).encode("ascii")
        )
        if text is None:
            content = b"72 700 m 300 700 l S"
        else:
            content = "BT /F1 24 Tf 72 700 Td ({}) Tj ET".format(text).encode("ascii")
        objects.append(b"<< /Length %d >>\nstream\n%s\nendstream" % (len(content), content))
    document = bytearray(b"%PDF-1.4\n")
    offsets = []
    for number, body in enumerate(objects, start=1):
        offsets.append(len(document))
        document += b"%d 0 obj\n%s\nendobj\n" % (number, body)
    xref = len(document)
    document += b"xref\n0 %d\n0000000000 65535 f \n" % (len(objects) + 1)
    for offset in offsets:
        document += b"%010d 00000 n \n" % offset
    document += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objects) + 1, xref)
    return bytes(document)


@unittest.skipUnless(sys.platform == "darwin" and shutil.which("swift"), "needs macOS and swift on the PATH")
class ExtractPdfTextTest(unittest.TestCase):
    """Formats, "Stored sources and the manifest": each page starts with a line [[page N]], counting from 1.

    The script's own header gives the rest: exit 2 for wrong arguments, exit 1 for a PDF it cannot read or a page
    with no extractable text, and nothing on standard output unless every page has text.
    """

    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)

    def extract(self, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(
            ["swift", SCRIPT] + list(args), cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8",
            timeout=TIMEOUT,
        )

    def write_pdf(self, name: str, pages: List[Optional[str]]) -> str:
        path = Path(self.folder.name) / name
        path.write_bytes(pdf(pages))
        return str(path)

    def test_a_two_page_pdf_prints_each_page_after_its_marker(self):
        result = self.extract(self.write_pdf("two-pages.pdf", [FIRST, SECOND]))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        lines = result.stdout.splitlines()
        self.assertEqual(lines[:1], ["[[page 1]]"], result.stdout)
        self.assertEqual([line for line in lines if line.startswith("[[page")], ["[[page 1]]", "[[page 2]]"])
        second = lines.index("[[page 2]]")
        self.assertEqual("\n".join(lines[1:second]).strip(), FIRST, result.stdout)
        self.assertEqual("\n".join(lines[second + 1:]).strip(), SECOND, result.stdout)

    def test_a_page_with_no_text_exits_1_and_prints_nothing(self):
        result = self.extract(self.write_pdf("second-page-blank.pdf", [FIRST, None]))
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertEqual(result.stdout, "", result.stderr)

    def test_a_missing_file_exits_1(self):
        result = self.extract(str(Path(self.folder.name) / "no-such.pdf"))
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)

    def test_no_argument_exits_2(self):
        result = self.extract()
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
