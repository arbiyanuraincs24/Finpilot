# FinPilot

### AI-Powered Personal Finance Decision Support Agent

> **Understand your money. Anticipate what's coming. Decide with confidence.**

FinPilot is an AI-powered personal finance decision-support application that helps users understand their financial data, identify recurring commitments and unusual spending, compare expenses against budgets, plan financial goals, and ask natural-language questions about their money.

Instead of simply displaying transactions, FinPilot transforms financial records into **understandable insights, explanations, forecasts, and actionable decision support**.

---

## Table of Contents

* [Problem Statement](#problem-statement)
* [Our Solution](#our-solution)
* [Key Features](#key-features)
* [How FinPilot Works](#how-finpilot-works)
* [User Journey](#user-journey)
* [AI and Intelligence Layer](#ai-and-intelligence-layer)
* [Explainable Insights](#explainable-insights)
* [Financial Goals](#financial-goals)
* [What-If Simulator](#what-if-simulator)
* [Data Validation](#data-validation)
* [Natural Language Copilot](#natural-language-copilot)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [Technology Stack](#technology-stack)
* [Backend API](#backend-api)
* [Data Format](#data-format)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the Application](#running-the-application)
* [Example Questions](#example-questions)
* [Security and Privacy](#security-and-privacy)
* [Limitations](#limitations)
* [Future Scope](#future-scope)
* [Hackathon Requirement Mapping](#hackathon-requirement-mapping)
* [Demo Flow](#demo-flow)
* [Conclusion](#conclusion)

---

# Problem Statement

People make financial decisions across multiple areas such as:

* Daily spending
* Subscriptions
* Bills
* Savings
* Recurring payments
* Short-term financial goals
* Monthly budgets

However, financial information is often spread across bank statements, credit-card statements, bills, emails, and spreadsheets.

Most people can see individual transactions, but that does not necessarily tell them:

* Where their money is going
* Which expenses are recurring
* Which spending patterns are unusual
* What financial commitments are coming next
* How much of a budget has already been used
* How current spending affects a financial goal
* What actions they could consider based on their financial data

FinPilot addresses this gap by converting transaction data into an intelligent financial decision-support experience.

---

# Our Solution

FinPilot provides a centralized financial intelligence layer over a user's transaction data.

The application follows this general pipeline:

```text
Financial Data
      ↓
CSV Upload
      ↓
Validation
      ↓
Transaction Categorization
      ↓
Financial Analysis
      ↓
┌───────────────────────────────────────┐
│ Recurring Payments                    │
│ Upcoming Obligations                  │
│ Unusual Spending                      │
│ Budget Analysis                       │
│ Spending Patterns                     │
│ Goal Impact                           │
└───────────────────────────────────────┘
      ↓
AI Intelligence
      ↓
Insights + Forecast + Copilot
      ↓
Actionable Financial Decision Support
```

The goal is not to replace a financial advisor or provide investment advice.

FinPilot focuses on helping users **understand their own financial data and make more informed everyday decisions**.

---

# Key Features

## 1. Financial Data Upload

Users can upload transaction records in CSV format.

FinPilot processes the uploaded data and extracts:

* Transaction date
* Description
* Amount
* Transaction type
* Category

The uploaded data becomes the foundation for all downstream analysis.

---

## 2. Automatic Transaction Categorization

Transactions are automatically categorized based on transaction descriptions and transaction type.

Supported categories include:

* Food
* Transport
* Shopping
* Subscription
* Utilities
* Housing
* Income
* Other

For example:

```text
Swiggy Order
      ↓
Food

Amazon Purchase
      ↓
Shopping

Netflix Subscription
      ↓
Subscription

Monthly Salary
      ↓
Income
```

This allows FinPilot to transform raw transaction records into meaningful spending groups.

---

## 3. Financial Dashboard

The dashboard provides a high-level overview of the user's financial position.

It summarizes:

* Total income
* Total expenses
* Savings
* Savings rate
* Category-wise spending
* Recent transactions
* Budget information
* Financial activity

Example:

```text
Income       ₹5,10,000
Expenses     ₹4,38,942
Savings      ₹71,058
Savings Rate 13.9%
```

The dashboard is designed to answer the first question a user usually has:

> "What is happening with my money?"

---

# 4. Recurring Payments and Subscriptions

FinPilot analyzes transaction patterns to identify recurring financial commitments.

This can help surface:

* Subscription payments
* Repeated service payments
* Regular financial commitments

The system can summarize recurring payment activity and provide it as part of the user's financial picture.

Example:

```text
Recurring commitments

Netflix
Spotify
Rent
Internet
Other recurring payments
```

This helps users identify expenses that may continue automatically over time.

---

# 5. Upcoming Financial Obligations

FinPilot analyzes recurring financial activity to identify expected upcoming commitments.

This allows users to think beyond transactions that have already happened.

Instead of only showing:

```text
What did I spend?
```

FinPilot also helps answer:

```text
What financial commitments may be coming next?
```

---

# 6. Unusual Spending Detection

FinPilot detects transactions that significantly differ from observed spending patterns.

For example:

```text
Laptop Purchase
₹80,000
```

may be identified as an unusual transaction relative to the surrounding spending data.

The system does not automatically assume that an unusual transaction is wrong.

Instead, it presents it as something the user may want to review.

This distinction is important:

```text
Unusual ≠ Incorrect
```

---

# 7. Budget Comparison

Users can define budgets for spending categories.

FinPilot compares financial activity against those budgets and helps users understand:

* Budget allocation
* Current spending
* Remaining budget
* Category-level usage
* Budget commitments

This provides context around spending instead of displaying expenses in isolation.

---

# 8. Financial Goals

Users can create financial goals such as:

* Buying a laptop
* Saving for a purchase
* Building an emergency fund
* Saving a specific amount by a target date

A goal contains information such as:

```text
Goal
Target Amount
Target Date
Current Savings
```

FinPilot then analyzes the user's current financial position against the goal.

---

# 9. Goal Impact Analysis

FinPilot connects everyday spending with financial goals.

The goal planning system analyzes factors such as:

* Monthly income
* Monthly expenses
* Current savings
* Required monthly contribution
* Time remaining
* Savings capacity
* Goal impact

This helps answer:

> "Given my current spending pattern, how does this affect my goal?"

---

# 10. Goal Planning

For a selected goal, FinPilot calculates planning information such as:

```text
Monthly income
Monthly expenses
Monthly savings
Required monthly saving
Months remaining
Current savings rate
Required savings rate
Potential shortfall
Savings capacity
Goal impact
```

The purpose is to provide a transparent calculation rather than simply producing an unexplained recommendation.

---

# 11. What-If Financial Simulator

FinPilot includes a financial simulator that allows users to explore hypothetical spending changes.

For example:

```text
Current Shopping Spending
₹125,300

Potential Reduction
15%

Potential Savings
₹18,795
```

Users can explore how changes to spending categories could affect:

* Monthly savings
* Financial capacity
* Goals
* Spending patterns

Simulation scenarios can also be saved locally for later review.

The simulator is intended for exploration rather than financial advice.

---

# 12. AI-Powered Financial Insights

FinPilot generates personalized insights from the user's financial data.

Insights can cover:

* Spending patterns
* Unusual transactions
* Recurring commitments
* Savings opportunities
* Financial behavior

Example:

```text
Observation:
Shopping represents a significant portion of expenses.

Why FinPilot flagged this:
The insight is based on the spending category
identified from the uploaded transactions.

Next step:
Review the category and consider whether
some spending can be reduced.
```

---

# 13. Explainable AI

FinPilot does not simply display an AI-generated statement.

Each supported insight can provide:

### WHY FINPILOT FLAGGED THIS

Explains the data pattern behind the insight.

### RECOMMENDED NEXT STEP

Provides a practical action for the user to consider.

This makes the system more transparent and reduces the "black box" nature of AI-generated financial insights.

The user remains responsible for deciding what action to take.

---

# 14. Natural-Language Financial Copilot

FinPilot includes a natural-language Copilot that allows users to ask questions about their financial data.

Instead of navigating multiple screens, users can ask questions in ordinary language.

Examples include:

```text
Where did I spend the most this month?
```

```text
Which subscriptions am I paying for?
```

```text
What expenses increased compared with last month?
```

```text
How much of my budget is already committed?
```

The Copilot receives the relevant transaction and financial-summary context and generates a response based on the user's data.

---

# 15. Monthly Financial Summary

FinPilot brings the analyzed information together into a monthly financial view.

A summary can include:

```text
Income
Expenses
Savings
Savings Rate
Major Spending Categories
Recurring Commitments
Upcoming Obligations
Unusual Spending
Goal Impact
Key Observations
Action Items
```

This turns raw transaction history into a concise financial overview.

---

# How FinPilot Works

## Step 1 — Upload

The user uploads a CSV containing financial transactions.

## Step 2 — Validate

FinPilot checks:

* Required columns
* Dates
* Amounts
* Transaction types
* Missing descriptions
* Duplicate transactions
* Invalid values

## Step 3 — Categorize

Transactions are automatically assigned categories.

## Step 4 — Analyze

The backend calculates:

* Income
* Expenses
* Savings
* Category spending
* Recurring activity
* Upcoming commitments
* Budget usage
* Spending patterns
* Anomalies

## Step 5 — Generate Intelligence

AI services use the analyzed financial context to produce:

* Insights
* Forecasts
* Natural-language answers
* Financial observations

## Step 6 — Plan

Users can create goals and explore how spending affects them.

## Step 7 — Decide

FinPilot presents explanations and action items so the user can make their own everyday financial decisions.

---

# User Journey

```text
Landing Page
      ↓
Personalized Name Setup
      ↓
Dashboard
      ↓
Upload Financial Data
      ↓
Validation
      ↓
Automatic Categorization
      ↓
Financial Overview
      ↓
Recurring Payments
      ↓
Upcoming Obligations
      ↓
Budget Analysis
      ↓
Unusual Spending
      ↓
AI Insights
      ↓
Forecast
      ↓
Copilot Q&A
      ↓
Create Financial Goal
      ↓
Goal Plan
      ↓
What-If Simulator
      ↓
Monthly Summary & Actions
```

---

# AI and Intelligence Layer

FinPilot uses a hybrid approach rather than relying on an LLM for every calculation.

## Deterministic financial processing

Traditional application logic handles structured financial calculations such as:

* Transaction validation
* Categorization
* Income calculation
* Expense calculation
* Savings calculation
* Budget calculations
* Recurring transaction analysis
* Goal calculations
* Simulation calculations

This keeps numerical financial operations predictable and reproducible.

## AI-powered reasoning

AI services are used for tasks where natural-language reasoning is useful, including:

* Personalized insights
* Financial explanations
* Forecast-related interpretation
* Natural-language Copilot responses

This architecture combines deterministic financial analysis with AI-powered interpretation.

---

# Explainability Architecture

FinPilot follows a simple explainability model:

```text
Transaction Data
      ↓
Financial Analysis
      ↓
Detected Pattern
      ↓
AI Interpretation
      ↓
WHY?
      ↓
NEXT STEP
```

The application separates:

1. **Observed financial data**
2. **System-generated analysis**
3. **AI interpretation**
4. **Suggested action**

This helps users understand where an insight came from.

---

# Data Validation

FinPilot validates uploaded CSV files before processing them.

Validation includes:

### Required columns

```text
date
description
amount
transaction_type
```

### Date validation

Invalid dates are rejected.

### Description validation

Missing descriptions are rejected.

### Amount validation

Amounts must be valid positive numbers.

### Transaction type validation

Allowed values:

```text
income
expense
```

### Duplicate detection

Duplicate transactions are detected and reported.

Example validation output:

```text
CSV validation failed

Total rows: 6
Valid rows: 1
Invalid rows: 5
Duplicates: 1
```

Detailed row-level errors are also displayed to the user.

---

# Example CSV Format

```csv
date,description,amount,transaction_type
2026-06-01,Monthly Salary,65000,income
2026-06-02,House Rent,18000,expense
2026-06-03,Swiggy Order,850,expense
2026-06-04,Amazon Purchase,4500,expense
2026-06-05,Netflix Subscription,649,expense
2026-06-06,Uber Ride,420,expense
```

---

# System Architecture

```text
┌───────────────────────────────────────────┐
│              React Frontend               │
│                                           │
│ Dashboard                                 │
│ Transactions                              │
│ Insights                                  │
│ Forecast                                  │
│ Copilot                                   │
│ Goals                                     │
│ Goal Plan                                 │
│ Simulator                                 │
│ Budgets                                   │
│ Settings                                  │
└───────────────────┬───────────────────────┘
                    │
                    │ HTTP / REST
                    ▼
┌───────────────────────────────────────────┐
│              FastAPI Backend              │
│                                           │
│ Upload API                                │
│ Insights API                              │
│ Forecast API                              │
│ Copilot API                               │
│ Expectations API                          │
│ Anomaly API                               │
└───────────────────┬───────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│           Financial Analysis Layer        │
│                                           │
│ Parser                                    │
│ Categorizer                               │
│ Analytics                                 │
│ Recurring Detection                       │
│ Forecasting                               │
│ Expectations                              │
│ Anomaly Detection                         │
└───────────────────┬───────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│               AI Layer                    │
│                                           │
│ Insights                                  │
│ Copilot                                   │
│ Financial Interpretation                  │
└───────────────────────────────────────────┘
```

---

# Project Structure

```text
FinPilot/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── SpendingChart.jsx
│   │   │   └── RecentTransactions.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Forecast.jsx
│   │   │   ├── Copilot.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── SavedGoals.jsx
│   │   │   ├── CreateGoal.jsx
│   │   │   ├── GoalPlan.jsx
│   │   │   ├── Simulator.jsx
│   │   │   └── Budgets.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload.py
│   │   │   ├── insights.py
│   │   │   ├── forecast.py
│   │   │   ├── copilot.py
│   │   │   ├── expectations.py
│   │   │   └── anomalies.py
│   │   │
│   │   └── services/
│   │       ├── parser.py
│   │       ├── categorizer.py
│   │       ├── analytics.py
│   │       ├── insights.py
│   │       ├── forecast.py
│   │       ├── copilot.py
│   │       ├── expectations.py
│   │       └── anomalies.py
│   │
│   ├── data/
│   │   └── sample_transactions.csv
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript
* CSS
* Lucide React
* Browser Local Storage

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* Pandas / Python data processing

## AI

* OpenRouter-compatible LLM API
* AI-powered insight generation
* Natural-language financial Copilot

## Architecture

```text
Frontend → REST API → FastAPI → Financial Analysis → AI Services
```

---

# Backend API

## Upload CSV

```http
POST /api/upload/csv
```

Uploads and validates financial transaction data.

---

## Generate Insights

```http
POST /api/insights
```

Receives transactions and financial summary and generates financial insights.

---

## Generate Forecast

```http
POST /api/forecast
```

Analyzes transaction history to generate financial forecasts.

---

## Ask Copilot

```http
POST /api/copilot
```

Example request:

```json
{
  "question": "Where did I spend the most this month?",
  "transactions": [],
  "summary": {}
}
```

---

## Generate Expectations

```http
POST /api/expectations
```

Analyzes recurring transaction activity and upcoming financial obligations.

---

## Detect Anomalies

```http
POST /api/anomalies
```

Analyzes transaction patterns for unusual spending.

---

# Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model
```

Do not commit secret API keys to the repository.

Add `.env` to `.gitignore`.

---

# Installation

## Prerequisites

Make sure the following are installed:

* Python 3.13+
* Node.js
* npm
* Git

---

# Backend Setup

Open PowerShell:

```powershell
cd "C:\Users\Arbiya Nurain\OneDrive\FinPilot\backend"
```

Create or activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

# Frontend Setup

Open another terminal:

```powershell
cd "C:\Users\Arbiya Nurain\OneDrive\FinPilot\frontend"
```

Install dependencies:

```powershell
npm install
```

---

# Running the Application

## Start Backend

```powershell
cd "C:\Users\Arbiya Nurain\OneDrive\FinPilot\backend"

.\.venv\Scripts\Activate.ps1

python -m uvicorn main:app --reload
```

The backend runs locally at:

```text
const API_URL = "https://finpilot-1-vnma.onrender.com";
```

---

## Start Frontend

Open another terminal:

```powershell
cd "C:\Users\Arbiya Nurain\OneDrive\FinPilot\frontend"

npm run dev
```

Vite will provide the local development URL.

---

# Example Natural-Language Questions

FinPilot is designed to understand questions such as:

### Spending

```text
Where did I spend the most this month?
```

### Subscriptions

```text
Which subscriptions am I paying for?
```

### Spending changes

```text
What expenses increased compared with last month?
```

### Budgets

```text
How much of my budget is already committed?
```

Additional examples:

```text
How much did I spend on shopping?

What are my largest expense categories?

How much am I saving?

What recurring payments do I have?

Which transaction looks unusual?

How is my current spending affecting my goal?

Where could I potentially reduce spending?
```

---

# Privacy and Data Handling

FinPilot is designed around user-controlled financial data.

The application focuses on analyzing the financial information supplied by the user.

Important principles:

* Users control the transaction data they upload.
* API keys must be stored as environment variables.
* Sensitive credentials should never be committed to Git.
* Goal and simulator information currently uses browser local storage.
* FinPilot does not require investment-account access for its core workflow.
* The system is designed for financial understanding and decision support rather than investment management.

---

# Important Scope

FinPilot is **not an investment advisor**.

It does not attempt to:

* Recommend stocks
* Recommend securities
* Predict investment returns
* Manage investment portfolios
* Execute financial transactions
* Replace professional financial advice

Its purpose is to help users understand their own everyday financial data.

---

# Limitations

The current version has several intentional limitations.

## CSV-first ingestion

The current upload workflow is centered on structured CSV transaction data.

Future versions can expand ingestion to:

* PDF bank statements
* Credit-card statements
* Bills
* Expense receipts
* Other structured financial records

## Categorization

Transaction categorization currently combines deterministic keyword-based logic with financial analysis.

More advanced versions could use:

* Merchant databases
* Embedding-based classification
* User feedback
* Personalized category learning

## Forecasting

Forecasts are based on available transaction history and should be interpreted as estimates rather than guaranteed future outcomes.

## AI Responses

AI-generated responses depend on the quality and completeness of the uploaded financial data.

---

# Future Scope

Potential future improvements include:

### Multi-format ingestion

```text
CSV
PDF
Images
Bills
Receipts
Email exports
```

### Adaptive categorization

Allow users to correct categories and use those corrections to improve future classification.

### Personalized financial memory

Allow FinPilot to learn recurring preferences and financial patterns while maintaining user control.

### Better forecasting

Use longer historical windows and more sophisticated time-series models.

### Financial calendar

Combine:

* Recurring payments
* Bills
* Goals
* Expected income
* Upcoming obligations

into a unified financial calendar.

### Smarter goal simulations

Allow users to compare multiple scenarios:

```text
Current plan
Conservative plan
Aggressive savings plan
Reduced spending plan
```

### Mobile application

Provide the FinPilot experience on mobile devices.

---

# Hackathon Requirement Mapping

FinPilot directly addresses the requirements in the challenge statement.

| Hackathon Requirement                                    | FinPilot Implementation                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Upload transaction statements, bills and expense records | CSV transaction upload currently implemented; multi-format ingestion is future scope |
| Automatically categorize transactions                    | Transaction categorization service                                                   |
| Identify recurring payments and subscriptions            | Recurring payment analysis                                                           |
| Detect unusual spending patterns                         | Anomaly detection                                                                    |
| Summarize monthly income and expenses                    | Dashboard financial summary                                                          |
| Identify upcoming recurring obligations                  | Expectations / upcoming obligations analysis                                         |
| Compare actual spending against budgets                  | Budgets module                                                                       |
| Define financial goals                                   | Goals and Create Goal                                                                |
| Analyze spending impact on goals                         | Goal Plan                                                                            |
| Generate personalized spending insights                  | AI Insights                                                                          |
| Answer natural-language questions                        | Financial Copilot                                                                    |
| Monthly financial summary                                | Financial summary and action items                                                   |
| Key observations                                         | Insights                                                                             |
| Action items                                             | Explainable insight recommendations                                                  |

---

# Why FinPilot?

Traditional financial dashboards often answer:

> "What happened?"

FinPilot attempts to go one step further:

```text
What happened?
      ↓
Why does it matter?
      ↓
What might happen next?
      ↓
How does it affect my goal?
      ↓
What should I review?
```

The system combines structured financial analysis with AI-powered natural-language interaction to make financial information easier to understand.

---

# Design Philosophy

FinPilot follows five principles.

### 1. Understand before deciding

The application first organizes and explains financial data.

### 2. Data before AI

Structured calculations are performed using deterministic application logic where appropriate.

### 3. Explain AI output

Insights should communicate why a pattern was identified.

### 4. User remains in control

FinPilot provides information and decision support rather than making financial decisions for the user.

### 5. Actionable over overwhelming

The goal is to turn large amounts of transaction data into a smaller number of useful observations and actions.

---

# Demo Flow

For a hackathon demonstration, the recommended flow is:

```text
1. Open FinPilot
        ↓
2. Enter user name
        ↓
3. Upload sample transaction CSV
        ↓
4. Show validation and categorization
        ↓
5. Open Dashboard
        ↓
6. Show income / expenses / savings
        ↓
7. Show spending categories
        ↓
8. Show recurring payments
        ↓
9. Show upcoming obligations
        ↓
10. Show unusual spending
        ↓
11. Open AI Insights
        ↓
12. Show "Why FinPilot flagged this"
        ↓
13. Open Forecast
        ↓
14. Ask Copilot:
       "Where did I spend the most this month?"
        ↓
15. Ask:
       "Which subscriptions am I paying for?"
        ↓
16. Create a financial goal
        ↓
17. Open Goal Plan
        ↓
18. Run a What-If simulation
        ↓
19. Show monthly summary and action items
```

---

# Sample Financial Scenario

A sample dataset can demonstrate a financial profile such as:

```text
Income
₹5,10,000

Expenses
₹4,38,942

Savings
₹71,058

Savings Rate
13.9%
```

Major categories can include:

```text
Housing
Shopping
Groceries
Food
Travel
Transport
Utilities
Health
Subscriptions
Education
Entertainment
```

The dataset can also demonstrate:

* Recurring subscriptions
* Large unusual purchases
* Budget pressure
* Savings opportunities
* Goal planning
* What-if scenarios

---

# Repository Safety

Before pushing the project to GitHub, verify that sensitive files are excluded.

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
.venv/
__pycache__/
*.pyc
.env
.env.local
```

Never commit:

```text
OPENROUTER_API_KEY
API tokens
Private credentials
Personal financial statements
Sensitive user data
```

Use synthetic/sample transaction data for the public repository.

---

# Development Philosophy

FinPilot was built as a decision-support system rather than simply an expense tracker.

The architecture intentionally separates:

```text
Data ingestion
      ↓
Validation
      ↓
Financial computation
      ↓
Pattern detection
      ↓
AI reasoning
      ↓
Explanation
      ↓
User decision
```

This separation makes the system easier to reason about, test, and extend.

---

# Conclusion

FinPilot transforms raw financial transaction data into an intelligent personal finance decision-support experience.

It helps users:

* Understand spending
* Identify recurring commitments
* Detect unusual transactions
* Monitor budgets
* Anticipate obligations
* Explore financial goals
* Simulate spending changes
* Ask financial questions naturally
* Receive explainable insights
* Review actionable monthly observations

Rather than simply showing users more financial data, FinPilot focuses on helping them **understand what their data means and explore the decisions that follow from it**.

---

## FinPilot

**Understand your money.
Anticipate what's coming.
Decide with confidence.**
