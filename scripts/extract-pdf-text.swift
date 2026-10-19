// Prints the text of a PDF, page by page, using macOS's PDFKit.
//
// Usage, from the repository root:
//
//     swift scripts/extract-pdf-text.swift <pdf> > <txt>
//
// Each page starts with a line [[page N]], counting from 1, so a row can cite the
// extraction by line and a reader can find the same place on the rendered page.
// PDFKit can separate a paragraph's label from its text, so read the paragraph a
// row cites on the rendered page, not only in the extraction. The format is set
// in docs/epics/0001-policy-corpus/design.md, under "Formats".
//
// Exits 2 when the arguments are wrong, and 1 when the PDF cannot be read or a
// page has no extractable text at all, such as a scanned image or a blank page,
// so a run that succeeds cannot leave a page out. It cannot tell when part of a
// page is an image, and that part's words are then missing from the extraction.
// It writes nothing to standard output unless every page has text. The shell
// empties <txt> for the redirect above before the script runs, so a failed run
// leaves <txt> empty; for a stored extraction, git restores it.

import Foundation
import PDFKit

func fail(_ message: String, status: Int32) -> Never {
    FileHandle.standardError.write("extract-pdf-text: \(message)\n".data(using: .utf8)!)
    exit(status)
}

let arguments = CommandLine.arguments
guard arguments.count == 2 else {
    fail("usage: swift scripts/extract-pdf-text.swift <pdf> > <txt>", status: 2)
}

let path = arguments[1]
guard FileManager.default.fileExists(atPath: path) else {
    fail("no such file: \(path)", status: 1)
}
guard let document = PDFDocument(url: URL(fileURLWithPath: path)) else {
    fail("cannot open as a PDF: \(path)", status: 1)
}
guard !document.isLocked else {
    fail("the PDF is locked: \(path)", status: 1)
}
guard document.pageCount > 0 else {
    fail("the PDF has no pages: \(path)", status: 1)
}

// Read every page before printing any, so a failure prints no partial extraction.
var pageTexts: [String] = []
for index in 0..<document.pageCount {
    guard let page = document.page(at: index) else {
        fail("cannot read page \(index + 1) of \(path)", status: 1)
    }
    let text = page.string ?? ""
    guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
        fail("page \(index + 1) of \(path) has no extractable text; it may be a scanned image or blank", status: 1)
    }
    pageTexts.append(text)
}

for (index, text) in pageTexts.enumerated() {
    print("[[page \(index + 1)]]")
    print(text)
}
