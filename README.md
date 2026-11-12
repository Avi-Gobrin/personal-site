# Avi Gobrin, personal site

Personal site for Avi Gobrin, fourth-year Mathematics & Its Applications specialist at the University of Toronto (Statistics major, Computer Science minor). Plain HTML, CSS, and a little vanilla JavaScript. No frameworks and no dependencies.

Live at https://avi-gobrin.github.io/personal-site/

## The design

The homepage is one screen: a pixel-art room with the name on the wall. Everything in the room is a link (selection corners and a label appear on hover, and an arrow wanders between things until you find one):

| In the room | Goes to |
|---|---|
| chalkboard | Experience |
| laptop | Projects |
| books | Research |
| window | About |
| trophy | the StarCraft part of About |
| mug | email |
| lamp | switches the theme |

On a phone held upright, the chalkboard and the window move under the name.

The inner pages are quiet on purpose: the room's two palettes (morning by day, dusk by night), its objects as page icons, and otherwise just a date in the margin, a title, and one paragraph per job or project. Papers are just titled. Contact links are logos. Type is Alegreya for names and titles, Inter for reading, and Silkscreen (a pixel face) for tiny labels.

## Where things are

```
index.html                 the homepage (the room)
about/ experience/         hand-written pages, one index.html each
projects/ research/        hand-written list pages; projects/<id>/ and
                           research/<id>/ are generated from content/work.js
404.html sitemap.xml robots.txt   generated; GitHub Pages wants them at the root
.nojekyll                  tells GitHub Pages to serve the files as they are
blog/                      generated from content/blog/, only while there are posts

content/work.js            every project and report (data only)
content/blog/              blog posts in Markdown (see its README); the blog appears with the first post
assets/css/style.css       all the styles
assets/js/hero.js          the homepage canvas harness
assets/js/room.js          the room itself: palettes, layout, drawing, links
assets/js/theme.js         the light switch
assets/img/                favicon and link-preview card
assets/reports/            paper PDFs
assets/Resumes/            the two public resumes (path kept stable: it is linked from outside)
tools/build.mjs            fills shared parts and writes generated pages
tools/markdown.mjs         the small Markdown converter for posts
tools/icons.mjs            pixel icons and contact logos for the inner pages
tools/site.mjs             the site address, content/work.js, and the page list, shared by the tools
tools/serve.mjs            local preview server
tools/make-redirects.mjs   only needed if the site ever moves
```

## Working on it

Preview locally (folders need a server to open their `index.html`):

```
node tools/serve.mjs
```

then open http://localhost:8000/personal-site/.

After editing `content/work.js`, the nav, the footer, or the icons, rebuild:

```
node tools/build.mjs
```

It needs Node 18 or newer. It fills every `<!-- build:NAME -->` block (head, nav, footer, the project and report lists, and `<!-- build:icon-NAME -->` pixel icons), writes `projects/<id>/` and `research/<id>/` (and `blog/` from `content/blog/`), and regenerates `404.html`, `sitemap.xml`, and `robots.txt`. It is safe to run repeatedly. Commit everything it writes, since GitHub Pages serves the files as they are.

To add a project or report, add one object to `WORK` in `content/work.js` (the comment at the top lists the fields), then rebuild.

To write a blog post, add a Markdown file to `content/blog/` (its README shows the header) and rebuild. The blog page and its nav link appear with the first post and disappear if the folder has none. Always run the build before committing: GitHub Pages serves the committed files as they are.

The room lives in `assets/js/room.js`: `PALETTES` at the top holds the colours, `layout()` and `desk()` place things, and `DOORS` holds the labels and links. The resumes are the source of truth: when a fact changes there (a number, a title, a date), change it in the pages, in `content/work.js`, and in the room's labels.

## Resumes

`assets/Resumes/` holds exactly two public PDFs, built without the phone number:

- `Avi_Gobrin_Resume_2026.pdf`: the SWE resume
- `Avi_Gobrin_Resume_2026_ML.pdf`: the ML resume (the homepage "resume" link)

The LaTeX sources live in the separate resume folder, never here. Build the public copies with the switch at the top of each `.tex` file, which drops the phone number:

```
pdflatex -jobname=Avi_Gobrin_Resume_SWE_public "\def\makepublic{}\input{Avi_Gobrin_Resume_SWE}"
pdflatex -jobname=Avi_Gobrin_Resume_ML_public "\def\makepublic{}\input{Avi_Gobrin_Resume_ML}"
```

Then copy them in with `.	ools\sync-resumes.ps1 -From "<your resume folder>"` (a local file, not in git), which copies only those two files under the names above. `.gitignore` also refuses every other file in `assets/Resumes/`, every `.tex` file, and LaTeX build files, so a private resume cannot be committed by accident. Anything committed here is public, including through git history.

## Moving the site

Every absolute URL (canonical, link previews, structured data, sitemap, robots.txt, 404 page) derives from the `BASE` constant in `tools/site.mjs`, so changing the site's address is a one-line edit plus a rerun.

GitHub Pages does not redirect project-site URLs when a repository is renamed, so a plain rename would break every link already printed on a resume. To move from `avi-gobrin.github.io/personal-site/` to `avi-gobrin.github.io/` without breaking anything:

1. Create a repository named exactly `Avi-Gobrin.github.io` and push this site to it. A repository with that name is served at the domain root.
2. Set `BASE` in `tools/site.mjs` to `https://avi-gobrin.github.io/` and run `node tools/build.mjs`.
3. Generate forwarding pages for the old address with `node tools/make-redirects.mjs https://avi-gobrin.github.io/`.
4. Replace the contents of the old `personal-site` repository with everything in `redirects/`, and leave its GitHub Pages enabled.

Old links then forward to the matching new page indefinitely.
