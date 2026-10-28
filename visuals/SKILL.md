---
name: visuals
description: Makes preview images of a product for case studies, posts, launch pages and READMEs, in the product's own design language. Brand hero graphics, real screenshots of the running app with mock data, focused and properly framed crops of dashboards, charts, chats and sidebars, and small data graphics. Use for requests like "make images for the case study", "screenshots of the app", "preview images", "fill the case study images", "a hero graphic with the logo", or "framed shots of the dashboard".
---

# Visuals

A set of 4–6 images that make a product look like itself at its best. Every image is either the
real app (running locally on mock data) or a graphic built from the app's own tokens, fonts and
mark. Nothing is mocked up in a different style, and nothing is a stock illustration.

The quality bar is `examples/`: open them before you start. They are 2400px wide webp at 16:10,
shot at 3× and cropped so one subject sits where the eye lands.

## Steps

1. **Read the design language.** The product's `DESIGN.md` (or design doc, tokens file,
   `styles.css`), its fonts and its mark. Note the ground, ink, muted, line and accent tokens for
   both themes. Done when you can name each token and font the graphics will use.
2. **Plan the shot list** and say it to the user in one short list before shooting:
   - a **hero** (the brand graphic, `templates/mark-grid.html`, or the product's own hero);
   - the **core moment** (the one interaction the product exists for, such as a chat
     answered, a review with notes, an invoice stamped), shot from the real app;
   - **one or two focused crops** of the working surface (a chart, a table, the sidebar with a
     tooltip or menu open);
   - optionally **a data graphic** (`templates/code-island.html`) showing a real response.
   Mix themes (roughly one light for every two dark, or the other way round when light is the
   default). No two images may show the same thing twice, not even in different themes or
   periods.
3. **Run the app with mock data.** Use a clone or worktree in a scratch directory, never the
   user's checkout, and never production data or production secrets. Start the dev servers the
   project documents. Sign in through the app's own local flow (a dev email code printed to the
   console, a seed user) and save the cookies with `curl -c jar.txt`. Seed believable data through
   the app's own API or local database. Use a plausible team with 3–4 people, Spanish or English
   names that fit the market, real-looking key names, 30–60 days of usage with weekday rhythm
   and growth, and a few errors. Done when every surface you'll shoot is full and looks lived in.
4. **Shoot** with `scripts/frame.mjs` (spec format in its header), one spec file per product:
   `node <skill>/scripts/frame.mjs shots.json`. Run `npm install` once at the skills repo root
   first. For a public site's live feature (a chat), shoot the live site only if the request
   allows it and the feature is public, and keep it to one or two requests.
5. **Review every image** at about 1400px wide (`sips -Z 1400` or `magick -resize 1400x`) and at
   its display width (about 680px) against the framing rules, fix the spec and reshoot. Done when each one passes all of them.
6. **Show the user** the images (send the files) before inserting them anywhere, with one line
   each on what it shows.
7. **Export** each approved PNG to webp, never upscaled:
   `magick in.png -resize '2400x>' -quality 88 out.webp`. Use the real pixel size in the
   `width` and `height` attributes, and write alt text that says what the image shows.
8. **Place** them where the text talks about them. In long-form pages, put at most two paragraphs
   between images, and never two images back to back.

## Framing rules

- **One subject per image**, centred horizontally on the subject, not on the page.
- **Focus, then bleed.** A crop starts just above its subject with even air (`top`, around
  64–100px at 1440 wide) and lets what follows run off the bottom edge. A chart sits at the top
  and the first table rows crop in under it. Never leave a half-empty band at the bottom.
- **Even air when the subject is whole.** A chat, a card or a data graphic is centred vertically
  (omit `top`; use `bottom` when the subject is the union of several elements). Top and bottom
  margins should read the same.
- **Zoom with `frameW`.** The subject should fill roughly 65–75% of the frame width. 900–960px
  suits a 620px card at 1440, and 760–840px suits a chat column. Smaller is closer.
- **Side-anchored subjects** (a sidebar, a rail) pin `left: 0` and use a narrower viewport
  (900–1100px), so the page content sits close beside them instead of across empty space.
- **Clean state.** Move the cursor away unless a hover is the point. Close toasts and dev
  overlays. Hide decoration that fights the subject (`hide`) when the user asks for a plain
  version. Use `freeze: true` when a tooltip or menu is mid-fade.
- **Real content only.** Real UI and real answers. A graphic may only show data the product
  really returns.
- **Overlays must not cut text.** If an open menu covers a title, show a tooltip instead or
  change the viewport.
- **Lines survive the downscale.** Pages show a 2400px image at 600–700px, so hairlines vanish.
  Draw background patterns at about 2px (at dpr 2) in a tone a step lighter than the product's
  line token, and check every image at its real display width (`magick -resize 680x`) before
  calling it done.
- **Hero graphics align to their grid.** Whole cells, edge gaps equal to inner gaps, and the
  name occupying grid cells. For an animated mark, freeze it mid-transition so the grid shows a
  wave across states (as in `examples/hero-dark.webp`).

## Reference

**Spec starting points** (1440×900 viewport, dpr 3):

| Shot | target | frameW | top |
| --- | --- | --- | --- |
| Chart card with rows bleeding below | the chart's card | 960 | 100 |
| Same card with a day hovered | the card, plus a `hover` action with `pos` and `keepMouse` | 960 | 100 |
| Chat exchange | the first bubble, `bottom: "button"` | 800–840 | omit |
| Sidebar plus tooltip | the nav; viewport 960×600 | 760, `left: 0` | 0 |
| Graphic from a template | omit (whole viewport) | n/a | n/a |

**Templates** (copy them next to your spec, edit tokens and content, then shoot them via
`file://` or a local static server):

- `templates/mark-grid.html` is the brand hero. Paste the mark's SVG and set the tokens and font,
  then choose from `?theme=`, `name=`, `wave=fade|turn` and `t=`. An animated mark (one that
  morphs) is better drawn from the product's own animation code, frozen at a chosen time, with
  each diagonal lagging the one before it.
- `templates/code-island.html` is one real response in the product's code-island style.

**Mock data hygiene:** use only local databases and local auth secrets you generate yourself.
Never copy the user's `.env` or production keys into the scratch clone. Delete or leave the
scratch clone in the scratchpad, and say where it is.

**Examples** (`examples/`, from Códice):

- `hero-dark.webp` is the mark grid, frozen mid-wave, with the name on two centre cells.
- `chat.webp` is the live chat with its hero and background hidden, centred on the exchange.
- `context-light.webp` is the code island with a real MCP response, light theme.
- `rail-tip-light.webp` is the icon rail with a frozen tooltip, the page bleeding off the right.
- `uso-30-dark.webp` is the usage chart at the top, with member rows cropping in at the bottom.

The specs that made them are in `examples/shots.json`.
