from collections import defaultdict
from datetime import datetime, timedelta


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


def parse_date(value):
    try:
        return datetime.strptime(
            str(value),
            "%Y-%m-%d"
        )
    except (ValueError, TypeError):
        return None


def normalize_description(description):
    return str(
        description
    ).strip().lower()


def is_recurring_description(
    description
):
    description = normalize_description(
        description
    )

    return any(
        keyword in description
        for keyword in RECURRING_KEYWORDS
    )


def calculate_day_gap(
    first_date,
    second_date
):
    return abs(
        (second_date - first_date).days
    )


def calculate_average_amount(
    transactions
):
    if not transactions:
        return 0

    amounts = [
        float(
            transaction.get(
                "amount",
                0
            )
        )
        for transaction in transactions
    ]

    return sum(amounts) / len(amounts)


def detect_frequency(
    transactions
):
    dated_transactions = []

    for transaction in transactions:

        date = parse_date(
            transaction.get("date")
        )

        if date:
            dated_transactions.append(
                date
            )

    if len(dated_transactions) < 2:
        return None

    dated_transactions.sort()

    gaps = []

    for index in range(
        1,
        len(dated_transactions)
    ):
        gap = calculate_day_gap(
            dated_transactions[index - 1],
            dated_transactions[index]
        )

        gaps.append(gap)

    if not gaps:
        return None

    average_gap = (
        sum(gaps) / len(gaps)
    )

    if 25 <= average_gap <= 35:
        return "monthly"

    if 6 <= average_gap <= 10:
        return "weekly"

    if 80 <= average_gap <= 100:
        return "quarterly"

    return None


def calculate_expected_day(
    transactions
):
    days = []

    for transaction in transactions:

        date = parse_date(
            transaction.get("date")
        )

        if date:
            days.append(
                date.day
            )

    if not days:
        return None

    return round(
        sum(days) / len(days)
    )


def detect_recurring_expenses(
    transactions
):
    groups = defaultdict(list)

    for transaction in transactions:

        transaction_type = str(
            transaction.get(
                "transaction_type",
                ""
            )
        ).lower()

        if transaction_type == "income":
            continue

        description = normalize_description(
            transaction.get(
                "description",
                ""
            )
        )

        if not description:
            continue

        if is_recurring_description(
            description
        ):
            groups[description].append(
                transaction
            )


    recurring = []


    for description, items in groups.items():

        if len(items) < 2:
            continue


        frequency = detect_frequency(
            items
        )

        if frequency != "monthly":
            continue


        average_amount = (
            calculate_average_amount(
                items
            )
        )


        expected_day = (
            calculate_expected_day(
                items
            )
        )


        sorted_items = sorted(
            items,
            key=lambda item:
                parse_date(
                    item.get("date")
                ) or datetime.min
        )


        last_transaction = (
            sorted_items[-1]
        )


        recurring.append({

            "description":
                last_transaction.get(
                    "description",
                    description
                ),

            "amount":
                round(
                    average_amount,
                    2
                ),

            "expected_day":
                expected_day,

            "frequency":
                frequency,

            "transaction_count":
                len(items),

            "last_date":
                last_transaction.get(
                    "date"
                ),

            "confidence":
                "high"

        })


    return recurring


def detect_recurring_income(
    transactions
):
    groups = defaultdict(list)

    for transaction in transactions:

        transaction_type = str(
            transaction.get(
                "transaction_type",
                ""
            )
        ).lower()

        if transaction_type != "income":
            continue


        description = normalize_description(
            transaction.get(
                "description",
                ""
            )
        )

        if not description:
            continue


        groups[description].append(
            transaction
        )


    recurring_income = []


    for description, items in groups.items():

        if len(items) < 2:
            continue


        frequency = detect_frequency(
            items
        )


        if frequency != "monthly":
            continue


        average_amount = (
            calculate_average_amount(
                items
            )
        )


        expected_day = (
            calculate_expected_day(
                items
            )
        )


        sorted_items = sorted(
            items,
            key=lambda item:
                parse_date(
                    item.get("date")
                ) or datetime.min
        )


        last_transaction = (
            sorted_items[-1]
        )


        recurring_income.append({

            "description":
                last_transaction.get(
                    "description",
                    description
                ),

            "amount":
                round(
                    average_amount,
                    2
                ),

            "expected_day":
                expected_day,

            "frequency":
                frequency,

            "transaction_count":
                len(items),

            "last_date":
                last_transaction.get(
                    "date"
                ),

            "confidence":
                "high"

        })


    return recurring_income


def get_next_expected_date(
    expected_day,
    last_date
):
    if not expected_day or not last_date:
        return None

    last_transaction_date = parse_date(
        last_date
    )

    if not last_transaction_date:
        return None


    year = last_transaction_date.year

    month = last_transaction_date.month


    if month == 12:

        next_year = year + 1
        next_month = 1

    else:

        next_year = year
        next_month = month + 1


    # Protect against invalid dates such as
    # the 31st in a month with fewer days.

    import calendar

    maximum_day = calendar.monthrange(
        next_year,
        next_month
    )[1]

    day = min(
        expected_day,
        maximum_day
    )


    return datetime(
        next_year,
        next_month,
        day
    )


def generate_expectations(
    transactions
):

    recurring_expenses = (
        detect_recurring_expenses(
            transactions
        )
    )


    recurring_income = (
        detect_recurring_income(
            transactions
        )
    )


    upcoming_expenses = []


    for expense in recurring_expenses:

        next_date = (
            get_next_expected_date(
                expense["expected_day"],
                expense["last_date"]
            )
        )


        if not next_date:
            continue


        upcoming_expenses.append({

            **expense,

            "expected_date":
                next_date.strftime(
                    "%Y-%m-%d"
                )

        })


    upcoming_income = []


    for income in recurring_income:

        next_date = (
            get_next_expected_date(
                income["expected_day"],
                income["last_date"]
            )
        )


        if not next_date:
            continue


        upcoming_income.append({

            **income,

            "expected_date":
                next_date.strftime(
                    "%Y-%m-%d"
                )

        })


    upcoming_expenses.sort(
        key=lambda item:
            item["expected_date"]
    )


    upcoming_income.sort(
        key=lambda item:
            item["expected_date"]
    )


    expected_expense_total = sum(
        item["amount"]
        for item in upcoming_expenses
    )


    expected_income_total = sum(
        item["amount"]
        for item in upcoming_income
    )


    return {

        "upcoming_expenses":
            upcoming_expenses,

        "expected_income":
            upcoming_income,

        "expected_expense_total":
            round(
                expected_expense_total,
                2
            ),

        "expected_income_total":
            round(
                expected_income_total,
                2
            ),

        "recurring_expense_count":
            len(recurring_expenses),

        "recurring_income_count":
            len(recurring_income),

    }