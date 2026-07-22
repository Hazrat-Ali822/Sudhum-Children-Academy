# sudhum.edu.pk

Sudhum Children Academy & Science College, Rustam — website.

One HTML file. No build step, no framework, no `npm install`.
Upload the files and the site runs.

```
index.html          the whole site — markup, CSS, JavaScript, data
assets/
  logo.png          crest (header, favicon, and both printed slips)
  director-habib.jpg
  principal-haider.jpg
  photos/           campus photographs go here (hero + gallery)
server/
  apps-script.gs    Google Apps Script — form receiver
  SETUP.md          ten-minute setup guide
.htaccess           clean URLs, gzip, caching
robots.txt
sitemap.xml
```

---

## What the office edits

Everything sits in one block in `index.html`, at the top of the `<script>`
tag, under the `EDIT THIS BLOCK` comment. You never need to touch the HTML.

| What you want to change | Where |
|---|---|
| A new notice or admission announcement | `NOTICES` |
| Board results, position holders | `RESULTS` |
| Class-wise fees | `FEES` |
| Book lists | `BOOKS` |
| Uniform | `UNIFORM` |
| Gallery photographs | `GALLERY` + `assets/photos/` |
| The list of teachers | `FACULTY` |
| Entry test date, time and venue | `CONFIG.test` |
| WhatsApp number, email | `CONFIG` |

### Adding a notice

Put the new block at the **top** of the `NOTICES` list:

```js
{
  date  : "2026-08-01",
  cat   : "Datesheet",              // Admission | Test | Result | Datesheet | General
  title : "F.Sc first year datesheet",
  body  : "Papers begin 12 August. The full datesheet is on the notice board.",
  link  : { href: "/notices", text: "Details" },   // optional
  pinned: false                                     // true keeps it above the rest
}
```

Whichever notice sits at the top also appears automatically in the amber
strip below the header.

### Fee amounts

Leaving `admission` or `tuition` blank in `FEES.rows` makes that cell read
"Ask the office". Leave the whole list blank and the fee table is replaced
by a plain "not published yet" panel — **no invented figures are ever
shown.** Results, book lists and uniform behave the same way.

### Photographs to add

The site already expects these three files. Save them into
`assets/photos/` with **exactly** these names — no code needs changing:

| File | Which photograph | |
|---|---|---|
| `campus-dusk.jpeg` | The campus at dusk with the mountains behind — **the home page hero** | ✅ added |
| `courtyard.jpeg` | The main courtyard, seen across the sand | ✅ added |
| `stairway.jpeg` | The stairway and classroom blocks | ✅ added |

Three gallery slots are still waiting for photographs that do not exist yet:
`assembly.jpg`, `laboratory.jpg`, `prize-day.jpg`. Add them the same way, or
edit the `GALLERY` list. A missing file just leaves an empty frame.

Note the `.jpeg` extension on the three that exist — `GALLERY` and
`CONFIG.heroPhoto` have to match the file name exactly.

### Home page photograph (hero)

The photograph is the **background of the hero section** — the headline,
the Urdu name, the paragraph and the buttons all sit on top of it.

Because of that the hero has two forms, and JavaScript picks between them:

- **With a photograph** the hero turns dark: navy scrim over the picture,
  white headline, pale gold accents, a white primary button.
- **Without one** (`heroPhoto` empty, or the file missing) it falls back to
  the plain light hero — dark text on the page background. Nothing is
  half-styled and no broken image is ever shown.

`CONFIG.heroPhoto` points at `assets/photos/campus-dusk.jpeg`. To use a
different photograph, change that one line.

**A word on the scrim.** The dark wash over the photograph is not
decoration — it is what makes the words legible. Its opacity was set by
measuring the lightest pixel behind every piece of hero text and checking
it against the WCAG AA contrast requirement, at 1440px, 900px and 390px.
The narrowest margin is 5.35:1 against a required 4.5:1.

If you swap in a **lighter** photograph — bright midday sky, pale walls —
re-check it. Lightening the scrim to show more of a picture is exactly how
hero text becomes unreadable. The brand gold in particular cannot be used
for small text over a photograph at all; that is why the eyebrow is a paler
gold here than everywhere else on the site.

`CONFIG.heroFocus` decides which part survives the crop. The band is 21:9 on
a desktop and 4:3 on a phone, so a tall photograph loses its top and bottom.
`"center 30%"` keeps more sky, `"center 70%"` keeps more ground. It is
currently `"center 48%"`.

`CONFIG.heroMotion` adds a very slow drift across the photograph — 26
seconds from edge to edge, barely perceptible. It costs nothing to download
and gives the hero some life without a video file. Set it to `false` to stop
it. It turns itself off for anyone who has disabled animations.

What a hero photograph needs to be:

- **Landscape**, at least **1600px** wide
- Cropped to 21:9 on the desktop and 4:3 on a phone, so the important
  part — children, the building — must be **near the centre**, not at
  the edges
- Good subjects: assembly, the campus front, a classroom, prize distribution

If the file is missing the band removes itself. A broken image is never shown.

### Hero video (optional)

A short clip can play in place of the photograph:

```js
heroPhoto : "assets/photos/hero.jpg",     // REQUIRED — it is the poster frame
heroVideo : "assets/photos/hero.mp4",
```

The video **does not play at all** in four cases — the photograph is shown
instead:

1. The visitor has turned off animations (`prefers-reduced-motion`)
2. The browser's **Data Saver** is on
3. The connection is 2G or slow 3G
4. The screen is small (under 820px) — to spare mobile data

Rules for the clip:

- **6-10 seconds**, silent, looping cleanly
- **Under 2 MB** — anything larger is punishing on a phone
- Around 1600×686 (21:9), H.264 MP4
- Sound is pointless: browsers refuse to autoplay video with audio

Until the video loads — or if it never plays — `heroPhoto` is what shows.

### Gallery

Put the photograph in `assets/photos/` with a file name matching the
`GALLERY` list. A missing file leaves an empty dashed frame; nothing breaks.
Clicking a photograph opens it full screen.

---

## Forms

An online admission application or entry test registration goes to **three**
places:

1. **A printed slip** — with a reference or roll number, which the parent
   brings to the office
2. **WhatsApp** — one tap sends the whole record to the office
3. **A Google Sheet and an email** — once `CONFIG.formEndpoint` is set

The third is currently **off** (`formEndpoint : ""`). To switch it on, follow
[`server/SETUP.md`](server/SETUP.md) — it takes about ten minutes.

If the network fails, the submission is kept in the browser and sent
automatically the next time the page is opened.

---

## Navigation

Seven items at the top level, three of them dropdowns:

| Menu | Contents |
|---|---|
| **Academics** ▾ | Sections & subjects · Book lists · Faculty |
| **Student** ▾ | Admission rules · Eligibility · Tuition & fees · Scholarship · Uniform · Apply online · Entry test slip |
| **Campus** ▾ | Facilities · Hostel · Gallery |

The rest: Home, About, Notices, Contact.

Several submenu items are not separate pages but sections within one. They
work through `data-anchor`:

```html
<a href="#/admissions" data-anchor="fees">Tuition &amp; fees</a>
```

That means: go to `/admissions`, then scroll to the element with `id="fees"`.
When adding a submenu item, remember to give its target an `id` — without
one the link only reaches the top of the page.

Existing anchors: `sections`, `books`, `admission-rules`, `eligibility`,
`fees`, `scholarship`, `uniform`, `facilities-list`, `hostel`, `gallery`.

Menus open on hover on the desktop and become tap-to-open accordions in the
mobile drawer. Keyboard: Tab, Enter, Escape.

**There is deliberately no third level** (such as Student → Admission →
Rules). A third level is hard to open on touch and becomes badly cramped in
the mobile drawer. Rules, Fees and Eligibility sit directly in the Student
menu instead — nothing is lost and it takes one click fewer.

---

## Why some things are in the markup, not in JavaScript

Three pieces of state are written into the HTML rather than applied by
script, and they must stay that way:

- **`class="page is-active"` on `#page-home`.** Every page is `display:none`
  by default. Without this the whole site is a blank white area until the
  router runs — seconds of it on a slow phone. The router moves the class
  when the URL asks for a different page.
- **The office data block sits in `<head>`.** `CONFIG` has to exist while
  the body is still parsing, because the hero reads it before the first
  paint.
- **A small inline script beside the hero markup** sets the photograph and
  the dark `has-photo` styling. Doing it at `DOMContentLoaded` made the hero
  visibly flip from light to dark after the page had already appeared, and
  held back the photograph's download until then.

The hero copy uses a **CSS-only** entrance animation for the same reason.
It is the first thing anyone sees, so it cannot wait for JavaScript. The
scroll-reveal system deliberately skips it.

The notice strip's text is written into the HTML to match the newest
`NOTICES` entry, so it does not visibly change when the script runs. If you
add a notice that becomes the top one, update that line too — or accept a
brief flicker.

**Fonts are loaded without blocking the first paint** (`media="print"` and
an onload swap, with a `<noscript>` copy). A render-blocking font stylesheet
cost 370ms of blank screen on a throttled connection.

Measured on a 400kbps / 150ms / 4x-slow-CPU profile: first paint ~740ms,
largest paint ~1.3s, layout shift 0.0002.

## Animations

All of it is CSS transitions and `IntersectionObserver` — no library, no
extra files.

- Sections rise into place as they reach the screen, each slightly after the last
- The header gains a shadow and a smaller crest once you scroll
- Hover and press feedback on cards, notice items and buttons
- The gallery lightbox fades and zooms

**The header must never change height.** It is `position:sticky`, which
means it is still part of the page flow. If it got shorter when you
scrolled, everything below it would slide up; the browser would then
correct the scroll position to compensate, that correction would push the
page back above the threshold, the header would grow again — and it would
strobe. This actually happened: resting anywhere between 12 and 27 pixels
down produced about forty flips a second.

So `.site-head .wrap` carries a `min-height` equal to its unscrolled
height, and only the crest inside it changes size. If you ever add
something to the header, keep that rule: the crest may shrink, the row may
not. The scroll handler also uses two thresholds — on above 24px, off
below 8px — so a single stray pixel cannot flip it.

Three safety rules are built into the code:

1. **With JavaScript off** nothing is ever hidden — the hiding CSS lives only
   under `html.js-reveal`, and JavaScript adds that class
2. **With motion turned off system-wide** (`prefers-reduced-motion`) every
   animation stops and all content shows immediately
3. **When printing**, everything is forced visible — otherwise sections not
   yet scrolled into view would come out blank on paper

To switch animation off entirely, delete the `initReveal()` call. The site
carries on working perfectly well without it.

---

## Clean URLs

The site runs on URLs like `sudhum.edu.pk/admissions`. That requires
`.htaccess` to be uploaded to the site root (Apache / LiteSpeed / cPanel —
which is what most Pakistani hosting runs).

If the host cannot rewrite (a deep link returns 404), set this in
`index.html`:

```js
cleanUrls : false
```

The site then runs on `#/admissions` exactly as before — only the SEO is
slightly weaker.

Opening `index.html` directly over `file://` switches to hash routing
automatically.

An address that does not exist — a typo, an old link — shows the home page
and reports the **home page's** canonical address, not its own. Otherwise
search engines would be invited to index an unlimited number of made-up
URLs all showing the same thing.

---

## Hosting on Vercel

`.htaccess` is Apache-only; **Vercel ignores it completely**. `vercel.json`
does the same three jobs: send every unknown address to `index.html`, cache
`assets/` for a year, and set the two security headers. Compression is
automatic (Brotli — 130 KB of HTML goes over the wire as 35 KB).

```bash
npx vercel deploy --prod
```

`.vercelignore` keeps `server/`, `.htaccess` and this README out of the
upload — they are for the office, not for visitors.

**Do not add `"cleanUrls": true` to `vercel.json`.** It makes Vercel
redirect `/index.html` to `/`, which leaves the rewrite pointing at an
address that no longer resolves — and then every deep link returns 404
while the home page still works. `vercel dev` does **not** reproduce this;
only a real deployment does. It was found by requesting `/admissions` on
the deployed site, not locally.

Two URLs come out of a deploy and they behave differently:

| URL | |
|---|---|
| `sudhum-edu-pk.vercel.app` | the project's own address — **public** |
| `sudhum-edu-<hash>-...vercel.app` | that one build — behind a Vercel login |

So share the short one. The long one asking you to sign in is Deployment
Protection, not a fault.

Nothing here changes `sudhum.edu.pk`. Note that the canonical address in
every page still points at `sudhum.edu.pk`, which is correct while Vercel
is only a preview — it stops the copy competing with the real site in
search results. If Vercel ever becomes the real host, change `SITE` in
`index.html`, plus `robots.txt` and `sitemap.xml`.

---

## Local testing

```bash
python -m http.server 8777      # then http://localhost:8777
```

Double-clicking `index.html` also works (hash routing).

---

## Still outstanding

These are built into the site with their structure in place, but the data
has to come from the office:

- [ ] Three more gallery photographs: `assembly.jpg`, `laboratory.jpg`, `prize-day.jpg`
- [ ] (optional) A hero video — ten seconds of assembly filmed sideways on a phone beats any effect applied to a still
- [ ] Class-wise fee amounts (`FEES`)
- [ ] The real entry test date (`CONFIG.test.date`)
- [ ] Board results and position holders (`RESULTS`)
- [ ] Book lists (`BOOKS`)
- [ ] Uniform details (`UNIFORM`)
- [ ] A WhatsApp-capable office mobile number (`CONFIG.officeWhatsApp` — currently a placeholder)
- [ ] Following `server/SETUP.md` to set `formEndpoint`
