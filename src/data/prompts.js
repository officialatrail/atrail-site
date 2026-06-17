export const prompts = [
  {
    title: 'The Financial Model Review Prompt',
    category: 'Financial Modelling',
    locked: true,
    description: 'Drop this into Claude with any Excel model and it will identify errors, stress-test assumptions, and suggest improvements in under 60 seconds.',
    prompt: `You are a senior financial analyst reviewing an Excel model. I will describe the model's structure and assumptions below.

Review it for:
1. Formula errors or circular references
2. Unrealistic or unsupported assumptions
3. Missing scenarios (best/base/worst case)
4. Formatting and audit-trail issues

Model details:
[paste your model structure, key assumptions, and formulas here]

Give me a prioritized list of issues, ranked by impact on the output.`,
  },
  {
    title: 'Bank Reconciliation Matcher',
    category: 'Reconciliation',
    description: 'Feed two transaction lists (bank statement and ledger) and get back matched pairs, flagged discrepancies, and a plain-English summary.',
    prompt: `You are reconciling a bank statement against a general ledger. I will give you two lists of transactions.

For each transaction, match by amount and date (+/- 2 days tolerance). Flag:
- Unmatched bank transactions
- Unmatched ledger transactions
- Amount mismatches on otherwise-matching dates/descriptions

Bank statement transactions:
[paste here]

Ledger transactions:
[paste here]

Return a table: Matched | Bank-only | Ledger-only | Discrepancies, then a one-paragraph summary of what needs investigation.`,
  },
  {
    title: 'n8n Workflow Builder',
    category: 'Automation',
    description: 'Describe a manual finance task and get back a step-by-step n8n workflow you can build, including node types and trigger logic.',
    prompt: `I want to automate the following manual finance task using n8n:

[describe your task, e.g. "every Monday, pull new invoices from Gmail, extract vendor and amount, log them in Google Sheets, and Slack me a summary"]

Give me:
1. The trigger node and its configuration
2. Each processing node in order, with the node type (e.g. Gmail, Code, Google Sheets, Slack)
3. Any conditional logic (IF/Switch nodes) needed
4. Edge cases I should handle (duplicate entries, missing data, API failures)`,
  },
  {
    title: 'Prepayment & Accrual Schedule Generator',
    category: 'Accounting',
    description: 'Give Claude the contract terms and get a full amortization schedule formatted for direct paste into your accounting workbook.',
    prompt: `Generate a monthly prepayment amortization schedule for the following contract:

Contract value: [amount]
Start date: [date]
Term length: [months]
Payment frequency: [monthly/quarterly/annual]

Output as a table with columns: Month, Opening Balance, Amortized Amount, Closing Balance.
Round to 2 decimal places and make sure the final closing balance is exactly zero.`,
  },
  {
    title: 'Excel Formula Debugger',
    category: 'Excel',
    description: 'Paste a broken or slow formula and get back a working version with an explanation of what was wrong.',
    prompt: `This Excel formula isn't working as expected:

[paste your formula]

Expected result: [what you expect it to do]
Actual result: [what it's actually returning, or the error]

Explain what's wrong, then give me a corrected formula. If there's a faster or more robust way to write it (e.g. using XLOOKUP, SUMPRODUCT, or array formulas instead of nested IFs), suggest that too.`,
  },
  {
    title: 'Month-End Close Checklist Generator',
    category: 'Reporting',
    description: 'Describe your close process once and get a repeatable, ordered checklist you can run every month, with dependencies called out.',
    prompt: `Help me build a month-end close checklist for a [size/type] business with the following close activities:

[list your current close tasks, e.g. "reconcile bank accounts, accrue expenses, review AP/AR aging, post depreciation, prepare management accounts"]

Order these by dependency (what must happen before what), group them into days 1-5 of the close, and flag which tasks could be automated with a script or n8n workflow.`,
  },
];
