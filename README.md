# <img src="job_truth_logo.png" height="38" valign="middle" alt="Job Truth Logo"> Job Truth — Verify Before You Apply

> A sleek, Apple-inspired machine learning dashboard designed to audit job posting legitimacy, protect candidates from recruitment scams, and track application verification history.

---

## 🌟 Key Features

*   **🔍 Advanced Job Analyser**: 
    *   **NLP Phrase Auditing**: Scans description texts for spam/phishing patterns (e.g. wire transfer deposits, daily processing agents, package reshipping).
    *   **Public Email Domain Flagging**: Alerts if free domains (like `@gmail.com` or `@yahoo.com`) are used for recruitment.
    *   **"Too-Good-To-Be-True" Bait Detection**: Deducts points if high salaries are offered for remote roles that require no experience.
    *   **WhatsApp / Telegram Scam Scanner**: Flags listings requiring direct messaging on personal chat apps instead of corporate applicant portals.
    *   **Unpaid Stipend Alerts**: Flags commission-only or unpaid training traps.
    *   **Flexibility & Urgency Audits**: Detects pressure tactics and excessive claims of "no targets / no pressure."
*   **📊 Model Performance & Diagnostics**:
    *   Interactive SVG chart comparisons of ML model accuracies.
    *   Fitted Confusion Matrix for Random Forest predictions.
    *   **The Real-World Class Imbalance Analysis**: Visual breakdown of why standard validation accuracy is optimistic and how model precision adjusts to a real-world imbalanced setting (95% legitimate vs. 5% fraudulent).
*   **🔒 Session & History Manager**:
    *   Local login and registration.
    *   Autosaves checked listing logs directly to the user profile using browser `localStorage`.
    *   Clicking **"Reopen Audit"** on the history logs instantly reload past jobs.

---

## 🚀 Live Preview & Deployment

Because this dashboard is built entirely as a Single Page Application (SPA), it runs instantly inside any modern web browser.

### Run Locally
To run locally, you can start a lightweight web server:
```bash
python3 -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Deploy Online
You can host this live for public use using any static hosting service for free:
1.  **Vercel / Netlify / Cloudflare Pages**: Simply drag-and-drop the directory.
2.  **GitHub Pages**: Push this commit and enable GitHub Pages in your repository settings under the main branch.

---

## 🧠 Machine Learning Methodology

The core parameters and rules driving the dashboard's analyzer were researched and verified inside the accompanying Jupyter notebook:

*   **Research Notebook**: `MAJOR_PROJECT_HIRESAFE_ANALYTICS__015.ipynb`
*   **Balancing**: Due to the severe class imbalance in raw data (17,014 legitimate vs. 866 fraudulent), the research dataset was downsampled using `RandomUnderSampler` to a balanced subset of **1,732 job posts**.
*   **Feature Analysis**: Proven that the absence of a detailed `company_profile` (missing in 80%+ of scam posts) and `has_questions = 0` are the strongest metadata signals for identifying fraud.
*   **Classifiers Used**:
    1.  **Random Forest**: 97.3% Validation Accuracy
    2.  **Multinomial Naive Bayes**: 96.8% Validation Accuracy
    3.  **Logistic Regression**: 96.2% Validation Accuracy
    4.  **Decision Tree**: 95.1% Validation Accuracy

---

## 📂 Project Structure

```bash
hire_analytics/
├── index.html                           # Main UI & Navigation markup
├── style.css                            # Typography (Helvetica & Georgia) and corporate theme
├── app.js                               # Local Auth, Analyser Engine, and SVGs rendering
├── job_truth_logo.png                   # Custom project header logo
├── MAJOR_PROJECT_HIRESAFE_ANALYTICS... # Back-end Python ML modeling sandbox
└── README.md                            # Documentation overview
```
