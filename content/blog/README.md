# Blog posts

Each Markdown file in this folder is one post. The build turns them into
`blog/<name>/`, lists them newest first on `blog/`, and adds "Blog" to the
nav and the sitemap. With no posts here there is no blog at all: the build
deletes `blog/` and leaves the nav as it was.

## Adding a post

1. Make a file here named in lowercase letters, digits, and hyphens, for
   example `2026-12-01-first-post.md`. A date at the front is optional and
   is left out of the address, so that file becomes `blog/first-post/`.
2. Start it with this header, then write the post under it:

   ```yaml
   ---
   title: My first post
   date: 2026-12-01
   description: One sentence for the blog list and link previews (optional).
   ---
   ```

3. From the site folder, run `node tools/build.mjs`, preview with
   `node tools/serve.mjs`, then commit everything the build wrote,
   including the new `blog/` folder. GitHub Pages serves the committed
   files as they are; it does not run the build.

Add `draft: true` to the header to leave a post out. The repository is
public, so a committed draft can still be read on GitHub.

To remove a post, delete its file and rebuild.

## What works

Paragraphs; headings with `##` to `####` (the title is the page heading);
**bold**, *italics*, and `code`; [links](https://example.com) and
![images](assets/img/blog/example.png); lists with `-` or `1.` (one level);
`>` quotes; `---` for a rule; and code between lines of three backticks.
Links and images that do not start with http, /, or # are relative to the
site root, so keep images in `assets/img/blog/`. A block that starts with an
HTML tag is copied through as written. The build warns about em and en dashes.
