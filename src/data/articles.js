export const articles = [
  {
    slug: 'automate-bank-reconciliation-n8n-claude',
    title: 'How to Automate Bank Reconciliation with n8n and Claude',
    category: 'Reconciliation',
    date: '2026-04-02',
    readTime: '7 min read',
    excerpt: 'A step-by-step walkthrough for building a fully automated reconciliation workflow that matches transactions, flags exceptions, and generates a summary report.',
    body: `Bank reconciliation is one of the most repetitive tasks in accounting, and it is also one of the easiest to automate well. The work is rules-based: match a bank transaction to a ledger entry, flag what does not match, and summarize the exceptions for review.

In this workflow, n8n handles the orchestration. A scheduled trigger pulls the latest bank statement export and the corresponding ledger extract. A Code node normalizes both lists into the same shape (date, description, amount), then a matching step pairs transactions within a configurable date tolerance.

## Match rate by month

Here's what the automated match rate looked like over a typical quarter, compared to fully manual reconciliation:

\`\`\`chart
{"type": "bar", "title": "Auto-matched transactions (%)", "xKey": "month", "yKey": "matchRate", "data": [
  {"month": "Jan", "matchRate": 91},
  {"month": "Feb", "matchRate": 94},
  {"month": "Mar", "matchRate": 96}
]}
\`\`\`

Where this gets useful is the exception handling. Anything that does not match cleanly gets passed to Claude with the surrounding context: the unmatched transaction, the closest candidate matches, and the account history.

## The matching formula

The core matching logic compares amount and date tolerance:

\`MATCH = ABS(bank.amount - ledger.amount) < 0.01 AND ABS(bank.date - ledger.date) <= 2\`

| Field | Bank Statement | Ledger | Tolerance |
|---|---|---|---|
| Amount | Exact | Exact | ±$0.01 |
| Date | Posting date | Entry date | ±2 days |
| Description | Free text | Free text | Fuzzy match |

The full workflow runs in under two minutes for a typical month of transactions, compared to the hours this used to take manually. The Atrail Sheets toolkit includes a ready-made version of the matching logic if you want to start from the spreadsheet side before wiring up n8n.`,
  },
  {
    slug: 'financial-modelling-claude-excel',
    title: 'Building Financial Models Faster with Claude and Excel',
    category: 'Financial Modelling',
    date: '2026-03-18',
    readTime: '6 min read',
    excerpt: 'Pairing Claude with Excel does not replace financial modelling judgment, but it removes most of the mechanical setup work. Here is the workflow that holds up under review.',
    body: `The mechanical part of building a financial model, setting up the schedule structure, wiring formulas between sheets, building the assumption blocks, takes up far more time than the actual analysis. That is the part worth automating.

The workflow starts with a plain description of the business: revenue drivers, cost structure, and the scenarios you want to test. Claude turns that into a structured assumptions sheet and a set of formulas for the P&L, cash flow, and balance sheet that reference it.

## Revenue scenario comparison

\`\`\`chart
{"type": "line", "title": "3-year revenue projection by scenario", "xKey": "year", "yKey": "base", "data": [
  {"year": "2026", "base": 240000},
  {"year": "2027", "base": 310000},
  {"year": "2028", "base": 405000}
]}
\`\`\`

The output is not meant to be final. Every formula needs to be checked, and every assumption needs to be sanity-checked against what you actually know about the business.

| Scenario | Revenue Growth | Assumption |
|---|---|---|
| Base case | 25% YoY | Current pipeline conversion holds |
| Upside | 40% YoY | New channel launches on schedule |
| Downside | 10% YoY | Churn increases by 5pts |

What changes is where your time goes: instead of spending an afternoon wiring up a model shell, you spend it reviewing and stress-testing one. Atrail Sheets includes a Financial Model Assistant tool built on this exact pattern, directly inside Google Sheets, if you want to skip the Claude-and-Excel back-and-forth entirely.`,
  },
  {
    slug: 'prepayment-schedules-without-the-manual-work',
    title: 'Prepayment Schedules Without the Manual Spreadsheet Work',
    category: 'Accounting',
    date: '2026-02-27',
    readTime: '5 min read',
    excerpt: 'Building amortization schedules by hand is error-prone and slow. A short template plus one formula pattern handles almost every prepayment case.',
    body: `Most prepayment schedules follow the same shape: a contract value, a start date, a term, and a straight-line (or sometimes declining) amortization pattern. Once you have that template right, every new contract is a five-minute job instead of a fresh spreadsheet.

## The running balance formula

\`CLOSING_BALANCE = OPENING_BALANCE - (CONTRACT_VALUE / TERM_MONTHS)\`

The core formula pattern uses a running balance column: each period subtracts the period amortization amount from the prior closing balance, with a rounding check on the final period so the balance lands exactly at zero.

| Month | Opening Balance | Amortized | Closing Balance |
|---|---|---|---|
| 1 | $12,000.00 | $1,000.00 | $11,000.00 |
| 2 | $11,000.00 | $1,000.00 | $10,000.00 |
| 12 | $1,000.00 | $1,000.00 | $0.00 |

That rounding check is the detail that most manual schedules get wrong. Once the template is solid, the only manual input left is the contract terms themselves. The Prepayment Schedule Builder in Atrail Sheets automates that last step too: enter the contract details once and get a fully formatted schedule, ready to paste into your accounts.`,
  },
  {
    slug: 'choosing-the-right-ai-tool-for-finance-work',
    title: 'Claude vs ChatGPT vs Gemini for Finance Work: What Actually Matters',
    category: 'AI Integrations',
    date: '2026-02-09',
    readTime: '8 min read',
    excerpt: 'The "which AI tool is best" question depends entirely on the task. Here is how to think about it for the finance and accounting workflows that actually come up.',
    body: `For long-context tasks like reviewing a full financial model or reconciling a long transaction list, the model that can hold the most context accurately tends to win. For short, structured tasks like formula debugging, the differences matter much less.

| Task | Best fit | Why |
|---|---|---|
| Long model review | Claude | Largest reliable context window for spreadsheet-heavy review |
| Quick formula fixes | Any | Differences are marginal for short, structured prompts |
| Workflow generation | ChatGPT or Claude | Both handle step-by-step n8n workflow descriptions well |

In practice, the more useful question is not which model is best in the abstract, but which one is already wired into the tool you are using. If you are working inside Google Sheets, having any capable model available in-cell beats switching to a browser tab, regardless of which one it is.

The AI Chat in Sheets tool in the Atrail toolkit lets you swap between Claude, ChatGPT, and Gemini from the same cell formula, so you are not locked into one provider per workflow.`,
  },
];
