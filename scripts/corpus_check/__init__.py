"""The policy corpus checker, run as scripts/check-corpus.py. One module per part of the corpus:
constants, report, files, dates, rows, sources, manifest_entries, manifest, states, questions, skill, review, and
run, which runs them in order.

What it reads:
- the extract, docs/domain/community-engagement-extract.md: its rows, each row's fields, each field's value, and
  each Source, which must rest on a stored source with a manifest entry, other than a PDF, on a line that exists,
  holding the quoted words; a Citation's parts, here and in the state facts, separated by exactly '; ';
- the manifest, docs/domain/sources/MANIFEST.json: each manifest entry's keys, which must be the listed ones and no
  others, with no empty string under any key of the entry or of its retrievals and superseded items, and each
  retrieval and superseded item holding its own keys and no others; its cited_url and each retrieval's served_url,
  an http:// or https:// address or `not recorded`; each retrieval's retrieved, a UTC ISO 8601 time with a Z or
  `not recorded`; each superseded item's by, which must name a manifest entry; for each PDF under
  docs/domain/sources/, an entry for its extraction, the PDF's path with .txt in place of .pdf, derived from that
  PDF by the script's command, whose first line is [[page 1]] and whose later [[page N]] lines each count one more
  than the last; a PDF extraction's derivation, the extraction script's command followed by its SHA-256 and the
  macOS and Swift versions, or `not recorded` for an entry derived from a PDF elsewhere; its path,
  which must be relative, in docs/domain/, free of `..` segments, and neither a research record nor one of the
  corpus's own files; and each stored source's presence, as a file git lists at exactly that path and not a symlink,
  its SHA-256 hash and its `git check-attr -z text` answer, which must be unset. A path that cannot be opened or
  hashed is reported as a problem;
- the state facts, every docs/domain/states/*.json git lists, federal.json and co.json required: each file's name,
  the federal file's name, which must be Federal default; each state fact's keys and values, its row, its checked
  value, which takes a row's Verified vocabulary less `no`, its citation as its first source's tier reads it, and
  each of its sources, checked as a row's Source is, with a url that is an http:// or https:// address;
- the open questions, docs/domain/open-questions.md: each ### question's list of fields, which must be Why it is
  open, starting with one or more of the four reasons separated by semicolons, Who can answer, Raised and one or
  more Sources, in that order, none empty, with an optional Note last. Whether a Source quotes words on its line is
  not checked yet;
- the skill, .kiro/skills/medicaid-community-engagement/: its main file, SKILL.md, with its frontmatter, its length,
  its ## Topics, ## Precedence and ## Watch list headings, each exactly once, and the list items under ## Topics,
  each starting with a link to a topic file that exists, at least one of them; and each topic file, every .md file
  directly in references/, which must be linked and hold at least one rule item: its first line, # and its title,
  its length, and each list item, which is a rule item, its ## group heading, continuation indent, words before the
  identifier, identifier, citation and numbers; and that each row of the extract has exactly one rule item across
  the topic files. A line inside a fenced code block is neither a heading nor a rule item; the bracketed-identifier scan
  still reads it. An absent SKILL.md is reported on a line of its own, references/ is not checked, and the rest is;
- the review pages, docs/review/: each file there, at any depth, must be one scripts/build-review-pages.py makes and
  hold exactly its bytes, and each page it makes must be there. The pages are made in memory by importing the
  generator's package, scripts/review_pages/, which reads the corpus from the disk; nothing is written. A
  docs/review/ holding no file is reported absent on a line of its own and the rest is checked.

How it lists files: `git ls-files -z --cached --others --exclude-standard`, so files git ignores are skipped. Every file
it lists in docs/domain/ outside docs/domain/research/ must be a manifest path or one of the corpus's own files,
OWN_FILES in constants.py. The extract, the open questions, the manifest, the state files and the skill are read
only when git lists them, so one git ignores is missing, or for the skill absent, as it would be from a clone; when
git cannot list files, they are read from the disk.
"""
