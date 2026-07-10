# Avi Gobrin - Personal Site

Personal site for Avi Gobrin, fourth-year Applied Mathematics specialist at the University of Toronto (Statistics major, Computer Science minor). Plain HTML, CSS, and a little vanilla JavaScript. No frameworks, no dependencies.

Live at https://avi-gobrin.github.io/personal-site/

## Pages

- `index.html`: home, bio, featured work list
- `experience.html`: work history
- `projects.html`: project cards
- `writing.html`: papers
- `featured.html`: detailed writeups
- `coursework.html`: relevant coursework
- `style.css`: all styles (CSS variables at the top)
- `assets/`: resume PDFs, paper PDFs, and other static files

## How content works

`work.js` is the single source of truth for every project, paper, and featured writeup. To add or edit one, change the `WORK` array there; the same entry drives the project card, the writing list, the featured detail page, and th