/* ============================================================
   Every project and report on the site, in display order.

   This file is data only. `node tools/build.mjs` turns it into:
     - the list on projects/index.html          (type: 'Project')
     - the course reports on research/index.html (type: 'Report')
     - one page per item: projects/<id>/ or research/<id>/

   Fields:
     short                a shorter page title, if the full one is long
     when, kind, course   notes in the margin (course is optional)
     hook                 one line for the list pages (HTML allowed: bold the numbers)
     card                 a short paragraph, used for the meta description
     desc                 the full paragraph for the item's own page
     findings             points for the item's own page (HTML allowed)
     tools                shown as "Built with" (projects) or
                          "Methods" (reports)
     links                code, PDFs, and other artifacts

   Every number here must also appear on a resume.
   ============================================================ */
const WORK = [
  {
    id: 'tiny-gpt',
    type: 'Project',
    title: 'Tiny GPT From Scratch',
    when: '2026',
    kind: 'Personal project',
    hook: `A GPT in pure NumPy with <strong>every gradient written by hand</strong>, checked by <strong>56 tests</strong>.`,
    card: `A character-level GPT in pure NumPy with no autograd: multi-head causal attention, pre-LN Transformer blocks, Adam, and top-k sampling, with a hand-written backward pass for every layer. A 56-test pytest suite checks every parameter's gradient against finite differences and runs in CI on every push.`,
    desc: `A character-level GPT built in pure NumPy, with no PyTorch and no autograd. One codebase grows from a counting bigram model into a full Transformer: tokenizer, numerically stable softmax, multi-head causal self-attention, pre-LN Transformer blocks, Adam, and temperature and top-k sampling. Every backward pass is written by hand. The steps started as exercises on Deep-ML; the repository assembles them into one runnable model and adds a test suite that checks each gradient against finite differences.`,
    findingsLabel: 'Details',
    findings: [
      `Hand-written forward and backward passes for embeddings, multi-head causal attention, LayerNorm, feed-forward blocks, and the language-model head`,
      `56 pytest tests, including a finite-difference gradient check on every model parameter and an end-to-end causality test`,
      `GitHub Actions runs the test suite and a train-and-sample demo on every push`
    ],
    tools: ['Python', 'NumPy', 'pytest', 'GitHub Actions'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/Avi-Gobrin/tiny-gpt-from-scratch' }]
  },
  {
    id: 'agents',
    type: 'Project',
    title: 'Autonomous Planning & Knowledge Agents',
    when: '2026',
    kind: 'Personal project',
    hook: `Two LLM agents run my day and my coursework. Daily planning went from <strong>about 30 minutes to under 2</strong>.`,
    card: `Two LLM agents built on Claude Code, with an Obsidian vault as the knowledge store. The planning agent runs at the start and end of each day, reviews what got done, and regenerates a time-blocked calendar for tomorrow; it cut daily planning from about 30 minutes to under 2. A companion agent turns lecture and problem-set notes into a cross-linked knowledge base of theorem references.`,
    desc: `Two LLM agents that run my day and my coursework, built on Claude Code with an Obsidian vault as the knowledge store. The planning agent runs on its own at the start and end of each day: it reviews what I completed, writes structured notes on the day, and regenerates a time-blocked calendar for the next day from a parsed task file and a traffic-light priority scheme. A companion school-workflow agent auto-formats lecture and problem-set notes into a cross-linked knowledge base of theorem references, so relevant earlier material surfaces when I need it for homework or exams.`,
    findingsLabel: 'Details',
    findings: [
      `Cut daily planning from about 30 minutes to under 2`,
      `Evening review writes structured notes on the day; the next day's calendar is regenerated from a parsed task file and a traffic-light priority scheme`,
      `School-workflow agent auto-formats lecture and problem-set notes into a cross-linked knowledge base of theorem references, surfacing relevant prior material for homework and exam preparation`
    ],
    tools: ['Claude Code', 'Obsidian', 'LLM agents'],
    links: []
  },
  {
    id: 'plantinarium',
    type: 'Project',
    title: 'Plantinarium',
    when: '2024',
    kind: 'Six-person team project',
    hook: `A plant-identification app built by a <strong>six-person team</strong>. I owned account management.`,
    card: `A plant-identification desktop app built by a six-person team in Java and Maven. Upload a photo and the system identifies the species, then share your find with notes through public and private galleries. I owned the account-management flow, including secure account deletion with a full wipe of the user's data.`,
    desc: `Plantinarium is a plant-identification desktop app built by a six-person team in Java and Maven. Upload a photo and the system identifies the species; you can then add notes and share your find through public and private galleries. I owned the account-management flow, including secure account deletion with a full wipe of the user's data.`,
    findingsLabel: 'Details',
    findings: [
      `Photo upload to AI species identification`,
      `Public and private galleries, likes, and user notes attach context to each identification`,
      `Owned the account-management flow, including secure account deletion with a full wipe of the user's data`
    ],
    tools: ['Java', 'Maven'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/barnaste/plantinarium' }]
  },
  {
    id: 'oulad',
    type: 'Report',
    title: 'Engagement, Performance, and Student Outcomes at the Open University',
    short: 'Student Outcomes at the Open University',
    when: 'Apr 2026',
    kind: 'Course project',
    course: 'STA437, Methods for Multivariate Data',
    hook: `Over <strong>23,301</strong> student registrations, logistic regression lifts Distinction recall from <strong>3.2% to 39.3%</strong>.`,
    card: `A full multivariate pipeline (PCA, factor analysis, Gaussian mixture clustering, LDA) over 23,301 complete Open University student-course registrations. Two dimensions carry the structure: assessment engagement and performance. Under 5-fold CV, logistic regression beats LDA (67.0% vs. 64.5%, against a 53.0% baseline) and lifts Distinction recall from 3.2% to 39.3%.`,
    desc: `The Open University Learning Analytics Dataset records six behavioral features for 25,820 student-course registrations, 23,301 of them complete, each labeled Distinction, Fail, Pass, or Withdrawn. This report runs a full multivariate pipeline (EDA, Mahalanobis-distance normality testing, PCA, varimax factor analysis, Gaussian mixture modeling, and LDA) to ask whether unsupervised structure in assessment behavior recovers the known outcomes, and whether features observable before any grade is issued (submission count and timing) are enough to flag withdrawal early. Each method is motivated by the result before it.`,
    findingsLabel: 'Findings',
    findings: [
      `Parallel analysis and varimax rotation give three factors: <em>Engagement</em> (submission count and timing; top communality h²&nbsp;=&nbsp;0.84), <em>Consistent Performance</em> (mean score and score SD; top communality h²&nbsp;=&nbsp;0.72), and <em>Prior Commitment</em> (credits and prior attempts)`,
      `FA, GMM, and LDA converge on the same two dimensions; Prior Commitment describes academic history but barely moves LDA or the clusters`,
      `GMM at K&nbsp;=&nbsp;4 reaches an adjusted Rand index of 0.137: assessment behavior partly recovers the four outcomes, and Distinction and Pass students share the high-engagement cluster`,
      `Under 5-fold CV, LDA reaches 64.5% against a 53.0% baseline with 63.2% Withdrawn recall but 3.2% Distinction recall; logistic regression reaches 67.0% and lifts Distinction recall to 39.3% by dropping the shared-covariance assumption`
    ],
    tools: ['PCA', 'factor analysis', 'Gaussian mixture models', 'LDA', 'logistic regression'],
    links: [{ label: 'Read the report (PDF)', href: 'assets/reports/oulad-sta437.pdf' }]
  },
  {
    id: 'apm',
    type: 'Report',
    title: 'The Effect of Transaction Costs on Optimal Rebalancing Frequency',
    short: 'Transaction Costs and Rebalancing',
    when: 'Apr 2026',
    kind: 'Course project, with Gabor Erdely',
    course: 'APM348, Mathematical Modelling',
    hook: `The best band policy beats the best periodic one by <strong>17.3%</strong> on the cost-penalised objective, over <strong>10,000</strong> Monte Carlo paths.`,
    card: `A discrete-time, two-asset model comparing periodic and band rebalancing under proportional transaction costs, tuned by Monte Carlo grid search over 10,000 paths. Written with Gabor Erdely.`,
    desc: `A discrete-time, two-asset model (equity and a risk-free bond) comparing periodic and band rebalancing policies under proportional transaction costs, with optimal parameters found by Monte Carlo grid search over 10,000 paths. A CRRA certainty-equivalent-wealth analysis then asks whether rebalancing is worth it beyond the cost metric. Written with Gabor Erdely.`,
    findingsLabel: 'Findings',
    findings: [
      `The best band policy (b*&nbsp;=&nbsp;0.008) beats the best periodic policy (every k*&nbsp;=&nbsp;8 days) by 17.3% on the cost-penalised objective`,
      `Both policies keep about 99.97% of no-rebalancing terminal wealth`,
      `Their value is risk control: rebalancing cuts the standard deviation of the terminal equity weight from 0.036 to 0.005 or less`
    ],
    tools: ['Monte Carlo simulation', 'grid search', 'CRRA utility'],
    links: [{ label: 'Read the report (PDF)', href: 'assets/reports/apm-project.pdf' }]
  }
];
