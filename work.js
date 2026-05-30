/* ============================================================
   Single source of truth for projects, papers, and featured work.

   To add a project or paper: add one object to the WORK array below.
   To "star" something (show it on the homepage Featured Work list):
     give it a `featured` number. The number is its order in that list.
   Remove the `featured` key to unstar it.

   Where each field shows up:
     - projects.html cards      -> every item with type: 'Project'
     - featured.html detail page -> every item (in array order)
     - homepage Featured list    -> every item with a `featured` number
   ============================================================ */
const WORK = [
  {
    id: 'agents',
    type: 'Project',
    featured: 1,
    title: 'Autonomous Planning & Knowledge Agents',
    kicker: 'Personal Project · 2026',
    meta: 'Claude Code · Obsidian · LLM Agents',
    tags: ['Claude Code', 'Obsidian', 'LLM Agents', 'Automation', 'Knowledge Management'],
    card: `A pair of LLM agents built on Claude Code with an Obsidian vault as the knowledge store. A daily-planning agent runs on its own every morning and evening: it reviews what I finished, writes structured notes on the day, then regenerates and time-blocks the next day's calendar from a parsed task file and a traffic-light priority scheme. A companion school-workflow agent auto-formats lecture and problem-set notes and cross-links them into a connected knowledge base.`,
    desc: `A pair of LLM agents that automate my daily planning and coursework, built on Claude Code with an Obsidian vault as the knowledge store. The planning agent runs on its own at the start and end of each day: every evening it reviews what I completed, writes structured notes on the day, then regenerates and time-blocks the next day's calendar from a parsed task file and a traffic-light priority scheme. A companion school-workflow agent auto-formats lecture and problem-set notes and links related material into a connected knowledge base of theorem references and cross-links.`,
    findingsLabel: 'Key Details',
    findings: [
      `Daily-planning agent regenerates and time-blocks the next day's calendar from a parsed task file and a traffic-light priority scheme`,
      `Evening review loop writes structured daily notes, closing the feedback loop between plan and outcome`,
      `School-workflow agent auto-formats lecture and problem-set notes and cross-links them into a connected knowledge base of theorem references`,
      `Surfaces relevant prior material to accelerate homework, projects, and exam preparation`
    ],
    cardLinks: [{ label: 'Details', href: 'featured.html#agents' }]
  },
  {
    id: 'plantinarium',
    type: 'Project',
    featured: 2,
    title: 'Plantinarium',
    kicker: 'Project · 2025',
    meta: 'Python · AI · Web App',
    tags: ['Python', 'AI', 'Image Recognition', 'Social Features'],
    card: `Plantinarium makes identifying plants easy and fun. Just upload a photo, and the system will identify the species for you. It's more than just identification. You can share your discoveries and add notes or fun facts about the plants you encounter.`,
    desc: `Plantinarium is a plant identification app built around the idea that discovery should be shareable. Upload a photo and the system identifies the species; from there you can log your find, annotate it with notes or fun facts, and share it with others. The project pairs a computer vision identification backend with a lightweight social layer, turning a utilitarian lookup tool into something closer to a naturalist's field journal.`,
    findingsLabel: 'Key Technical Details',
    findings: [
      `Photo upload pipeline feeds into an AI vision model for species identification with confidence scoring`,
      `User-generated annotations let individuals attach context (common names, habitat notes, personal observations) to each identification`,
      `Social discovery layer allows finds to be shared, building a community record of sightings across locations`
    ],
    cardLinks: [{ label: 'GitHub', href: 'https://github.com/Avi-Gobrin/plantinarium', external: true }],
    detailLinks: [{ label: 'GitHub', href: 'https://github.com/Avi-Gobrin/plantinarium', external: true }]
  },
  {
    id: 'oulad',
    type: 'Paper',
    featured: 3,
    title: 'Engagement, Performance, and Student Outcomes at the Open University',
    short: 'Engagement & Student Outcomes at the Open University',
    kicker: 'Academic Paper · April 2026',
    meta: 'STA437: Multivariate Statistics · Winter 2026',
    tags: ['PCA', 'Factor Analysis', 'GMM', 'LDA', 'MVN Testing', 'Logistic Regression'],
    desc: `The Open University Learning Analytics Dataset records six behavioral features across 25,820 student-course registrations, each carrying one of four outcome labels: Distinction, Fail, Pass, or Withdrawn. This paper runs a full multivariate analysis pipeline (EDA, Mahalanobis-distance MVN testing, PCA, varimax factor analysis, Gaussian mixture modeling, and LDA), asking whether unsupervised structure in assessment behavior can recover the known outcome taxonomy, and whether early-observable features (submission count and timing) are sufficient for withdrawal prediction before any grade is issued. The chain of methods is motivated: each result raises the next question.`,
    findingsLabel: 'Key Findings',
    findings: [
      `Three latent factors identified via parallel analysis and varimax rotation: <em>Engagement</em> (submission count &amp; timing, h²&nbsp;=&nbsp;0.84), <em>Consistent Performance</em> (mean score &amp; score SD, h²&nbsp;=&nbsp;0.72), and <em>Prior Commitment</em> (credits &amp; prior attempts)`,
      `GMM at K&nbsp;=&nbsp;4 achieves an adjusted Rand index of 0.137: assessment behavior partially but not fully recovers the four-way outcome taxonomy; Distinction and Pass students share the high-engagement cluster`,
      `LDA reaches 64.5% five-fold CV accuracy versus a 53.0% naive baseline, with strong withdrawal recall (63.2%) but near-zero Distinction recall (3.2%); logistic regression closes the gap on Distinction (39.3%) by relaxing the shared-covariance assumption`,
      `FA, GMM, and LDA converge on the same two dimensions; Prior Commitment describes academic history but carries near-zero weight in LDA and does not drive cluster separation`
    ],
    detailLinks: [{ label: 'Read Paper', href: 'assets/oulad-sta437.pdf', external: true }]
  },
  {
    id: 'f1',
    type: 'Project',
    title: 'F1 Race Winner Predictor',
    kicker: 'Personal Project · 2024',
    meta: 'Python · Machine Learning · Feature Engineering',
    tags: ['Python', 'scikit-learn', 'Feature Engineering', 'Supervised Learning'],
    card: `A supervised machine-learning pipeline that predicts Formula 1 race winners from driver and constructor rolling form, qualifying results, track characteristics, and weather. Features such as driver-track history and pit-stop reliability are engineered from historical race and weather data, and the model is evaluated on held-out races.`,
    desc: `A supervised machine-learning pipeline that predicts Formula 1 race winners from driver and constructor rolling form, qualifying results, track characteristics, and weather. The model is trained on engineered features such as driver-track history and pit-stop reliability, drawn from historical race and weather data, and evaluated on held-out races.`,
    findingsLabel: 'Key Details',
    findings: [
      `Engineered predictive features including driver-track history and pit-stop reliability from historical race and weather data`,
      `Reached 40% race-winner accuracy and 60% podium-finish accuracy on held-out races`,
      `Captures form, qualifying, track, and weather signals in a single supervised pipeline`
    ],
    cardLinks: [{ label: 'Details', href: 'featured.html#f1' }]
  }
];

/* ---------- rendering ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function tagsHtml(tags) {
  return (tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
}
function linkHtml(l, cls) {
  const target = l.external ? ' target="_blank" rel="noopener"' : '';
  const klass = cls ? ` class="${cls}"` : '';
  return `<a href="${l.href}"${target}${klass}>${esc(l.label)} &rarr;</a>`;
}

function renderFeaturedHome(el) {
  const items = WORK.filter(w => w.featured).sort((a, b) => a.featured - b.featured);
  el.innerHTML = items.map(w => `
    <a href="featured.html#${w.id}" class="feat-item">
      <span class="feat-type">${esc(w.type)}</span>
      <span class="feat-title">${esc(w.short || w.title)}</span>
    </a>`).join('');
}

function renderProjects(el) {
  const items = WORK.filter(w => w.type === 'Project');
  el.innerHTML = items.map(w => {
    const href = (w.cardLinks && w.cardLinks[0]) ? w.cardLinks[0].href : '#';
    return `
    <div class="proj">
      <h3><a href="${href}">${esc(w.title)}</a></h3>
      <p class="proj-desc">${esc(w.card || '')}</p>
      <div class="tags">${tagsHtml(w.tags)}</div>
      <div class="proj-links">${(w.cardLinks || []).map(l => linkHtml(l)).join('')}</div>
    </div>`;
  }).join('');
}

function renderFeaturedDetail(el) {
  el.innerHTML = WORK.map(w => {
    const links = (w.detailLinks || []).map(l => linkHtml(l, 'btn-ghost')).join('');
    const findings = w.findings ? `
      <div class="feat-findings">
        <p class="feat-findings-label">${esc(w.findingsLabel || '')}</p>
        <ul>${w.findings.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>` : '';
    return `
    <div class="feat-work" id="${w.id}">
      <div class="feat-work-top">
        <div>
          <p class="feat-work-kicker">${esc(w.kicker)}</p>
          <h2 class="feat-work-title">${esc(w.title)}</h2>
          <p class="feat-work-meta">${esc(w.meta)}</p>
        </div>
        ${links}
      </div>
      <div class="tags">${tagsHtml(w.tags)}</div>
      <p class="feat-work-desc">${esc(w.desc || '')}</p>
      ${findings}
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  const home = document.getElementById('js-featured-home');
  if (home) renderFeaturedHome(home);

  const projects = document.getElementById('js-projects');
  if (projects) renderProjects(projects);

  const featured = document.getElementById('js-featured');
  if (featured) {
    renderFeaturedDetail(featured);
    // anchors are created here, so honor a deep link like featured.html#agents
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }
});
