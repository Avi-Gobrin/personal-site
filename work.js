/* ============================================================
   Single source of truth for projects, papers, and featured work.

   To add a project or paper: add one object to the WORK array.
   To show it on the homepage Featured Work list: set featured: true.
   Array order is the display order everywhere.

   Where each field shows up:
     - projects.html cards      -> every item with type: 'Project'
     - research.html list       -> every item with type: 'Paper'
     - featured.html detail     -> every item (in array order)
     - homepage Featured list   -> every item with featured: true
   ============================================================ */
const WORK = [
  {
    id: 'agents',
    type: 'Project',
    featured: true,
    title: 'Autonomous Planning & Knowledge Agents',
    kicker: 'Personal Project · 2026',
    meta: 'Claude Code · Obsidian · LLM Agents',
    tags: ['Claude Code', 'Obsidian', 'LLM Agents', 'Automation', 'Knowledge Management'],
    card: `A pair of LLM agents built on Claude Code with an Obsidian vault as the knowledge store. Each evening a daily-planning agent reviews what I finished, writes structured notes on the day, then regenerates and time-blocks the next day's calendar from a parsed task file and a traffic-light priority scheme; each morning it surfaces that day's plan. A companion school-workflow agent auto-formats lecture and problem-set notes and cross-links them into a connected knowledge base.`,
    desc: `A pair of LLM agents that automate my daily planning and coursework, built on Claude Code with an Obsidian vault as the knowledge store. The planning agent runs on its own at the start and end of each day: every evening it reviews what I completed, writes structured notes on the day, then regenerates and time-blocks the next day's calendar from a parsed task file and a traffic-light priority scheme, and each morning it surfaces that day's plan. A companion school-workflow agent auto-formats lecture and problem-set notes and links related material into a connected knowledge base of theorem references and cross-links.`,
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
    id: 'gpt',
    type: 'Project',
    featured: true,
    title: 'Tiny GPT From Scratch',
    kicker: 'Personal Project · In Progress · 2026',
    meta: 'Python · NumPy · Transformers',
    tags: ['NumPy', 'Transformers', 'Self-Attention', 'Backpropagation', 'From Scratch'],
    card: `A character-level GPT built end-to-end in pure NumPy, with no deep-learning frameworks. The project grows one codebase from a bigram baseline into a full Transformer: tokenization, multi-head self-attention, LayerNorm, the Adam optimizer, and sampling, with every forward and backward pass derived and implemented by hand.`,
    desc: `A character-level GPT built end-to-end in pure NumPy, with no deep-learning frameworks doing the heavy lifting. The project grows one codebase step by step from a bigram baseline into a working Transformer language model: character tokenization, stable softmax, multi-head causal self-attention, LayerNorm, residual connections, the Adam optimizer, and temperature and top-k sampling. Every gradient is derived on paper first and then implemented by hand, so the whole training loop stays transparent rather than delegated to autograd.`,
    findingsLabel: 'Key Details',
    findings: [
      `Builds the full stack by hand: tokenization, stable softmax, multi-head causal self-attention, LayerNorm, residuals, Adam, and sampling`,
      `Every forward and backward pass is derived on paper before being coded, with no PyTorch or TensorFlow autograd`,
      `Structured as an incremental sequence of steps, each growing the same codebase from a bigram baseline toward a full Transformer`
    ],
    cardLinks: [{ label: 'Details', href: 'featured.html#gpt' }],
    detailLinks: [{ label: 'GitHub', href: 'https://github.com/Avi-Gobrin/tiny-gpt-from-scratch', external: true }]
  },
  {
    id: 'mnist',
    type: 'Project',
    featured: false,
    title: 'Neural Network from Scratch (MNIST)',
    kicker: 'Personal Project · 2026',
    meta: 'Python · NumPy · Backpropagation',
    tags: ['NumPy', 'Neural Networks', 'Backpropagation', 'MNIST', 'From Scratch'],
    card: `A two-layer feedforward neural network for MNIST digit classification, written in pure NumPy. Every gradient and backpropagation update is derived and coded by hand, with no PyTorch or TensorFlow, to make the mechanics of training a network fully explicit.`,
    desc: `A two-layer feedforward neural network that classifies MNIST handwritten digits, implemented in pure NumPy. The forward pass, loss, and every gradient in the backward pass are derived by hand and coded directly, with no autograd framework involved. The goal was to understand backpropagation from first principles by building it rather than calling it.`,
    findingsLabel: 'Key Details',
    findings: [
      `Two-layer feedforward architecture trained on MNIST digit classification`,
      `All gradient and backpropagation updates derived and implemented by hand in pure NumPy`,
      `No PyTorch or TensorFlow: the full training loop is written from scratch`
    ],
    cardLinks: [{ label: 'Details', href: 'featured.html#mnist' }]
  },
  {
    id: 'plantinarium',
    type: 'Project',
    featured: false,
    title: 'Plantinarium',
    kicker: '6-Person Team · 2024',
    meta: 'Java · Maven · 6-Person Team',
    tags: ['Java', 'Maven', 'Image Recognition', 'Social Features', 'Team Project'],
    card: `A plant-identification desktop app built by a six-person team in Java and Maven. Upload a photo and the system identifies the species, then share your find with notes or fun facts through public and private galleries. I owned the account-management flow, including secure account deletion with a full wipe of the user's data.`,
    desc: `Plantinarium is a plant identification desktop app built by a six-person team in Java and Maven, around the idea that discovery should be shareable. Upload a photo and the system identifies the species; from there you can log your find, annotate it with notes or fun facts, and share it with others through public and private galleries. The project pairs a computer vision identification backend with a lightweight social layer, turning a utilitarian lookup tool into something closer to a naturalist's field journal. I owned the account-management flow, including secure account deletion with a full wipe of the user's data.`,
    findingsLabel: 'Key Technical Details',
    findings: [
      `Photo upload pipeline feeds into an AI vision model for species identification`,
      `Public and private galleries, likes, and user-generated notes let individuals attach context to each identification and share finds`,
      `Owned the account-management flow, including secure account deletion with a full wipe of the user's data`
    ],
    cardLinks: [{ label: 'GitHub', href: 'https://github.com/barnaste/plantinarium', external: true }],
    detailLinks: [{ label: 'GitHub', href: 'https://github.com/barnaste/plantinarium', external: true }]
  },
  {
    id: 'oulad',
    type: 'Paper',
    featured: true,
    date: 'Apr 2026',
    title: 'Engagement, Performance, and Student Outcomes at the Open University',
    kicker: 'Academic Paper · April 2026',
    meta: 'STA437: Methods for Multivariate Data · Winter 2026',
    tags: ['PCA', 'Factor Analysis', 'GMM', 'LDA', 'MVN Testing', 'Logistic Regression'],
    desc: `The Open University Learning Analytics Dataset records six behavioral features across 25,820 student-course registrations, each carrying one of four outcome labels: Distinction, Fail, Pass, or Withdrawn. This paper runs a full multivariate analysis pipeline (EDA, Mahalanobis-distance MVN testing, PCA, varimax factor analysis, Gaussian mixture modeling, and LDA), asking whether unsupervised structure in assessment behavior can recover the known outcome taxonomy, and whether early-observable features (submission count and timing) are sufficient for withdrawal prediction before any grade is issued. Each method is motivated by the result before it.`,
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
    featured: false,
    title: 'F1 Race Winner Predictor',
    kicker: 'Personal Project · 2024',
    meta: 'Python · Machine Learning · Feature Engineering',
    tags: ['Python', 'scikit-learn', 'Feature Engineering', 'Supervised Learning'],
    card: `A supervised machine-learning pipeline that predicts Formula 1 race winners from driver and constructor rolling form, qualifying results, track characteristics, and weather. Features such as driver-track history and pit-stop reliability are engineered from historical race and weather data, and the model is evaluated with a walk-forward scheme: each season is predicted using only the seasons before it.`,
    desc: `A supervised machine-learning pipeline that predicts Formula 1 race winners from driver and constructor rolling form, qualifying results, track characteristics, and weather. The model is trained on engineered features such as driver-track history and pit-stop reliability, drawn from historical race and weather data, and evaluated season by season with a walk-forward scheme so it never sees the future.`,
    findingsLabel: 'Key Details',
    findings: [
      `Engineered predictive features including driver-track history and pit-stop reliability from historical race and weather data`,
      `Reached 33 to 46% race-winner accuracy and 53 to 74% podium precision across walk-forward seasons, competitive with the strong pole-sitter baseline`,
      `LASSO keeps the model sparse and interpretable: recent driver form and grid/qualifying position carry nearly all the signal`
    ],
    cardLinks: [{ label: 'Details', href: 'featured.html#f1' }],
    detailLinks: [{ label: 'GitHub', href: 'https://github.com/Avi-Gobrin/F1-Race-predictor', external: true }]
  },
  {
    id: 'apm',
    type: 'Paper',
    date: 'Apr 2026',
    title: 'The Effect of Transaction Costs on Optimal Portfolio Rebalancing Frequency',
    kicker: 'Academic Paper · April 2026',
    meta: 'APM348: Applied Mathematics · Winter 2026',
    tags: ['Portfolio Theory', 'Monte Carlo', 'Optimization', 'Transaction Costs'],
    desc: `A discrete-time, two-asset model comparing periodic and band rebalancing policies under proportional transaction costs via Monte Carlo grid search over 10,000 paths. The band policy achieves a 17.3% improvement in cost-penalized objective over the periodic policy, with a CRRA certainty-equivalent-wealth analysis confirming that the primary value of rebalancing is risk control, not return enhancement.`,
    detailLinks: [{ label: 'Read Paper', href: 'assets/apm-project.pdf', external: true }]
  },
  {
    id: 'big-five',
    type: 'Paper',
    date: 'Mar 2026',
    title: 'Discovering Latent Structure in the IPIP Big Five Personality Inventory',
    kicker: 'Academic Paper · March 2026',
    meta: 'STA437: Methods for Multivariate Data · Winter 2026',
    tags: ['Factor Analysis', 'ICA', 'Parallel Analysis', 'Personality Psychology'],
    desc: `Factor analysis and ICA applied to 19,718 personality questionnaire responses, confirming the canonical Big Five structure and probing whether additional dimensions emerge from parallel analysis.`,
    detailLinks: [{ label: 'Read Paper', href: 'assets/big-five-sta437.pdf', external: true }]
  },
  {
    id: 'wine',
    type: 'Paper',
    date: 'Feb 2026',
    title: 'What Makes a Wine Good? Chemical Structure and Quality in Portuguese Wines',
    kicker: 'Academic Paper · February 2026',
    meta: 'STA437: Methods for Multivariate Data · Winter 2026',
    tags: ['PCA', 'Mahalanobis Distance', 'Correlation Analysis', 'Chemometrics'],
    desc: `PCA, Mahalanobis distance testing, and correlation analysis on 6,497 Portuguese wines to identify the latent chemical dimensions that separate red from white wine and predict sensory quality.`,
    detailLinks: [{ label: 'Read Paper', href: 'assets/wine-quality-sta437.pdf', external: true }]
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
  el.innerHTML = WORK.filter(w => w.featured).map(w => `
    <a href="featured.html#${w.id}" class="feat-item">
      <span class="feat-type">${esc(w.type)}</span>
      <span class="feat-title">${esc(w.title)}</span>
    </a>`).join('');
}

function renderWriting(el) {
  let html = '', currentYear = '';
  WORK.filter(w => w.type === 'Paper').forEach(w => {
    const year = w.date.slice(-4);
    if (year !== currentYear) { html += `<p class="yr">${esc(year)}</p>`; currentYear = year; }
    const star = w.featured ? '<span class="w-star" title="Featured">★</span>' : '';
    const link = w.detailLinks?.[0]?.href || '#';
    html += `<div class="w-item">
      <span class="w-date">${esc(w.date)}</span>
      <div>
        <div class="w-title">${star}<a href="${link}" target="_blank">${esc(w.title)}</a></div>
        <div class="w-desc">${esc(w.desc || '')}</div>
      </div>
    </div>`;
  });
  el.innerHTML = html;
}

function renderProjects(el) {
  el.innerHTML = WORK.filter(w => w.type === 'Project').map(w => {
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

  const writing = document.getElementById('js-writing');
  if (writing) renderWriting(writing);

  const projects = document.getElementById('js-projects');
  if (projects) renderProjects(projects);

  const featured = document.getElementById('js-featured');
  if (featured) {
    renderFeaturedDetail(featured);
    if (location.hash) {
      const scrollToHash = function () {
        const target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      };
      scrollToHash();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scrollToHash);
      }
    }
  }
});
