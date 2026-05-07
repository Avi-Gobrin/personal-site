# Personal Site

Minimal personal portfolio site. Pure HTML + CSS, no frameworks, no JavaScript.

## Setup

1. Replace placeholder content in all `.html` files with your real information
2. Add your `resume.pdf` to `assets/`
3. Update social links in `index.html` (GitHub, LinkedIn, email)
4. If using a custom domain, add it to the `CNAME` file

## Deploy to GitHub Pages

1. Create a repo called `yourusername.github.io`
2. Push all files to the `main` branch
3. Site will be live at `https://yourusername.github.io`

## Custom Domain (optional)

1. Buy a domain (Namecheap, Cloudflare, etc.)
2. Add the domain to the `CNAME` file
3. In your domain registrar, add these DNS records:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`
   - CNAME: `www` -> `yourusername.github.io`
4. In GitHub repo settings, go to Pages and enter your custom domain

## Files to Edit

- `index.html` - Your bio, social links, tagline
- `projects.html` - Your projects (add/remove project cards)
- `writing.html` - Your articles (add/remove entries)
- `fun.html` - Books, beliefs, currently section
- `style.css` - Colors, fonts, spacing (CSS variables at top)
