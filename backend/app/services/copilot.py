from collections import defaultdict
from datetime import datetime
import json
import os

import httpx


OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "openrouter/free"
)


def safe_float(value):
    try:
        return float(value)
    except (
        TypeError,
        ValueError
    ):
        return 0.0


def normalize_type(value):
    return str(
        value or ""
    ).strip().lower()


def normalize_category(value):
    category = str(
        value or "Other"
    ).strip()

    return category or "Other"


def parse_date(value):
    try:
        return datetime.strptime(
            str(value),
            "%Y-%m-%d"
        )
    except (
        TypeError,
        ValueError
    ):
        return None


def calculate_category_totals(
    transactions
):
    totals = defaultdict(float)

    for transaction in transactions:

        if normalize_type(
            transaction.get(
                "transaction_type"
            )
        ) != "expense":
            continue

        category = normalize_category(
            transaction.get(
                "category"
            )
        )

        totals[category] += safe_float(
            transaction.get(
                "amount"
            )
        )

    return dict(
        sorted(
            totals.items(),
            key=lambda item: item[1],
            reverse=True
        )
    )


def calculate_monthly_financials(
    transactions
):
    monthly = defaultdict(
        lambda: {
            "income": 0.0,
            "expenses": 0.0,
            "savings": 0.0,
        }
    )

    for transaction in transactions:

        date = parse_date(
            transaction.get("date")
        )

        if not date:
            continue

        month = date.strftime(
            "%Y-%m"
        )

        amount = safe_float(
            transaction.get("amount")
        )

        transaction_type = normalize_type(
            transaction.get(
                "transaction_type"
            )
        )

        if transaction_type == "income":

            monthly[month][
                "income"
            ] += amount

        elif transaction_type == "expense":

            monthly[month][
                "expenses"
            ] += amount

    for month in monthly:

        monthly[month][
            "savings"
        ] = (
            monthly[month]["income"]
            -
            monthly[month]["expenses"]
        )

    return dict(
        sorted(
            monthly.items()
        )
    )


def calculate_transaction_summary(
    transactions
):
    income = 0.0
    expenses = 0.0

    for transaction in transactions:

        amount = safe_float(
            transaction.get("amount")
        )

        transaction_type = normalize_type(
            transaction.get(
                "transaction_type"
            )
        )

        if transaction_type == "income":

            income += amount

        elif transaction_type == "expense":

            expenses += amount

    savings = income - expenses

    savings_rate = (
        (savings / income) * 100
        if income > 0
        else 0
    )

    return {
        "total_income": round(
            income,
            2
        ),
        "total_expenses": round(
            expenses,
            2
        ),
        "savings": round(
            savings,
            2
        ),
        "savings_rate": round(
            savings_rate,
            2
        ),
    }


def build_financial_context(
    transactions,
    summary=None
):
    calculated_summary = (
        calculate_transaction_summary(
            transactions
        )
    )

    category_totals = (
        calculate_category_totals(
            transactions
        )
    )

    monthly_financials = (
        calculate_monthly_financials(
            transactions
        )
    )

    if summary:
        calculated_summary.update({
            key: value
            for key, value in summary.items()
            if value is not None
        })

    return {
        "summary": calculated_summary,
        "category_totals": {
            key: round(
                value,
                2
            )
            for key, value
            in category_totals.items()
        },
        "monthly_financials":
            monthly_financials,
        "transaction_count":
            len(transactions),
        "transactions": transactions,
    }


def build_system_prompt(
    financial_context
):
    return f"""
You are FinPilot, an AI personal finance
decision-support assistant.

Your job is to answer the user's financial
questions using ONLY the financial data provided
in the user's imported transaction history.

Do not invent financial numbers.

Do not assume income, expenses, purchases,
subscriptions, savings, or categories that are
not present in the data.

If the data is insufficient to answer a question,
say clearly what information is missing.

==================================================
FINANCIAL DATA
==================================================

{json.dumps(
    financial_context,
    indent=2,
    default=str
)}

==================================================
ANSWERING RULES
==================================================

1. ALWAYS use the provided financial data.

2. Calculate numbers yourself when necessary.

3. Never use hard-coded sample values.

4. When discussing savings opportunities,
   prioritize discretionary expenses such as:

   - Shopping
   - Food
   - Entertainment
   - Subscriptions
   - Other variable spending

   Do not automatically recommend cutting
   essential expenses such as rent or utilities.

5. Identify patterns from monthly data.

6. Compare categories when useful.

7. If recommending a reduction, calculate the
   approximate amount saved.

8. Show the calculation when it helps the user
   understand the recommendation.

9. Use Indian Rupee formatting.

10. Be practical rather than generic.

11. Do not claim certainty when the data does
    not support it.

12. Never invent merchants or transactions.

13. If the user asks "how can I save more",
    analyze:

    - current savings
    - savings rate
    - largest variable categories
    - monthly spending changes
    - recurring expenses

    Then identify the largest realistic
    opportunities.

14. If the user asks about a particular category,
    calculate its total and monthly average from
    the transaction data.

15. If the user asks whether they can afford
    something, consider:

    - current income
    - current expenses
    - current savings
    - upcoming commitments if provided

16. Give direct answers first.

17. Use headings and bullet points when useful.

18. Do not overwhelm the user with irrelevant
    transaction-level information.

==================================================
STYLE
==================================================

Sound like a smart financial assistant.

Be:

- clear
- concise
- practical
- data-driven
- transparent

When useful, structure answers as:

Current picture
↓
What the data shows
↓
Where the opportunity is
↓
Possible impact
↓
Practical next step

Remember:

You are providing financial decision support,
not making decisions for the user.
"""


async def ask_copilot(
    question,
    transactions,
    summary=None
):

    if not transactions:

        return {
            "answer": (
                "Please import a financial "
                "statement first so I can analyze "
                "your actual spending and income."
            )
        }

    financial_context = (
        build_financial_context(
            transactions,
            summary
        )
    )

    system_prompt = (
        build_system_prompt(
            financial_context
        )
    )

    if not OPENROUTER_API_KEY:

        return {
            "answer": (
                "OpenRouter API key is not configured."
            )
        }

    payload = {

        "model":
            OPENROUTER_MODEL,

        "messages": [

            {
                "role": "system",
                "content":
                    system_prompt,
            },

            {
                "role": "user",
                "content":
                    question,
            },

        ],

        "temperature": 0.2,

    }

    headers = {

        "Authorization":
            f"Bearer {OPENROUTER_API_KEY}",

        "Content-Type":
            "application/json",

    }

    async with httpx.AsyncClient(
        timeout=60
    ) as client:

        response = await client.post(

            "https://openrouter.ai/api/v1/chat/completions",

            headers=headers,

            json=payload,

        )

    if response.status_code != 200:

        return {
            "answer": (
                "I couldn't generate a response "
                "right now. Please try again."
            )
        }

    data = response.json()

    choices = data.get(
        "choices",
        []
    )

    if not choices:

        return {
            "answer": (
                "I couldn't generate a response "
                "from the financial data."
            )
        }

    message = choices[0].get(
        "message",
        {}
    )

    answer = message.get(
        "content",
        ""
    )

    if not answer:

        answer = (
            "I couldn't generate a useful "
            "answer from the available data."
        )

    return {
        "answer": answer,
        "financial_context": {
            "summary":
                financial_context[
                    "summary"
                ],
            "category_totals":
                financial_context[
                    "category_totals"
                ],
            "monthly_financials":
                financial_context[
                    "monthly_financials"
                ],
        }
    }