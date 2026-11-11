/* ============================================================
   Every project and report on the site, in display order.

   This file is data only. `node tools/build.mjs` turns it into:
     - the list on projects/index.html          (type: 'Project')
     - the papers on research/index.html        (type: 'Report')
     - one page per item: projects/<id>/ or research/<id>/

   Fields:
     short                a shorter page title, if the full one is long
     when, kind, course   notes in the margin (course is optional)
     card                 one paragraph: the list pages show it for projects,
                          and every page uses it as the meta description
     desc                 the full paragraph for the item's own page
     findings             points for the item's own page (HTML allowed)
     tools                shown as "Built with" (projects) or
                          "Methods" (reports)
     links                code, PDFs, and other artifacts

   Every number here must also appear on a resume or in the paper itself.
   ============================================================ */
const WORK = [
  {
    id: 'tiny-gpt',
    type: 'Project',
    title: 'Tiny GPT From Scratch',
    when: '2026',
    kind: 'Personal project',
    card: `A character-level GPT in pure NumPy, with no PyTorch and no autograd: multi-head causal attention, pre-LN Transformer blocks, Adam, and top-k sampling, each with a backward pass written by hand. A 56-test suite checks every parameter's gradient against finite differences, and CI runs it on every push.`,
    desc: `A character-level GPT built in pure NumPy, with no PyTorch and no autograd. One codebase grows from a counting bigram model into a full Transformer: tokenizer, numerically stable softmax, multi-head causal self-attention, pre-LN Transformer blocks, Adam, and temperature and top-k sampling. Every backward pass is written by hand. The steps started as exercises on Deep-ML; the repository assembles them into one runnable model and adds a test suite that checks each gradient against finite differences.`,
    findingsLabel: 'Details',
    findings: [
      `Hand-written forward and backward passes for embeddings, multi-head causal attention, LayerNorm, feed-forward blocks, and the language-model head`,
      `56 pytest tests, including a finite-difference gradient check on every model parameter and an end-to-end causality test`,
      `GitHub Actions runs the test suite and a train-and-sample demo on every push`
    ],
    tools: ['Python', 'NumPy', 'pytest', 'GitHub Actions'],
    links: [{ label: 'Code', href: 'https://github.com/Avi-Gobrin/tiny-gpt-from-scratch' }]
  },
  {
    id: 'agents',
    type: 'Project',
    title: 'Autonomous Planning & Knowledge Agents',
    when: '2026',
    kind: 'Personal project',
    card: `Two LLM agents that run my day and my coursework, and cut daily planning from about 30 minutes to under 2. Built on Claude Code with an Obsidian vault as the knowledge store: one reviews each day and regenerates tomorrow's time-blocked calendar, the other turns lecture and problem-set notes into a cross-linked base of theorem references.`,
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
    id: 'f1',
    type: 'Project',
    title: 'F1 Race Winner Predictor',
    when: '2026',
    kind: 'Personal project',
    card: `Predicts Formula 1 race winners from recent form, qualifying, track history, reliability, and weather, using LASSO-penalized logistic regression on official timing data. Tested walk-forward, each season predicted only from the ones before it, it reaches 40 to 46% winner accuracy: competitive with, though not clearly ahead of, the strong rule that the pole-sitter wins.`,
    desc: `A supervised pipeline that frames each race as a classification problem: who wins? It pulls results, qualifying, and weather from the official F1 timing feed via FastF1, engineers causal features (rolling driver and constructor form, grid and qualifying position, driver-track history, a reliability proxy, and weather), and fits a LASSO-penalized logistic regression, with linear regression and factor analysis alongside for interpretation. Evaluation is walk-forward: train on 2023 and predict 2024, then grow the window, so the model never sees the future.`,
    findingsLabel: 'Details',
    findings: [
      `40 to 46% race-winner accuracy and 53 to 74% podium precision across the 2024, 2025, and partial 2026 seasons`,
      `The pole-sitter baseline wins half to four-fifths of these races, so the model is competitive with it rather than dominant, as expected for modern F1`,
      `LASSO keeps a sparse model: recent driver form and grid or qualifying position carry nearly all the signal`,
      `Factor analysis recovers four interpretable factors (form, temperature, wind, reliability); the first four principal components explain about 74% of the variance`
    ],
    tools: ['Python', 'FastF1', 'scikit-learn', 'LASSO', 'factor analysis'],
    links: [{ label: 'Code', href: 'https://github.com/Avi-Gobrin/F1-Race-predictor' }]
  },
  {
    id: 'plantinarium',
    type: 'Project',
    title: 'Plantinarium',
    when: '2024',
    kind: 'Six-person team project',
    card: `A plant-identification desktop app: upload a photo, get the species, and share the find with notes in public or private galleries. Built in Java and Maven by a six-person team; I owned account management, including secure deletion that wipes all of a user's data.`,
    desc: `Plantinarium is a plant-identification desktop app built by a six-person team in Java and Maven. Upload a photo and the system identifies the species; you can then add notes and share your find through public and private galleries. I owned the account-management flow, including secure account deletion with a full wipe of the user's data.`,
    findingsLabel: 'Details',
    findings: [
      `Photo upload to AI species identification`,
      `Public and private galleries, likes, and user notes attach context to each identification`,
      `Owned the account-management flow, including secure account deletion with a full wipe of the user's data`
    ],
    tools: ['Java', 'Maven'],
    links: [{ label: 'Code', href: 'https://github.com/barnaste/plantinarium' }]
  },
  {
    id: 'oulad',
    type: 'Report',
    title: 'Engagement, Performance, and Student Outcomes at the Open University',
    short: 'Student Outcomes at the Open University',
    when: 'Apr 2026',
    kind: 'Course project',
    course: 'STA437, Methods for Multivariate Data',
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
    links: [{ label: 'PDF', href: 'assets/reports/oulad-sta437.pdf' }]
  },
  {
    id: 'apm',
    type: 'Report',
    title: 'The Effect of Transaction Costs on Optimal Rebalancing Frequency',
    short: 'Transaction Costs and Rebalancing',
    when: 'Apr 2026',
    kind: 'Course project, with Gabor Erdely',
    course: 'APM348, Mathematical Modelling',
    card: `A discrete-time, two-asset model comparing periodic and band rebalancing under proportional transaction costs, tuned by Monte Carlo grid search over 10,000 paths. Written with Gabor Erdely.`,
    desc: `A discrete-time, two-asset model (equity and a risk-free bond) comparing periodic and band rebalancing policies under proportional transaction costs, with optimal parameters found by Monte Carlo grid search over 10,000 paths. A CRRA certainty-equivalent-wealth analysis then asks whether rebalancing is worth it beyond the cost metric. Written with Gabor Erdely.`,
    findingsLabel: 'Findings',
    findings: [
      `The best band policy (b*&nbsp;=&nbsp;0.008) beats the best periodic policy (every k*&nbsp;=&nbsp;8 days) by 17.3% on the cost-penalised objective`,
      `Both policies keep about 99.97% of no-rebalancing terminal wealth`,
      `Their value is risk control: rebalancing cuts the standard deviation of the terminal equity weight from 0.036 to 0.005 or less`
    ],
    tools: ['Monte Carlo simulation', 'grid search', 'CRRA utility'],
    links: [{ label: 'PDF', href: 'assets/reports/apm-project.pdf' }]
  },
  {
    id: 'big-five',
    type: 'Report',
    title: 'Discovering Latent Structure in the IPIP Big Five Personality Inventory',
    short: 'Latent Structure in the Big Five',
    when: 'Mar 2026',
    kind: 'Course project',
    course: 'STA437, Methods for Multivariate Data',
    card: `PCA, factor analysis, and independent component analysis on the IPIP Big Five personality inventory, 50 items with ten per trait, asking whether the five traits emerge from the responses on their own.`,
    desc: `The IPIP Big Five inventory asks 50 questions, ten per trait, each on a five-point scale. This report checks the data's assumptions (correlation structure, sampling adequacy, and multivariate normality via Mahalanobis distances), then uses PCA as a baseline, factor analysis to model the latent traits directly, and independent component analysis to look past the shared covariance at non-Gaussian structure in the sources.`,
    tools: ['PCA', 'factor analysis', 'independent component analysis'],
    links: [{ label: 'PDF', href: 'assets/reports/big-five-sta437.pdf' }]
  },
  {
    id: 'wine',
    type: 'Report',
    title: 'What Makes a Wine Good? Chemical Structure, Wine Type, and Quality in Portuguese Wines',
    short: 'What Makes a Wine Good?',
    when: 'Feb 2026',
    kind: 'Course project',
    course: 'STA437, Methods for Multivariate Data',
    card: `PCA, Mahalanobis-distance testing, and correlation analysis on 6,497 Portuguese wines, looking for the chemical dimensions that separate red from white and relate to perceived quality.`,
    desc: `A multivariate look at 6,497 Portuguese wines measured on 13 variables: physicochemical measurements, red or white, and a quality score. The report deals with strongly skewed variables and extreme but plausible observations, then uses PCA, Mahalanobis-distance testing, and correlation analysis to find the chemical structure that separates the two wine types and the factors associated with quality.`,
    tools: ['PCA', 'Mahalanobis distance', 'correlation analysis'],
    links: [{ label: 'PDF', href: 'assets/reports/wine-quality-sta437.pdf' }]
  }
];
