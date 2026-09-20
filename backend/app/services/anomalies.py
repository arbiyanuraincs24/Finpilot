from collections import defaultdict


def _safe_amount(transaction):
    try:
        return float(transaction.get("amount", 0))
    except (TypeError, ValueError):
        return 0.0


def _is_expense(transaction):
    return (
        str(
            transaction.get(
                "transaction_type",
                ""
            )
        ).lower()
        == "expense"
    )


def _severity(percentage_above_average):
    if percentage_above_average >= 200:
        return "high"

    if percentage_above_average >= 100:
        return "medium"

    return "low"


def detect_anomalies(transactions):
    """
    Detect unusually large expense transactions
    compared with normal spending in the same category.

    The detector is intentionally explainable:
    every anomaly includes the transaction amount,
    category average, difference and percentage deviation.
    """

    category_transactions = defaultdict(list)

    # ---------------------------------------------------------
    # 1. GROUP EXPENSES BY CATEGORY
    # ---------------------------------------------------------

    for transaction in transactions:

        if not _is_expense(transaction):
            continue

        amount = _safe_amount(transaction)

        if amount <= 0:
            continue

        category = str(
            transaction.get(
                "category",
                "Other"
            )
        ).strip()

        if not category:
            category = "Other"

        category_transactions[
            category
        ].append(transaction)

    anomalies = []

    # ---------------------------------------------------------
    # 2. ANALYZE EACH CATEGORY
    # ---------------------------------------------------------

    for category, items in category_transactions.items():

        amounts = [
            _safe_amount(item)
            for item in items
        ]

        # We need multiple transactions to establish
        # a meaningful spending baseline.
        if len(amounts) < 2:
            continue

        category_average = (
            sum(amounts) / len(amounts)
        )

        if category_average <= 0:
            continue

        # -----------------------------------------------------
        # 3. FIND UNUSUALLY LARGE TRANSACTIONS
        # -----------------------------------------------------

        for transaction in items:

            amount = _safe_amount(
                transaction
            )

            # A transaction must be at least
            # twice the category average.
            if amount <= category_average * 2:
                continue

            difference = (
                amount - category_average
            )

            percentage_above_average = (
                difference /
                category_average
            ) * 100

            severity = _severity(
                percentage_above_average
            )

            anomalies.append({
                "date": transaction.get(
                    "date"
                ),
                "description": transaction.get(
                    "description",
                    "Unknown transaction"
                ),
                "category": category,
                "amount": round(
                    amount,
                    2
                ),
                "category_average": round(
                    category_average,
                    2
                ),
                "difference": round(
                    difference,
                    2
                ),
                "percentage_above_average": round(
                    percentage_above_average,
                    2
                ),
                "severity": severity,
                "reason": (
                    f"This transaction is "
                    f"{percentage_above_average:.0f}% "
                    f"higher than your typical "
                    f"{category} spending."
                )
            })

    # ---------------------------------------------------------
    # 4. SORT MOST SIGNIFICANT FIRST
    # ---------------------------------------------------------

    anomalies.sort(
        key=lambda item: (
            item["percentage_above_average"]
        ),
        reverse=True
    )

    # ---------------------------------------------------------
    # 5. SUMMARY
    # ---------------------------------------------------------

    high_count = sum(
        1
        for anomaly in anomalies
        if anomaly["severity"] == "high"
    )

    medium_count = sum(
        1
        for anomaly in anomalies
        if anomaly["severity"] == "medium"
    )

    low_count = sum(
        1
        for anomaly in anomalies
        if anomaly["severity"] == "low"
    )

    return {
        "anomalies": anomalies,
        "anomaly_count": len(anomalies),
        "high_count": high_count,
        "medium_count": medium_count,
        "low_count": low_count,
    }