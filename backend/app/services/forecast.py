from collections import defaultdict
from datetime import datetime


def parse_date(value):
    try:
        return datetime.strptime(
            str(value),
            "%Y-%m-%d"
        )
    except (ValueError, TypeError):
        return None


def calculate_monthly_summary(transactions):
    monthly = defaultdict(
        lambda: {
            "income": 0,
            "expenses": 0
        }
    )

    for transaction in transactions:
        date = parse_date(
            transaction.get("date")
        )

        if not date:
            continue

        month = date.strftime("%Y-%m")

        amount = float(
            transaction.get("amount", 0)
        )

        if transaction.get(
            "transaction_type"
        ) == "income":
            monthly[month]["income"] += amount
        else:
            monthly[month]["expenses"] += amount

    return dict(monthly)


def calculate_average_monthly_expense(
    monthly_summary
):
    expenses = [
        data["expenses"]
        for data in monthly_summary.values()
        if data["expenses"] > 0
    ]

    if not expenses:
        return 0

    return sum(expenses) / len(expenses)


def calculate_average_monthly_income(
    monthly_summary
):
    incomes = [
        data["income"]
        for data in monthly_summary.values()
        if data["income"] > 0
    ]

    if not incomes:
        return 0

    return sum(incomes) / len(incomes)


def generate_forecast(transactions):
    monthly_summary = calculate_monthly_summary(
        transactions
    )

    average_income = (
        calculate_average_monthly_income(
            monthly_summary
        )
    )

    average_expenses = (
        calculate_average_monthly_expense(
            monthly_summary
        )
    )

    projected_savings = (
        average_income -
        average_expenses
    )

    return {
        "monthly_history": monthly_summary,
        "forecast": {
            "average_income": round(
                average_income,
                2
            ),
            "average_expenses": round(
                average_expenses,
                2
            ),
            "projected_savings": round(
                projected_savings,
                2
            )
        }
    }