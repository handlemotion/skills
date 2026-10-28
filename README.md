# Skills

Rodrigo Jiménez's agent skills, for Claude Code and any agent that reads `SKILL.md` folders.

| Skill | What it does |
| --- | --- |
| [`writing`](writing/SKILL.md) | Writes case studies and long-form copy in my voice, and catches AI-slop tells. |
| [`visuals`](visuals/SKILL.md) | Makes framed preview images of a product: brand heroes, real screenshots on mock data, focused crops, data graphics. |
| [`balance-out`](balance-out/SKILL.md) | Evens out UI spacing by padding to the letters, and proves it by measurement. |

## Install

```bash
git clone https://github.com/handlemotion/skills ~/Workspace/Product/handlemotion/skills
cd ~/Workspace/Product/handlemotion/skills && npm install
for s in writing visuals balance-out; do ln -sfn "$PWD/$s" ~/.claude/skills/$s; done
```

The scripts in `visuals` and `balance-out` need `playwright-core` (installed by `npm install` above)
and a Chromium: Playwright's own (`npx playwright install chromium`), Google Chrome, or one at
`CHROME_PATH`.
