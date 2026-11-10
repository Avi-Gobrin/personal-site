# Avi Gobrin, personal site

Personal site for Avi Gobrin, fourth-year Mathematics & Its Applications specialist at the University of Toronto (Statistics major, Computer Science minor). Plain HTML, CSS, and a little vanilla JavaScript. No frameworks and no dependencies.

Live at https://avi-gobrin.github.io/personal-site/

## The design

A working notebook. A rose margin rule runs down every page: the margin, left of the rule, holds context (dates, places, course codes, labels), and the page, right of it, holds the work. The light theme is notebook paper; the dark theme is a chalkboard, switched by the "Chalkboard" and "Notebook" toggle in the corner. Type is Alegreya for text and Alegreya Sans for small interface text. There are no cards, chips, or icons, and one solid button ("Email me").

All colors and layout sizes are CSS variables at the top of `style.css`. Every text color passes WCAG AA in both themes.

## The fireflies

The homepage portrait sits in a small field of fireflies, drawn like a doodle in the margin: ink bodies and highlighter-yellow flashes on paper, chalk glows on the chalkboard. Each firefly is a pulse-coupled oscillator (Mirollo and Strogatz, 1990): when it sees a neighbour flash, its own clock jumps ahead a little. Nobody leads, and from random clocks the swarm usually falls into step within about 15 seconds. The note under the field shows how in sync they are, a tap or click on a firefly knocks it out of step, and Pause stops them (remembered per browser).

Everything lives in `fireflies.js`; the constants at its top (count, period, nudge, sight, speed) set the swarm's character. It draws nothing until it can, stops when the field is off screen or the tab is hidden, shows a still frame under `prefers-reduced-motion`, and leaves only the portrait when JavaScript is off. To remove the fireflies, delete the `fireflies` wrapper and the note in `index.html` (keep the portrait block) and the `fireflies.js` script tag.

## Pages

- `index.html`: the profile. The margin holds who I am, the fireflies, and how to reach me; the page holds experience, research, projects, GitHub activity, skills, and education, under first-person labels ("Where I've worked", "Things I've built").
- `experience.html`, `research.html`, `coursework.html`: hand-written pages built from rows (a margin note and a page cell).
- `projects.html` and the course reports on `research.html`: built from `work.js`.
- `work-<id>.html`: one generated page per project or report.
- `404.html`: generated; served by GitHub Pages for any missing URL.

The resumes are the source of truth. When a fact changes there (a number, a title, a date), change it here too.

## How the build works

Most of the site is hand-written HTML; edit it directly. The parts that come from data sit between markers like `<!-- build:nav -->` and `<!-- /build:nav -->`, and one command fills them:

```
node prerender.mjs
```

It needs Node 18 or newer. It:

1. Refreshes the GitHub activity graph. It reads the public contribution calendar for `Avi-Gobrin` and saves it to `assets/contributions.json`. If GitHub cannot be reached, it keeps the saved copy. Use `node prerender.mjs --offline` to skip the network.
2. Fills the shared head, nav, and footer on every page, plus the homepage portrait, project list, and activity graph, and the project and report lists.
3. Writes the `work-<id>.html` pages, `404.html`, `sitemap.xml`, and `robots.txt`.

It is safe to run repeatedly. Commit everything it writes, since GitHub Pages serves the files as they are. Run it whenever you edit `work.js`, the nav, or the footer, and before you share the site, so the graph is current.

To add a project or report, add one object to the `WORK` array in `work.js` (the comment at the top lists the fields), then run the build. `featured: true` puts it on the homepage.

## The photo

Put a square photo (400 by 400 pixels or larger) at `assets/photo.jpg` and run `node prerender.mjs`. Until then the homepage shows an "AG" monogram in its place. Either way it sits in the firefly field, and the fireflies fly around it.

## Resumes

`assets/Resumes/` holds exactly two public PDFs, built without the phone number:

- `Avi_Gobrin_Resume_2026.pdf`: the SWE resume (the homepage "Resume" link)
- `Avi_Gobrin_Resume_2026_ML.pdf`: the ML resume

The LaTeX sources live in the separate resume folder, never here. Build the public copies with the switch at the top of each `.tex` file, which drops the phone number:

```
pdflatex -jobname=Avi_Gobrin_Resume_SWE_public "\def\makepublic{}\input{Avi_Gobrin_Resume_SWE}"
pdflatex -jobname=Avi_Gobrin_Resume_ML_public "\def\makepublic{}\input{Avi_Gobrin_Resume_ML}"
```

Then copy them in with `.\sync-resumes.ps1 -From "<your resume folder>"`, which copies only those two files under the names above. `.gitignore` also refuses every other file in `assets/Resumes/`, every `.tex` file, and LaTeX build files, so a private resume cannot be committed by accident. Anything committed here is public, including through git history.

## Moving the site

Every absolute URL (canonical, link previews, structured data, sitemap, robots.txt, 404 page) derives from the `BASE` constant at the top of `prerender.mjs`, so changing the site's address is a one-line edit plus a rerun.

GitHub Pages does not redirect project-site URLs when a repository is renamed, so a plain rename would break every link already printed on a resume. To move from `avi-gobrin.github.io/personal-site/` to `avi-gobrin.github.io/` without breaking anything:

1. Create a repository named exactly `Avi-Gobrin.github.io` and push this site to it. A repository with that name is served at the domain root.
2. Set `BASE` in `prerender.mjs` to `https://avi-gobrin.github.io/` and run `node prerender.mjs`.
3. Generate forwarding pages for the old address with `node make-redirects.mjs https://avi-gobrin.github.io/`.
4. Replace the contents of the old `personal-site` repository with everything in `redirects/`, and leave its GitHub Pages enabled.

Old links then forward to the matching new page indefinitely.
