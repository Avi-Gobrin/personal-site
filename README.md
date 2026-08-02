# Avi Gobrin - Personal Site

Personal site for Avi Gobrin, fourth-year Applied Mathematics specialist at the University of Toronto (Statistics major, Computer Science minor). Plain HTML, CSS, and a little vanilla JavaScript. No frameworks, no dependencies.

Live at https://avi-gobrin.github.io/personal-site/

## Pages

- `index.html`: home, bio, featured work list
- `experience.html`: work history
- `projects.html`: project cards
- `research.html`: paper cards
- `coursework.html`: relevant coursework, grouped by subject
- `work-<id>.html`: one generated page per project or paper
- `style.css`: all styles (CSS variables at the top)
- `assets/`: resume PDFs, paper PDFs, and other static files

Every inner page is built from the same card component, so they all read as the same thing.

## How content works

`work.js` is the single source of truth for every project and paper. To add or edit one, change the `WORK` array there; the same entry drives the project card, the research card, that item's own page, and the homepage featured list. Array order is display order, and `featured: true` both stars the item and puts it on the homepage.

Pages ship with that content prerendered into the HTML (so search engines, link previews, and no-JS visitors see everything), and `work.js` re-renders the card lists on load. After editing `work.js`, regenerate the static copies:

```
node prerender.mjs
```

The script is idempotent. It also bakes in the nav (kept in sync with `nav.js`), writes one `work-<id>.html` per item, and regenerates `sitemap.xml`. Generated `work-*.html` files are committed, since GitHub Pages serves them as-is.

## Moving the site

Every absolute URL (canonical, OG, sitemap) is derived from the `BASE` constant
at the top of `prerender.mjs`, so changing the site's address is a one-line edit
plus a rerun.

The catch: **GitHub Pages does not redirect project-site URLs when you rename a
repository.** Per GitHub's docs, "all existing information, with the exception of
project site URLs, is automatically redirected to the new name." A plain rename
would 404 every link already printed on a resume.

To move from `avi-gobrin.github.io/personal-site/` to `avi-gobrin.github.io/`
without breaking anything, and for free:

1. Create a new repo named exactly `Avi-Gobrin.github.io` and push this site to
   it. A repo with that name is served at the domain root.
2. Set `BASE` in `prerender.mjs` to `https://avi-gobrin.github.io/`, then run
   `node prerender.mjs`.
3. Generate the forwarding stubs for the old address:

   ```
   node make-redirects.mjs https://avi-gobrin.github.io/
   ```

4. Replace the contents of the old `personal-site` repo with everything in
   `redirects/`, and leave its GitHub Pages enabled.

Old links then forward to the matching new page indefinitely, so the resume can
be updated whenever it is convenient rather than urgently. The stubs cover every
known page plus a `404.html` catch-all that maps any other old path onto the new
site. A paid custom domain later would point at the new repo and needs no change
to the redirect repo.

## Resumes

`assets/Resumes/` holds the four tailored resume variants (SWE, DS, ML, quant) plus the research CV. They are maintained in a separate resume project and copied in by a local, untracked helper script (`sync-resumes.ps1`), which points at that project's folder on the authoring machine.
