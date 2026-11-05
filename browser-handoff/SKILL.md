---
name: browser-handoff
description: Hands account and dashboard setup to a browser agent (Claude in Chrome) as one copy-paste prompt, when a coding agent's CLIs can't do it. Use when a deploy or launch needs dashboard-only work, such as buying a domain or plan, creating OAuth apps, API tokens, a secrets project, CI integrations or registry settings, or when a CLI call fails for missing permissions. Also use when the user asks to "write a prompt for the browser", "hand this to Chrome" or "what do I need to set up".
---

# Browser handoff

A coding agent in a terminal does what its CLIs allow. The rest — purchases, dashboard toggles,
OAuth apps, tokens only a dashboard can mint — goes to a browser agent the user runs in their own
logged-in Chrome. The _handoff_ is one prompt in a code block that the browser agent can run
top to bottom without asking what anything means, plus a short list of what only the human can
do. The terminal agent keeps every step it can do itself, and verifies the browser's work after.

## Steps

1. **Probe before you hand off.** Try each setup step with the CLIs and tokens you have
   (`wrangler`, `doppler`, `gh`, `stripe`, `curl` against the API), read-only first. A token that
   reads can still fail to write: a 403 or "no write access" is the signal that a step moves to
   the browser. Done when every step is tagged _terminal_, _browser_ or _human_ (needs a 2FA
   prompt, a personal decision, or a terminal on the user's machine).
2. **Keep secrets out of the browser where you can.** Secrets you can generate (signing keys,
   session secrets, service tokens), generate yourself and pipe straight into the secret store.
   For that, the handoff's first step grants your own CLI identity write access to the store
   (for example, a Doppler service account as Collaborator on one project). The browser then only
   moves secrets that a dashboard shows once: OAuth client secrets, API tokens.
3. **Write the handoff** with the template below. Every step names exact values: hostnames,
   names, regions, permissions, build commands, variable names and values, callback URLs. Write
   "Worker name: `api`", never "configure the Worker". Order steps by dependency (store before
   anything that writes into it; domain before DNS, certificates and email).
4. **Mark every purchase** with what it is and what it costs, and give the minimum term when a
   later step depends on it (for example, the Public Suffix List wants more than two years of
   registration left).
5. **Say what the browser must not create**: records or resources a deploy makes on its own
   (custom-domain DNS records, routes), so they don't collide.
6. **List the human-only steps** outside the code block, each with its exact commands.
7. **After the browser reports, verify from the terminal.** Check secrets by name, length and
   format only; check ids resolve (the token sees the database, the service token reads its
   config); fill what you held back; re-run the pipeline that was red; check the live endpoints.
   Done when the pipeline is green and the endpoints answer, or each remaining failure is named
   with its cause.

## Template

````text
You are setting up production accounts for <product> (repo <url>). Work in my logged-in Chrome.
Do the steps in order. If a step is blocked (payment, verification, permission), stop that step,
tell me exactly what blocks it, and go on with the steps that don't depend on it.

SECRET RULE: client secrets and API tokens go straight from the page that shows them into the
<store> field named below. Never type them into this chat, a summary, a note or any other field.
In your report, write "set" next to their names, never the values. Plain values (ids, hostnames)
are fine to report.

Hosts: <every hostname and what it serves>

1. <STORE> (<dashboard url>)
   a. Create <project/configs>.
   b. Give <my CLI identity> <role> on this project only.
2. <SERVICE> (<dashboard url>, account <name>)
   a. <purchase>: <what>, <term>. (<cost>)
   b. <setting>: <exact value>. Do NOT create <records the deploy makes>.
   c. Create <token> with permissions <exact list>, scoped to <account>; paste it straight into
      <store>/<config> as <NAME>.
3. ...

FINAL REPORT
- Each step: done, skipped or blocked (and why).
- Plain values created: <ids, client ids, URLs>.
- <store>: the secret NAMES now in each config.
- The first run of <build/deploy>, with the last ~40 lines of the log if it failed.
````

## Answering screenshots mid-run

The user often sends a screenshot of a form the browser agent stopped on ("is this right?").
Check each field against the code that consumes it, not against intuition. Example: a secrets
sync offering "sync unmasked values as variables" is wrong when the workflow reads
`secrets.NAME`, because the values would land as variables and every lookup comes back empty.
Answer yes or no first, then the one field that matters and why.

## Rules

- A permission the user grants to make the handoff smaller (a write role, a token scope) is
  scoped to one project or resource, never the whole account.
- Report outcomes from your own checks, not from the browser agent's summary.
- Credentials are never printed, echoed or written to disk by the terminal agent either: pipe
  them (`openssl rand -base64 32 | <store> set NAME >/dev/null`) and check by length.
