from collections import defaultdict
from datetime import datetime


RECURRING_KEYWORDS = [
    "netflix",
    "spotify",
    "prime",
    "hotstar",
    "youtube",
    "jio",
    "airtel",
    "bescom",
    "electricity",
    "water",
    "gas",
    "rent",
    "insurance",
    "loan",
    "emi",
    "subscription",
]


def normalize_description(description):
    return str(description).strip().lower()


def is_recurring_description(description):
    description = normalize_description(description)

    return any(
        keyword in description
        for keyword in RECURRING_KEYWORDS
    )


def parse_date(value):
    try:
        return datetime.strptime(
            str(value),
            "%Y-%m-%d"
        )
    except (ValueError, TypeError):
        return None


def calculate_day_gap(first_date, second_date):
    if not first_date or not second_date:
        return None

    return abs(
        (second_date - first_date).days
    )


def is_recurring_group(items):
    """
    Determines whether a group of transactions
    looks like a recurring financial commitment.
    """

    if len(items) < 2:
        return False

    if not is_recurring_description(
        items[0].get("description", "")
    ):
        return False

    dated_items = []

    for item in items:

        date = parse_date(
            item.get("date")
        )

        if date:
            dated_items.append(
                (date, item)
            )

    if len(dated_items) < 2:
        return False

    dated_items.sort(
        key=lambda value: value[0]
    )

    gaps = []

    for index in range(
        1,
        len(dated_items)
    ):
        gap = calculate_day_gap(
            dated_items[index - 1][0],
            dated_items[index][0]
        )

        if gap is not None:
            gaps.append(gap)

    if not gaps:
        return False

    if any(gap < 7 for gap in gaps):
        return False

    amounts = []

    for _, item in dated_items:

        try:
            amounts.append(
                float(item["amount"])
            )

        except (
            TypeError,
            ValueError
        ):
            continue

    if not amounts:
        return False

    average_amount = (
        sum(amounts) /
        len(amounts)
    )

    if average_amount <= 0:
        return False

    maximum_difference = max(
        abs(
            amount -
            average_amount
        )
        for amount in amounts
    )

    amount_variation = (
        maximum_difference /
        average_amount
    )

    if amount_variation > 0.50:
        return False

    return True


# =========================================================
# MONTHLY FINANCIAL SUMMARY
# =========================================================

def calculate_monthly_summary(transactions):
    """
    Calculates monthly income, expenses, savings
    and savings rate from the uploaded transactions.
    """

    monthly = defaultdict(
        lambda: {
            "income": 0.0,
            "expenses": 0.0,
        }
    )

    for transaction in transactions:

        date_value = str(
            transaction.get(
                "date",
                ""
            )
        ).strip()

        if not date_value:
            continue

        parsed_date = parse_date(
            date_value
        )

        if not parsed_date:
            continue

        month_key = parsed_date.strftime(
            "%Y-%m"
        )

        try:
            amount = float(
                transaction.get(
                    "amount",
                    0
                )
            )

        except (
            TypeError,
            ValueError
        ):
            continue

        transaction_type = str(
            transaction.get(
                "transaction_type",
                ""
            )
        ).strip().lower()

        if transaction_type == "income":

            monthly[
                month_key
            ]["income"] += amount

        elif transaction_type == "expense":

            monthly[
                month_key
            ]["expenses"] += amount

    monthly_summary = []

    for month in sorted(
        monthly.keys()
    ):

        income = monthly[
            month
        ]["income"]

        expenses = monthly[
            month
        ]["expenses"]

        savings = (
            income -
            expenses
        )

        if income > 0:

            savings_rate = (
                savings /
                income
            ) * 100

        else:

            savings_rate = 0

        monthly_summary.append({
            "month": month,

            "income": round(
                income,
                2
            ),

            "expenses": round(
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
        })

    return monthly_summary


# =========================================================
# MONTH-OVER-MONTH ANALYSIS
# =========================================================

def calculate_monthly_changes(
    monthly_summary
):
    """
    Compares each month with the previous month.

    The first month has no previous-month comparison.
    """

    results = []

    for index, current in enumerate(
        monthly_summary
    ):

        result = {
            **current,
            "previous_month": None,
            "expense_change": None,
            "expense_change_percent": None,
            "savings_change": None,
            "savings_change_percent": None,
        }

        if index > 0:

            previous = monthly_summary[
                index - 1
            ]

            result[
                "previous_month"
            ] = previous["month"]

            current_expenses = float(
                current["expenses"]
            )

            previous_expenses = float(
                previous["expenses"]
            )

            expense_change = (
                current_expenses -
                previous_expenses
            )

            result[
                "expense_change"
            ] = round(
                expense_change,
                2
            )

            if previous_expenses != 0:

                result[
                    "expense_change_percent"
                ] = round(
                    (
                        expense_change /
                        previous_expenses
                    ) * 100,
                    2
                )

            current_savings = float(
                current["savings"]
            )

            previous_savings = float(
                previous["savings"]
            )

            savings_change = (
                current_savings -
                previous_savings
            )

            result[
                "savings_change"
            ] = round(
                savings_change,
                2
            )

            if previous_savings != 0:

                result[
                    "savings_change_percent"
                ] = round(
                    (
                        savings_change /
                        abs(previous_savings)
                    ) * 100,
                    2
                )

        results.append(result)

    return results


# =========================================================
# ACTION ITEMS
# =========================================================

def generate_action_items(
    summary,
    insights,
    recurring_payments,
    unusual_transactions,
):
    """
    Converts detected financial patterns
    into concrete, explainable action items.
    """

    actions = []

    category_totals = summary.get(
        "category_totals",
        {}
    )

    total_income = float(
        summary.get(
            "total_income",
            0
        ) or 0
    )

    total_expenses = float(
        summary.get(
            "total_expenses",
            0
        ) or 0
    )

    savings = float(
        summary.get(
            "savings",
            0
        ) or 0
    )

    savings_rate = float(
        summary.get(
            "savings_rate",
            0
        ) or 0
    )

    # ---------------------------------------------------------
    # 1. SAVINGS HEALTH
    # ---------------------------------------------------------

    if total_income > 0:

        if savings <= 0:

            actions.append({
                "type": "savings",
                "priority": "high",
                "title": (
                    "Review your monthly spending."
                ),
                "description": (
                    "Your current expenses are consuming "
                    "most or all of your recorded income. "
                    "Review the largest spending categories "
                    "before increasing discretionary spending."
                ),
            })

        elif savings_rate < 10:

            actions.append({
                "type": "savings",
                "priority": "high",
                "title": (
                    "Build more monthly savings."
                ),
                "description": (
                    f"Your current savings rate is "
                    f"{savings_rate:.1f}%. "
                    "Review discretionary expenses and "
                    "look for opportunities to increase "
                    "your monthly savings buffer."
                ),
            })

        elif savings_rate < 20:

            actions.append({
                "type": "savings",
                "priority": "medium",
                "title": (
                    "Look for ways to strengthen savings."
                ),
                "description": (
                    f"You are currently saving "
                    f"{savings_rate:.1f}% of recorded income. "
                    "Small reductions in discretionary "
                    "spending could increase your savings buffer."
                ),
            })

        else:

            actions.append({
                "type": "savings",
                "priority": "low",
                "title": (
                    "Protect your current savings rate."
                ),
                "description": (
                    f"Your current savings rate is "
                    f"{savings_rate:.1f}%. "
                    "Continue monitoring spending so "
                    "large one-off expenses do not reduce "
                    "your savings buffer."
                ),
            })

    # ---------------------------------------------------------
    # 2. LARGEST SPENDING CATEGORY
    # ---------------------------------------------------------

    if category_totals:

        largest_category = max(
            category_totals,
            key=category_totals.get
        )

        largest_amount = float(
            category_totals[
                largest_category
            ]
        )

        if largest_amount > 0:

            actions.append({
                "type": "spending",
                "priority": "medium",
                "title": (
                    f"Review {largest_category.lower()} spending."
                ),
                "description": (
                    f"{largest_category} is your largest "
                    f"recorded spending category at "
                    f"₹{largest_amount:,.0f}. "
                    "Review recent transactions in this "
                    "category to identify avoidable expenses."
                ),
            })

    # ---------------------------------------------------------
    # 3. RECURRING PAYMENTS
    # ---------------------------------------------------------

    if recurring_payments:

        recurring_total = sum(
            float(
                item.get(
                    "amount",
                    0
                ) or 0
            )
            for item in recurring_payments
        )

        actions.append({
            "type": "recurring",
            "priority": "medium",
            "title": (
                "Review recurring commitments."
            ),
            "description": (
                f"FinPilot detected "
                f"{len(recurring_payments)} recurring "
                f"payment(s). Their latest recorded "
                f"payments total approximately "
                f"₹{recurring_total:,.0f}. "
                "Review whether each commitment is still necessary."
            ),
        })

    # ---------------------------------------------------------
    # 4. UNUSUAL SPENDING
    # ---------------------------------------------------------

    if unusual_transactions:

        largest_anomaly = max(
            unusual_transactions,
            key=lambda item: float(
                item.get(
                    "amount",
                    0
                ) or 0
            )
        )

        description = largest_anomaly.get(
            "description",
            "an unusual transaction"
        )

        amount = float(
            largest_anomaly.get(
                "amount",
                0
            ) or 0
        )

        actions.append({
            "type": "anomaly",
            "priority": "high",
            "title": (
                "Review unusual spending."
            ),
            "description": (
                f"{description} was recorded at "
                f"₹{amount:,.0f}, which is unusually "
                "large compared with spending in its category. "
                "Confirm that the transaction is expected."
            ),
        })

    # ---------------------------------------------------------
    # 5. POTENTIAL SAVINGS
    # ---------------------------------------------------------

    shopping_spending = float(
        category_totals.get(
            "Shopping",
            0
        ) or 0
    )

    if shopping_spending > 0:

        potential_savings = (
            shopping_spending * 0.15
        )

        actions.append({
            "type": "opportunity",
            "priority": "medium",
            "title": (
                "Explore a shopping reduction."
            ),
            "description": (
                f"A 15% reduction in recorded Shopping "
                f"spending could represent approximately "
                f"₹{potential_savings:,.0f} in savings "
                "over the selected period."
            ),
        })

    # ---------------------------------------------------------
    # LIMIT ACTION ITEMS
    # ---------------------------------------------------------

    priority_order = {
        "high": 0,
        "medium": 1,
        "low": 2,
    }

    actions.sort(
        key=lambda action: (
            priority_order.get(
                action["priority"],
                3
            )
        )
    )

    return actions[:5]


# =========================================================
# MAIN INSIGHT GENERATOR
# =========================================================

def generate_insights(
    transactions,
    summary
):
    insights = []

    # ---------------------------------------------------------
    # MONTHLY SUMMARY
    # ---------------------------------------------------------

    monthly_summary = calculate_monthly_summary(
        transactions
    )

    monthly_changes = calculate_monthly_changes(
        monthly_summary
    )

    # ---------------------------------------------------------
    # 1. LARGEST SPENDING CATEGORY
    # ---------------------------------------------------------

    category_totals = summary.get(
        "category_totals",
        {}
    )

    if category_totals:

        largest_category = max(
            category_totals,
            key=category_totals.get
        )

        largest_amount = category_totals[
            largest_category
        ]

        insights.append({
            "type": "spending_pattern",
            "title": (
                f"{largest_category} is your "
                "largest spending category."
            ),
            "description": (
                f"You spent ₹{largest_amount:,.0f} "
                f"on {largest_category.lower()} "
                "during the selected period."
            ),
            "severity": "info"
        })

    # ---------------------------------------------------------
    # 2. SMART RECURRING PAYMENT DETECTION
    # ---------------------------------------------------------

    description_groups = defaultdict(list)

    for transaction in transactions:

        if transaction.get(
            "transaction_type"
        ) == "income":
            continue

        description = normalize_description(
            transaction.get(
                "description",
                ""
            )
        )

        if description:

            description_groups[
                description
            ].append(transaction)

    recurring_payments = []

    for description, items in (
        description_groups.items()
    ):

        if is_recurring_group(items):

            sorted_items = sorted(
                items,
                key=lambda item: (
                    parse_date(
                        item.get("date")
                    ) or datetime.min
                )
            )

            recurring_payments.append({
                "description":
                    sorted_items[-1][
                        "description"
                    ],

                "count":
                    len(sorted_items),

                "amount":
                    sorted_items[-1][
                        "amount"
                    ]
            })

    if recurring_payments:

        insights.append({
            "type": "recurring",
            "title": (
                f"{len(recurring_payments)} recurring "
                "payments detected."
            ),
            "description": (
                "FinPilot identified repeated financial "
                "commitments based on merchant patterns, "
                "timing and payment amounts."
            ),
            "severity": "info",
            "items": recurring_payments
        })

    # ---------------------------------------------------------
    # 3. CATEGORY-BASED ANOMALY DETECTION
    # ---------------------------------------------------------

    category_transactions = defaultdict(list)

    for transaction in transactions:

        if transaction.get(
            "transaction_type"
        ) == "income":
            continue

        category = transaction.get(
            "category",
            "Other"
        )

        category_transactions[
            category
        ].append(transaction)

    unusual_transactions = []

    for category, items in (
        category_transactions.items()
    ):

        amounts = []

        for item in items:

            try:
                amounts.append(
                    float(
                        item["amount"]
                    )
                )

            except (
                TypeError,
                ValueError
            ):
                continue

        if len(amounts) < 2:
            continue

        category_average = (
            sum(amounts) /
            len(amounts)
        )

        for transaction in items:

            try:
                amount = float(
                    transaction["amount"]
                )

            except (
                TypeError,
                ValueError
            ):
                continue

            if amount > (
                category_average * 2
            ):

                unusual_transactions.append(
                    transaction
                )

    if unusual_transactions:

        insights.append({
            "type": "anomaly",
            "title": (
                f"{len(unusual_transactions)} "
                "unusually large transaction(s) detected."
            ),
            "description": (
                "These transactions are significantly "
                "larger than your typical spending "
                "within their category."
            ),
            "severity": "warning",
            "items": unusual_transactions
        })

    # ---------------------------------------------------------
    # 4. SAVINGS OPPORTUNITY
    # ---------------------------------------------------------

    shopping_spending = category_totals.get(
        "Shopping",
        0
    )

    if shopping_spending > 0:

        potential_savings = (
            shopping_spending * 0.15
        )

        insights.append({
            "type": "savings_opportunity",
            "title": (
                "You may be able to reduce "
                "shopping expenses."
            ),
            "description": (
                f"Reducing shopping spending by 15% "
                f"could save approximately "
                f"₹{potential_savings:,.0f} "
                "over the selected period."
            ),
            "severity": "positive",
            "potential_savings": round(
                potential_savings,
                2
            )
        })

    # ---------------------------------------------------------
    # 5. ACTION ITEMS
    # ---------------------------------------------------------

    action_items = generate_action_items(
        summary,
        insights,
        recurring_payments,
        unusual_transactions,
    )

    # ---------------------------------------------------------
    # 6. OVERALL RESULT
    # ---------------------------------------------------------

    return {
        "insights": insights,
        "insight_count": len(insights),

        "action_items": action_items,
        "action_item_count": len(action_items),

        "monthly_summary": monthly_summary,

        "monthly_changes": monthly_changes,

        "monthly_summary_count": len(
            monthly_summary
        ),
    }