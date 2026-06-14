// Global Application State
let currentUser = null;
let database = JSON.parse(localStorage.getItem('job_truth_db')) || { users: [] };

// Suspicious/Fraudulent job keyword patterns identified in data exploration
const FRAUD_KEYWORDS = [
  { phrase: "data entry clerk", weight: 20, label: "Unskilled Data Entry Pitch" },
  { phrase: "earn $100-$200 daily", weight: 22, label: "High Daily Earnings Promise" },
  { phrase: "earn $2500 per week", weight: 25, label: "Unrealistic Income Guarantee" },
  { phrase: "work from home", weight: 10, label: "Generic Remote Pitch" },
  { phrase: "work remotely", weight: 6, label: "Generic Remote Pitch" },
  { phrase: "earn money", weight: 8, label: "Direct Financial Incentive" },
  { phrase: "weekly pay", weight: 14, label: "Weekly Payout Promise" },
  { phrase: "get paid weekly", weight: 14, label: "Weekly Payout Promise" },
  { phrase: "wire transfer", weight: 25, label: "Wire Transfer Deposit" },
  { phrase: "package forwarding", weight: 25, label: "Package Reshipping Scam" },
  { phrase: "financial agent", weight: 20, label: "Money Laundering Indicator" },
  { phrase: "envelope stuffing", weight: 25, label: "Mail Scam Flag" },
  { phrase: "unpaid training", weight: 10, label: "Unpaid Labour Pitch" },
  { phrase: "deposit", weight: 12, label: "Upfront Payment Request" },
  { phrase: "no experience required", weight: 8, label: "Low Entry Barrier Strategy" },
  { phrase: "no experience needed", weight: 8, label: "Low Entry Barrier Strategy" },
  { phrase: "immediate start", weight: 10, label: "Urgency Inducement" },
  { phrase: "online representative", weight: 15, label: "Vague Representation Role" },
  { phrase: "quick cash", weight: 20, label: "Suspicious Payouts" },
  { phrase: "shipping agent", weight: 20, label: "Reshipping Scam Indicator" },
  { phrase: "money transfer", weight: 22, label: "Financial Intermediation Scam" }
];

// Document Elements
const navHome = document.getElementById('link-home');
const navAnalyzer = document.getElementById('link-analyzer');
const navMetrics = document.getElementById('link-metrics');
const navDashboard = document.getElementById('link-dashboard');
const navLogo = document.getElementById('nav-logo');

const screenHome = document.getElementById('screen-home');
const screenAnalyzer = document.getElementById('screen-analyzer');
const screenMetrics = document.getElementById('screen-metrics');
const screenDashboard = document.getElementById('screen-dashboard');

const headerAuthSection = document.getElementById('header-auth-section');
const headerLoginBtn = document.getElementById('header-login-btn');
const authModal = document.getElementById('auth-modal');
const authModalTitle = document.getElementById('auth-modal-title');
const authModalSubtitle = document.getElementById('auth-modal-subtitle');
const authToggleLink = document.getElementById('auth-toggle-link');
const authToggleText = document.getElementById('auth-toggle-text');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authErrorMsg = document.getElementById('auth-error-msg');
const signupErrorMsg = document.getElementById('signup-error-msg');
const logoutBtn = document.getElementById('logout-btn');

// Analyzer Form Elements
const analyzerForm = document.getElementById('analyzer-form');
const jobTitleInput = document.getElementById('job-title');
const jobCompanyInput = document.getElementById('job-company');
const jobSalaryInput = document.getElementById('job-salary');
const jobIndustryInput = document.getElementById('job-industry');
const jobDescInput = document.getElementById('job-desc');
const switchProfile = document.getElementById('switch-profile');
const switchLogo = document.getElementById('switch-logo');
const switchQuestions = document.getElementById('switch-questions');

// Result elements
const resultPlaceholder = document.getElementById('result-placeholder');
const resultLoading = document.getElementById('result-loading');
const resultOutput = document.getElementById('result-output');
const scoreRing = document.getElementById('score-ring');
const scoreVal = document.getElementById('score-val');
const resultTitle = document.getElementById('result-title');
const verdictBannerBox = document.getElementById('verdict-banner-box');
const verdictIcon = document.getElementById('verdict-icon');
const verdictMsg = document.getElementById('verdict-msg');
const analysisBulletsList = document.getElementById('analysis-bullets-list');
const matchedKeywordsBox = document.getElementById('matched-keywords-box');
const riskIndicatorsSection = document.getElementById('risk-indicators-section');
const riskIndicatorsList = document.getElementById('risk-indicators-list');
const saveHistoryNotice = document.getElementById('save-history-notice');

// Dashboard metrics elements
const dashboardWelcome = document.getElementById('dashboard-welcome');
const statTotal = document.getElementById('stat-total');
const statSafe = document.getElementById('stat-safe');
const statDanger = document.getElementById('stat-danger');
const historyItemsContainer = document.getElementById('history-items-container');

// CTA triggers
const homeCtaBtn = document.getElementById('home-cta-btn');
const homeSecBtn = document.getElementById('home-sec-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupAuth();
  setupAnalyzer();
  checkSession();
});

// Setup Spa Screen Navigation
function setupNavigation() {
  const links = [
    { button: navHome, screen: screenHome },
    { button: navAnalyzer, screen: screenAnalyzer },
    { button: navMetrics, screen: screenMetrics },
    { button: navDashboard, screen: screenDashboard },
    { button: navLogo, screen: screenHome }
  ];

  links.forEach(item => {
    item.button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from all buttons and screens
      links.forEach(l => {
        if(l.button.classList) l.button.classList.remove('active');
        l.screen.classList.remove('active');
      });

      // Set active
      if(item.button !== navLogo) {
        item.button.classList.add('active');
      } else {
        navHome.classList.add('active');
      }
      item.screen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Home CTA mapping
  homeCtaBtn.addEventListener('click', () => navAnalyzer.click());
  homeSecBtn.addEventListener('click', () => navMetrics.click());
}

// User Database and Session Management
function checkSession() {
  const savedUser = JSON.parse(sessionStorage.getItem('job_truth_user'));
  if (savedUser) {
    loginUser(savedUser);
  } else {
    logoutUser();
  }
}

function saveDatabase() {
  localStorage.setItem('job_truth_db', JSON.stringify(database));
}

function setupAuth() {
  // Modal toggle
  headerLoginBtn.addEventListener('click', () => {
    authModal.classList.add('active');
  });

  // Close modal on click outside
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.remove('active');
    }
  });

  // Switch between login and signup
  authToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginForm.style.display !== 'none') {
      // Switch to signup
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      authModalTitle.innerText = "Create Account";
      authModalSubtitle.innerText = "Audit job security and log application histories.";
      authToggleText.innerText = "Already have an account?";
      authToggleLink.innerText = "Sign In";
    } else {
      // Switch to login
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      authModalTitle.innerText = "Sign In";
      authModalSubtitle.innerText = "Access your personalized Job Truth account.";
      authToggleText.innerText = "Don't have an account?";
      authToggleLink.innerText = "Sign Up";
    }
    authErrorMsg.style.display = 'none';
    signupErrorMsg.style.display = 'none';
  });

  // Login handler
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;

    const matchedUser = database.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (matchedUser) {
      loginUser(matchedUser);
      loginForm.reset();
      authModal.classList.remove('active');
    } else {
      authErrorMsg.innerText = "Invalid email or password. Please try again.";
      authErrorMsg.style.display = 'block';
    }
  });

  // Signup handler
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-pass').value;

    if (pass.length < 6) {
      signupErrorMsg.innerText = "Password must be at least 6 characters long.";
      signupErrorMsg.style.display = 'block';
      return;
    }

    const emailExists = database.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      signupErrorMsg.innerText = "An account with this email already exists.";
      signupErrorMsg.style.display = 'block';
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name,
      email: email,
      password: pass,
      history: []
    };

    database.users.push(newUser);
    saveDatabase();
    loginUser(newUser);

    signupForm.reset();
    authModal.classList.remove('active');
  });

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    logoutUser();
  });
}

function loginUser(user) {
  currentUser = user;
  sessionStorage.setItem('job_truth_user', JSON.stringify(user));

  // Render Logged In Nav Header
  headerAuthSection.innerHTML = `
    <div class="user-profile-menu">
      <span style="font-size: 13.5px; font-weight: 600; color: var(--text-main);">Hi, ${user.name.split(' ')[0]}</span>
      <div class="user-badge">${user.name.charAt(0).toUpperCase()}</div>
    </div>
  `;
  navDashboard.style.display = 'inline-block';
  
  // Update Analyzer Screen Save History Banner
  saveHistoryNotice.innerHTML = `
    <span style="color: var(--success); font-weight: 600;">✓ Autosave enabled.</span> This analysis is registered to your account history log.
  `;

  renderDashboard();
}

function logoutUser() {
  currentUser = null;
  sessionStorage.removeItem('job_truth_user');

  // Render Logged Out Nav Header
  headerAuthSection.innerHTML = `
    <button class="nav-btn" id="header-login-btn">Sign In</button>
  `;
  // Re-bind login trigger because we replaced header content
  document.getElementById('header-login-btn').addEventListener('click', () => {
    authModal.classList.add('active');
  });

  navDashboard.style.display = 'none';
  
  // Update Analyzer Save History Banner
  saveHistoryNotice.innerHTML = `
    <span style="color: var(--warning); font-weight: 600;">⚠ History not saved.</span> <a href="#" id="inline-signin-link" style="text-decoration: underline; font-weight: 600;">Sign in</a> to save checks to your dashboard.
  `;
  const inlineLink = document.getElementById('inline-signin-link');
  if(inlineLink) {
    inlineLink.addEventListener('click', (e) => {
      e.preventDefault();
      authModal.classList.add('active');
    });
  }

  // If currently viewing the dashboard, redirect home
  if (screenDashboard.classList.contains('active')) {
    navHome.click();
  }
}

// Job Verification Logic & NLP Analyser
function setupAnalyzer() {
  analyzerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trigger loader state
    resultPlaceholder.style.display = 'none';
    resultOutput.style.display = 'none';
    resultLoading.style.display = 'block';

    setTimeout(() => {
      runAudit();
    }, 1200); // Simulated delay for premium audit feel
  });
}

function evaluateJob(job) {
  const title = job.title.trim();
  const company = job.company || 'Not Specified';
  const salary = job.salary || 'N/A';
  const industry = job.industry || 'N/A';
  const desc = job.desc.trim();
  const descLower = desc.toLowerCase();

  const profileChecked = job.profile;
  const logoChecked = job.logo;
  const questionsChecked = job.questions;

  let score = 100;
  let matches = [];
  let auditLogs = [];
  let riskSignals = [];

  // 1. NLP Keyword Scanning (Weighted Phrase Checks)
  let totalKeywordDeduction = 0;
  FRAUD_KEYWORDS.forEach(kw => {
    if (descLower.includes(kw.phrase)) {
      totalKeywordDeduction += kw.weight;
      matches.push(kw);
    }
  });

  // Cap keyword deductions at 45 points to avoid negative scores based purely on description context
  if (totalKeywordDeduction > 45) totalKeywordDeduction = 45;
  score -= totalKeywordDeduction;

  if (totalKeywordDeduction > 0) {
    auditLogs.push({
      type: 'danger',
      text: `Matched ${matches.length} known fraudulent phrases (Deducted ${totalKeywordDeduction} points).`
    });
  } else {
    auditLogs.push({
      type: 'safe',
      text: "Deceptive promotional templates and scam keywords were not found in the description text."
    });
  }

  // 2. Free Public Email Detection (Common Scam Marker)
  const freeEmailRegex = /\b[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|live|aol|yandex|mail|gmx|protonmail|zoho|icloud|mailinator)\.[A-Za-z]{2,}\b/i;
  const emailsFound = desc.match(freeEmailRegex);
  if (emailsFound) {
    score -= 30;
    auditLogs.push({
      type: 'danger',
      text: `Uses free public email domain (${emailsFound[0]}) for recruitment. Legitimate companies use custom corporate domains.`
    });
  }

  // 3. WhatsApp / Telegram Direct Hiring Links
  const chatScamRegex = /(whatsapp|telegram|wa\.me|t\.me|\+\d{1,3}\s?\d{3,14}|\bchat\b\s+with\s+us\s+on\s+whatsapp)/i;
  if (chatScamRegex.test(desc)) {
    score -= 25;
    riskSignals.push("Direct chat recruitment: Asks applicants to communicate directly via WhatsApp, Telegram, or phone lines rather than corporate applicant portals (highly indicative of data harvesting and phishing).");
  }

  // 4. No Stipend / Unpaid Trainee bait
  const stipendRegex = /(no stipend|unpaid training|unpaid internship|no pay|commission only|no salary during training)/i;
  if (stipendRegex.test(descLower)) {
    score -= 15;
    riskSignals.push("No stipend warning: Offers unpaid training or internships with no base pay while promising high commission potentials (classic trap to secure free labor or sell paid courses).");
  }

  // 5. Over-Glorification & Financial Hype
  const glorificationRegex = /(make quick fortune|unlimited potential|earn passive income|grow rich|financial freedom|no limits on earnings|easy money|financial independence)/i;
  if (glorificationRegex.test(descLower)) {
    score -= 15;
    riskSignals.push("Over-glorification of role: Heavy emphasis on fast fortunes, financial independence, and passive income instead of detailing job tasks, software, or actual professional requirements.");
  }

  // 6. Over-emphasizing Flexibility & Lack of Operational Pressure
  const flexibilityRegex = /(work whenever you want|work at your own pace|no pressure|no targets|100% flexible|be your own boss|set your own hours)/i;
  if (flexibilityRegex.test(descLower)) {
    score -= 15;
    riskSignals.push("Vague flexibility / Lack of accountability: Heavy advertising of 'no pressure', 'no targets', and 'work whenever you want'. Real jobs require professional responsibility, targets, and structure.");
  }

  // 7. Too Good to be True Combination (High Salary + Entry Level / No Experience + Remote)
  let salaryNum = 0;
  if (salary && salary !== 'N/A') {
    const numbers = salary.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      salaryNum = Math.max(...numbers.map(Number));
    }
  }
  
  const isNoExp = descLower.includes("no experience") || descLower.includes("entry level") || descLower.includes("no exp");
  const isRemote = descLower.includes("work from home") || descLower.includes("work remotely") || descLower.includes("remote");
  
  if (salaryNum > 60000 && isNoExp && isRemote) {
    score -= 25;
    auditLogs.push({
      type: 'danger',
      text: `High salary offer ($${salaryNum}+) combined with 'No Experience Required' and 'Remote' options (typical phishing bait).`
    });
  }

  // 8. Company Profile Audit (Jupyter Feature Importance Metric)
  if (profileChecked) {
    auditLogs.push({
      type: 'safe',
      text: "Company Profile included. Validates context and details of the hiring firm."
    });
  } else {
    score -= 25; // High weight deduction
    auditLogs.push({
      type: 'danger',
      text: "No Company Profile detected. (Over 80% of fraudulent posts in analytics lacked background profiles)."
    });
  }

  // 9. Logo Check
  if (logoChecked) {
    auditLogs.push({
      type: 'safe',
      text: "A visual brand logo is present, adding structural verification."
    });
  } else {
    score -= 15;
    auditLogs.push({
      type: 'danger',
      text: "Logo is missing. Fraudulent listings are often posted from generic or unverified accounts."
    });
  }

  // 10. Screening Questions Check
  if (questionsChecked) {
    auditLogs.push({
      type: 'safe',
      text: "Screening questions are enabled, indicating professional HR verification queues."
    });
  } else {
    score -= 15;
    auditLogs.push({
      type: 'neutral',
      text: "No applicant questionnaires found. (Simplistic applications bypass screening filters)."
    });
  }

  // 11. Description Length Heuristic
  const descLen = desc.length;
  if (descLen < 400) {
    score -= 15;
    auditLogs.push({
      type: 'danger',
      text: `Abnormally short description length (${descLen} characters). Fraud posts are frequently brief.`
    });
  } else if (descLen > 6000) {
    score -= 8;
    auditLogs.push({
      type: 'neutral',
      text: `Abnormally dense description length (${descLen} characters). Check for copy-paste content spam.`
    });
  } else {
    auditLogs.push({
      type: 'safe',
      text: "Description length matches normal distributions of official job templates."
    });
  }

  // 12. Urgency / CAPITALS check
  const urgentWords = ["URGENT", "IMMEDIATE START", "ACT NOW", "MAKE QUICK CASH", "CASH DAILY"];
  let matchedUrgent = urgentWords.filter(w => desc.includes(w));
  if (matchedUrgent.length > 0) {
    score -= 10;
    auditLogs.push({
      type: 'danger',
      text: `Excessive capitalization / urgency phrases: ${matchedUrgent.join(', ')}.`
    });
  }

  // Keep score within bounds (0 - 100)
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Generate Verdict Details
  let verdictTitle = "";
  let verdictClass = "";
  let verdictText = "";
  let verdictIconChar = "";

  if (score >= 80) {
    verdictTitle = "Verified Safe";
    verdictClass = "safe";
    verdictIconChar = "✓";
    verdictText = "This listing matches official recruitment templates with standard structural parameters.";
  } else if (score >= 55) {
    verdictTitle = "Moderate Risk Check";
    verdictClass = "warning";
    verdictIconChar = "⚠";
    verdictText = "Proceed with caution. Several structure checks or phrasing patterns deviate from trusted posts.";
  } else {
    verdictTitle = "High Risk Warning";
    verdictClass = "danger";
    verdictIconChar = "✗";
    verdictText = "Highly suspicious features detected. Extreme risk of phishing or package forwarding fraud.";
  }

  return {
    score,
    verdictTitle,
    verdictClass,
    verdictIconChar,
    verdictText,
    auditLogs,
    matches,
    riskSignals
  };
}

function runAudit() {
  const title = jobTitleInput.value.trim();
  const company = jobCompanyInput.value.trim();
  const salary = jobSalaryInput.value.trim();
  const industry = jobIndustryInput.value.trim();
  const desc = jobDescInput.value.trim();

  const profileChecked = switchProfile.checked;
  const logoChecked = switchLogo.checked;
  const questionsChecked = switchQuestions.checked;

  // Perform shared evaluation
  const result = evaluateJob({
    title,
    company,
    salary,
    industry,
    desc,
    profile: profileChecked,
    logo: logoChecked,
    questions: questionsChecked
  });

  // Render circular rating progress ring
  const circleOffset = 283 - (283 * result.score) / 100;
  scoreRing.style.strokeDashoffset = circleOffset;

  // Set colors based on classification
  if (result.verdictClass === 'safe') {
    scoreRing.style.stroke = "var(--success)";
    scoreVal.style.color = "var(--success)";
  } else if (result.verdictClass === 'warning') {
    scoreRing.style.stroke = "var(--warning)";
    scoreVal.style.color = "var(--warning)";
  } else {
    scoreRing.style.stroke = "var(--danger)";
    scoreVal.style.color = "var(--danger)";
  }

  scoreVal.innerText = `${result.score}%`;
  resultTitle.innerText = result.verdictTitle;

  // Render Verdict Box styling
  verdictBannerBox.className = `verdict-banner ${result.verdictClass}`;
  verdictIcon.innerText = result.verdictIconChar;
  verdictMsg.innerText = result.verdictText;

  // Render Factor Bullet Logs
  analysisBulletsList.innerHTML = '';
  result.auditLogs.forEach(log => {
    const li = document.createElement('li');
    li.className = log.type;
    li.innerText = log.text;
    analysisBulletsList.appendChild(li);
  });

  // Render Keyword tags matching
  matchedKeywordsBox.innerHTML = '';
  if (result.matches.length > 0) {
    result.matches.forEach(m => {
      const tag = document.createElement('span');
      tag.className = "keyword-tag suspicious";
      tag.innerText = `${m.phrase} (${m.label})`;
      matchedKeywordsBox.appendChild(tag);
    });
  } else {
    const emptyTag = document.createElement('span');
    emptyTag.className = "keyword-tag";
    emptyTag.innerText = "No fraudulent keywords triggered";
    matchedKeywordsBox.appendChild(emptyTag);
  }

  // Render Deceptive Risk Signals
  riskIndicatorsList.innerHTML = '';
  if (result.riskSignals.length > 0) {
    riskIndicatorsSection.style.display = 'block';
    result.riskSignals.forEach(signal => {
      const li = document.createElement('li');
      li.className = 'danger'; // Warning indicators are marked red
      li.innerText = signal;
      riskIndicatorsList.appendChild(li);
    });
  } else {
    riskIndicatorsSection.style.display = 'none';
  }

  // Persistent History Logging
  const checkedJob = {
    id: 'job_' + Date.now(),
    title: title,
    company: company || 'Not Specified',
    salary: salary || 'N/A',
    industry: industry || 'N/A',
    desc: jobDescInput.value,
    profile: profileChecked,
    logo: logoChecked,
    questions: questionsChecked,
    score: result.score,
    verdict: result.verdictTitle,
    verdictClass: result.verdictClass,
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  };

  if (currentUser) {
    // Save to user history
    const dbUserIdx = database.users.findIndex(u => u.id === currentUser.id);
    if (dbUserIdx !== -1) {
      database.users[dbUserIdx].history.unshift(checkedJob);
      saveDatabase();
      currentUser = database.users[dbUserIdx];
      sessionStorage.setItem('job_truth_user', JSON.stringify(currentUser));
      
      // Update history screen renders
      renderDashboard();
    }
  }

  // Display Output screen
  resultLoading.style.display = 'none';
  resultOutput.style.display = 'block';
}

// User Dashboard View Rendering
function renderDashboard() {
  if (!currentUser) return;

  dashboardWelcome.innerText = `Welcome Back, ${currentUser.name}`;

  const history = currentUser.history || [];
  statTotal.innerText = history.length;

  const safeCount = history.filter(j => j.verdictClass === 'safe').length;
  const dangerCount = history.filter(j => j.verdictClass === 'danger').length;

  statSafe.innerText = safeCount;
  statDanger.innerText = dangerCount;

  historyItemsContainer.innerHTML = '';

  if (history.length === 0) {
    historyItemsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📂</div>
        <p>No job postings audited yet. Go to the Job Analyser to check your first listing.</p>
      </div>
    `;
    return;
  }

  history.forEach(job => {
    const item = document.createElement('div');
    item.className = "history-item";

    let scoreColor = 'var(--text-muted)';
    if (job.verdictClass === 'safe') scoreColor = 'var(--success)';
    if (job.verdictClass === 'danger') scoreColor = 'var(--danger)';
    if (job.verdictClass === 'warning') scoreColor = 'var(--warning)';

    item.innerHTML = `
      <div class="history-item-left">
        <div class="history-job-title">${job.title}</div>
        <div class="history-company">${job.company} — ${job.date}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-weight: 700; color: ${scoreColor}; font-size: 15px;">${job.score}%</span>
        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; border-radius: 8px;">Reopen Audit</button>
      </div>
    `;

    // Reopen Audit click handler
    item.querySelector('button').addEventListener('click', () => {
      loadHistoryIntoForm(job);
    });

    historyItemsContainer.appendChild(item);
  });
}

function loadHistoryIntoForm(job) {
  // Load variables back to inputs
  jobTitleInput.value = job.title;
  jobCompanyInput.value = job.company === 'Not Specified' ? '' : job.company;
  jobSalaryInput.value = job.salary === 'N/A' ? '' : job.salary;
  jobIndustryInput.value = job.industry === 'N/A' ? '' : job.industry;
  jobDescInput.value = job.desc;
  
  switchProfile.checked = job.profile;
  switchLogo.checked = job.logo;
  switchQuestions.checked = job.questions;

  // Jump screen to analyzer tab
  navAnalyzer.click();

  // Immediately display results
  resultPlaceholder.style.display = 'none';
  resultLoading.style.display = 'none';
  resultOutput.style.display = 'block';

  // Perform shared evaluation to reconstruct factors reliably
  const result = evaluateJob(job);

  // Draw ring offsets
  const circleOffset = 283 - (283 * result.score) / 100;
  scoreRing.style.strokeDashoffset = circleOffset;

  if (result.verdictClass === 'safe') {
    scoreRing.style.stroke = "var(--success)";
    scoreVal.style.color = "var(--success)";
  } else if (result.verdictClass === 'warning') {
    scoreRing.style.stroke = "var(--warning)";
    scoreVal.style.color = "var(--warning)";
  } else {
    scoreRing.style.stroke = "var(--danger)";
    scoreVal.style.color = "var(--danger)";
  }

  scoreVal.innerText = `${result.score}%`;
  resultTitle.innerText = result.verdictTitle;

  // Verdict banner styling
  verdictBannerBox.className = `verdict-banner ${result.verdictClass}`;
  verdictIcon.innerText = result.verdictIconChar;
  verdictMsg.innerText = result.verdictText;

  // Bullets factor rebuilding
  analysisBulletsList.innerHTML = '';
  result.auditLogs.forEach(log => {
    const li = document.createElement('li');
    li.className = log.type;
    li.innerText = log.text;
    analysisBulletsList.appendChild(li);
  });

  // Rebuild keyword badges
  matchedKeywordsBox.innerHTML = '';
  if (result.matches.length > 0) {
    result.matches.forEach(m => {
      const tag = document.createElement('span');
      tag.className = "keyword-tag suspicious";
      tag.innerText = `${m.phrase} (${m.label})`;
      matchedKeywordsBox.appendChild(tag);
    });
  } else {
    const emptyTag = document.createElement('span');
    emptyTag.className = "keyword-tag";
    emptyTag.innerText = "No fraudulent keywords triggered";
    matchedKeywordsBox.appendChild(emptyTag);
  }

  // Render Deceptive Risk Signals
  riskIndicatorsList.innerHTML = '';
  if (result.riskSignals.length > 0) {
    riskIndicatorsSection.style.display = 'block';
    result.riskSignals.forEach(signal => {
      const li = document.createElement('li');
      li.className = 'danger'; // Warning indicators are marked red
      li.innerText = signal;
      riskIndicatorsList.appendChild(li);
    });
  } else {
    riskIndicatorsSection.style.display = 'none';
  }
}
