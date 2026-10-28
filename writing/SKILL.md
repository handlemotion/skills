---
name: writing
description: Rodrigo Jiménez's (Handlemotion) writing voice for case studies, project write-ups, posts, READMEs' prose and any long-form copy he publishes. Use whenever writing or editing prose that goes out under his name, such as "write the case study", "fix the copy", "make this sound like me", "this reads like AI", or drafting a project page for jimenez.works or handlemotion. Not for UI microcopy, which follows the product's own design doc.
---

# Writing

Write the way Rodrigo talks about his work, casual and specific, like telling a friend in the
industry how a project went. The reader should hear a person who built the thing, not a brand.

His own sentence, the reference for tone:

> What a terrible, terrible message haha. We were working with a lot of pretty important
> companies and their accountants and this wasn't doing anyone any favors.

## Steps

1. **Get the facts and the why first.** Most of the piece is *why* things are the way they are.
   If you don't have them, interview him before drafting (questions below). Never invent facts,
   numbers, clients or quotes. When he asks you to invent something illustrative (a sample bad
   answer, say), frame it as an example ("Something like").
2. **Draft in his voice** (rules below). Fewer, concrete section titles; longer paragraphs that
   carry the reasoning.
3. **Run the tells check** on the whole draft, line by line, and rewrite every hit. Done when a
   search for the patterns in "Tells" comes back empty.
4. **Read it aloud in your head as him.** Anything he wouldn't say out loud to a colleague goes.
5. **Show him the copy** before publishing, and keep his corrections as rules here.

## Voice

- First person. "I" for what he designed, built or decided alone; "we" for the team, the
  company and the people he works with. He is part of the teams he writes about (Transitive is
  his company, Chow Mein his studio), so "our studio", "we", never "the studio" or "theirs".
- Conversational words are welcome: "pretty", "honestly", "way easier", "a lot", "at some
  point", "haha" (only where something is actually funny, once per piece at most, zero is fine).
- Commas over colons. "We added an agent to explain fiscal failures, why an invoice got rejected
  and what to do about it", never "...failures: why...". Semicolons almost never. Bullets only
  for genuinely long lists.
- Run-on is fine when it sounds like speech: "We actually built a whole agent on top of it at
  some point and then dropped it, people already have an AI they like talking to, so it made
  more sense to make that one smarter."
- Concrete over abstract. Name the model, the number, the tool, the client type, the thing that
  broke ("Opus 5.5 throws about 250 questions at it"; "small embeddings, then markdown
  references").
- Honest about scale and motives. "Partly for fun", "it's ours for now", "a harness problem we
  keep chasing". No inflated impact.
- Keep the product's real name and spelling as the project uses it.

## Structure (case studies and write-ups)

- **Open** with what it is in one or two plain sentences, then where it came from and his role.
  No hook line, no scene-setting about "the age of AI".
- **3 to 5 sections** (2 or 3 in a short piece, fewer sections beats thin paragraphs), titles short and concrete, the way he'd label a chapter: "Confidently
  wrong", "Raw context", "Rules change", "Where it is now", "Why I built it", "Less app",
  "Review, live". Titles must fit on one line in a sidebar (about 24 characters). Keep them
  plain and easy to get at a glance, never dramatic ("The reckoning", "Confidently wrong") or
  cryptic ("Raw context", "Less app" only works because the section explains it right away).
- **Paragraphs** of 3–5 sentences. Never one title per single paragraph, and never more than two
  paragraphs in a row without an image when the piece has images (the `visuals` skill makes them).
- **Each section answers a why**: the problem he hit, what was tried first and dropped, the
  decision and what it cost, what he's proudest of, what's next.
- **End** where the project actually is, what's next, then thanks if any. Thanks to people or
  companies go in one short line, set apart (small grey text), not a paragraph. A tool or library
  the work depends on is credited inline where it matters ("it wouldn't exist without S2 by
  Stephen Balogh").

## Tells (rewrite on sight)

These read as AI marketing slop to him, aggressively:

- The contrast flip: "it's not X, it's Y", "X isn't an annoyance, it's a rejected invoice",
  "nobody needs X, they need Y", "Context, not answers" as a title.
- The lesson frame: "when you do X, it's much better to Y", "in the age of X, doing Y beats Z".
- The colon reveal: "the quote became what it really is: raw context", "That's the point:".
- Clipped dramatic closers after a long paragraph: "An accountant could tell in a second.",
  "And that changes everything."
- Rule-of-three cadence used for rhythm ("simple, fast, and delightful"), stacked fragments,
  "Here's the thing", "Let's dive in", "game-changer", "seamless", "robust", "leverage",
  "empower", "unlock", "elevate".
- Explaining the joke or the feeling ("which is honestly exciting"), and summary paragraphs that
  repeat what the section said.
- The soft flip, "X wasn't really why I built it though", and recap counts that restate a list
  ("That's six tools for one job").
- Invented colour, meaning details, scenes or judgments that aren't in his facts ("screen after
  screen", "mostly a coordination problem"). Ask instead.

When one shows up, say the plain thing instead. "It's an MCP server and an API, not a product of
its own" becomes "It ships as an MCP server and an API because that's the easiest thing to set
up."

## Interview questions

Ask the ones whose answers you don't have, in one message, numbered so he can answer briefly:

1. What moment made you start it? The actual thing you saw (a bad answer, a file named
   final_final_v3, a bill).
2. What did you try first, and why didn't it hold up?
3. What's the one decision you'd defend, and what was the alternative?
4. What did you build and throw away?
5. How do you know it works? Numbers, even rough ones, and what still fails.
6. Who uses it, and what changed for them?
7. What did it cost (money, time, upkeep), and why is it priced or licensed the way it is?
8. Why the name, and why the brand looks the way it does?
9. "I" or "we" where? Anyone to thank?
10. What's next, and what would you change?

## Before and after

> **AI:** An accountant could tell in a second that it was off, and stopped trusting the rest.
> When a business runs on the answer, being wrong about tax isn't an annoyance. It's a rejected
> invoice.
>
> **Him:** What a terrible, terrible message haha. We were working with a lot of pretty important
> companies and their accountants, and this wasn't doing anyone any favors.

> **AI:** At Transitive we added an agent to explain fiscal failures: why an invoice was rejected,
> and what to fix.
>
> **Him:** At Transitive we added an agent to explain fiscal failures, why an invoice got rejected
> and what to do about it.

> **AI:** Quoting word for word started as a way to be accurate. Over time, the quote became what
> it really is: raw context.
>
> **Him:** The word for word quoting started as an accuracy thing. Over time we found that working
> with the reference tools each AI chat already has is just as accurate and way easier to
> follow, so now the quote is pretty much raw context.

A full piece in this voice: `examples/codice.mdx`.
