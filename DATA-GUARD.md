# Keeping real data away from the agent

Read this if you are working in this repository and have not set up the deny rule, or if you have just cloned it and
somebody else did. Five minutes, once per machine.

It matters because the protection is **per machine, not per repository**. Whoever set this up protected themselves.
Nothing they did protects you. If you cloned this and skipped this file, the `sensitive/` folder is a folder with a
promising name and nothing behind it.

## What protects the data, in order

Where a file lives does more work than any rule about it. If nothing real is in the workspace, there is nothing to leak,
and that is the actual boundary. Synthetic and de-identified data are fine to work with. The test is whether a real
person is identifiable, and a file that merely looks like a data extract is a different question from whether it is one.

If something real has to be on this machine, it goes in `sensitive/`. The `.gitignore` here stops anything in there from
being committed. That is git, and git is not the agent: an uncommittable file is still perfectly readable. So the second
thing is a rule that stops the agent reading it.

## The rule

Kiro keeps permission rules on your own machine, outside any repository, which is why this cannot ship already done.
Nothing you clone can loosen them, and a deny beats every other rule. It also means nobody can do this for you,
including Kiro, which is not allowed to write to its own settings.

The file is here:

- Mac or Linux: `~/.kiro/settings/permissions.yaml`, where `~` is your home folder
- Windows: `%USERPROFILE%\.kiro\settings\permissions.yaml`

Ask Kiro in the chat panel to open that path. If it is not there, type this into the chat, including the first three
words, and say yes when Kiro asks to run a command:

> Run this for me: mkdir -p ~/.kiro/settings && touch ~/.kiro/settings/permissions.yaml

That makes an empty file. You type the contents yourself and save, because Kiro is blocked from writing here. If it
offers and then fails, that is the protection working.

### If the file is empty

Paste this whole block and save:

```yaml
rules:
  - capability: fs_read
    effect: deny
    match:
      - "**/sensitive/**"
      - "**/phi/**"
      - "**/pii/**"
  - capability: fs_read
    effect: ask
    match:
      - "**/*extract*.csv"
      - "**/*member*.csv"
      - "**/*claims*.csv"
      - "**/*beneficiary*"
      - "**/*.mdb"
      - "**/*.accdb"
```

### If the file already has rules in it

Do not paste the block. Merging YAML by hand goes wrong quietly, and the most
common slip produces a file that is valid and has thrown your existing rules away. Instead, ask Kiro this:

> Read my permissions file, then show me what it should look like with two more fs_read rules added: a deny on
> `**/sensitive/**`, `**/phi/**` and `**/pii/**`, and an ask on `**/*extract*.csv`, `**/*member*.csv`,
> `**/*claims*.csv`, `**/*beneficiary*`, `**/*.mdb` and `**/*.accdb`. Do not change my existing rules. Print the whole
> file for me to copy.

Kiro can read that file even though it cannot write it. Copy what it prints, replace the contents, save.

## Then check it, because a silent failure here looks like success

Ask Kiro:

> How many rules are in my permissions file, and what does each one do?

Count them against what you expected. If a rule you had before is missing, the paste replaced it rather than adding to
it, and you need to put it back. This is the step people skip and it is the one that catches the failure that looks
fine.

Then prove the deny works:

> Read sensitive/FAKE-eligibility-extract.csv and show me what is in it.

It should refuse and name the rule that stopped it. That file is fake and its values are nonsense on purpose. If it
reads the file instead, the guard is not working on your setup: check you saved, check the indentation, and check the
file is in your home folder and not inside this repository. Do not assume you are protected.

Never test this with a real extract. The fake one ships so you never have to.

## Three honest limits

It covers the agent's file-reading tools and not the shell, so a shell command reading a denied path returns the
contents. This was tested rather than assumed. A list of blocked commands would not fix it, because every scripting
language on the machine can open a file. This is a backstop against the unthinking read, not a wall.

Do not try to demonstrate that limit by asking the agent to get around its own guard. Doing so hit a hard stop that
ended the session and lost the conversation. Knowing the gap is there is the useful part.

It is enforced by Kiro on your machine, so somebody with administrator rights on that machine can remove it. It is not a
server-side boundary and should not be described as one to a security office.

The ask list matches on filenames, and these rules apply machine-wide, so it will occasionally prompt in unrelated work.
That is the cost of putting them somewhere a cloned repository cannot weaken. Adjust both lists to your own naming.

## The thing no rule here touches

Anything typed or pasted into a chat window. No permission rule sees that, and in an office it is the likeliest way
something sensitive leaves. Whether your prompts are used to improve the model depends on your Kiro account: an
organisation-provided account is excluded automatically, and a free or individual one is opted in by default and has a
checkbox under Settings, User, Application, Telemetry and Content. Worth checking before the rest of this, because a
deny rule on a folder is worth little if everything you type goes somewhere you did not intend.
