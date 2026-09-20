def calculate_financial_summary(transactions):
    total_income = 0
    total_expenses = 0
    category_totals = {}

    for transaction in transactions:
        amount = float(transaction["amount"])
        transaction_type = str(
            transaction["transaction_type"]
        ).lower()

        category = transaction.get("category", "Other")

        if transaction_type == "income":
            total_income += amount
        else:
            total_expenses += amount

            category_totals[category] = (
                category_totals.get(category, 0) + amount
            )

    savings = total_income - total_expenses

    if total_income > 0:
        savings_rate = (savings / total_income) * 100
    else:
        savings_rate = 0

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "savings": round(savings, 2),
        "savings_rate": round(savings_rate, 2),
        "category_totals": {
            category: round(amount, 2)
            for category, amount in category_totals.items()
        }
    }