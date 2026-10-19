"""The policy corpus checker, run as scripts/check-corpus.py. One module per part of the corpus:
constants, report, files, dates, rows, sources, manifest_entries, manifest, states, skill, and run, which runs
them in order.

What it reads:
- the extract, docs/domain/community-engagement-extract.md: its rows, each row's fields, each field's value, and
  each Source, which must rest on a stored source with a manifest entry, other than a PDF, on a line that exists,
  holding the quoted words;
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
  the federal file's name, which must be Federal default; each state fact's keys and values, its row, its citation as
  its first source's tier reads it, and each of its sources, checked as a row's Source is, with a url that is an
  http:// or https:// address;
- the skill, .kiro/skills/medicaid-community-engagement/SKILL.md: its frontmatter, its length, its ## Rules,
  ## Precedence and ## Watch list headings, at least one rule item under ## Rules, and each rule item's ### topic,
  continuation indent, words before the identifier, identifier, citation and numbers. A line inside a fenced code
  block is neither a heading nor a rule item; the bracketed-identifier scan still reads it. An absent skill is
  reported on a line of its own and the rest is still checked.

How it lists files: `git ls-files -z --cached --others --exclude-standard`, so files git ignores are skipped. Every file
it lists in docs/domain/ outside docs/domain/research/ must be a manifest path or one of the corpus's own files,
OWN_FILES in constants.py. The extract, the manifest, the state files and the skill are read only when git lists
them, so one git ignores is missing, or for the skill absent, as it would be from a clone; when git cannot list
files, they are read from the disk.
"""
