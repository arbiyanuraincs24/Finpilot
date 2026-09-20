CATEGORY_KEYWORDS = {
    "Food": [
        "swiggy",
        "zomato",
        "restaurant",
        "dominos",
        "kfc",
        "mcdonald"
    ],

    "Transport": [
        "uber",
        "ola",
        "metro",
        "bus",
        "fuel",
        "petrol",
        "rapido"
    ],

    "Shopping": [
        "amazon",
        "flipkart",
        "myntra",
        "dmart",
        "shopping",
        "laptop",
        "electronics"
    ],

    "Subscription": [
        "netflix",
        "spotify",
        "prime",
        "hotstar",
        "youtube",
        "gym membership"
    ],

    "Utilities": [
        "electricity",
        "bescom",
        "water",
        "gas",
        "recharge",
        "airtel",
        "jio",
        "internet"
    ],

    "Housing": [
        "rent",
        "house rent",
        "apartment rent"
    ],

    "Groceries": [
        "bigbasket",
        "grocery",
        "groceries"
    ],

    "Health": [
        "pharmacy",
        "doctor",
        "medical",
        "medicine",
        "hospital",
        "health"
    ],

    "Travel": [
        "flight",
        "flight booking",
        "travel",
        "travel booking",
        "trip"
    ],

    "Entertainment": [
        "movie",
        "concert",
        "cinema"
    ],

    "Education": [
        "course",
        "online course",
        "education",
        "training"
    ],

    "Investment": [
        "mutual fund",
        "investment",
        "sip"
    ],

    "Income": [
        "salary",
        "payroll",
        "income"
    ]
}


def categorize_transaction(
    description: str,
    transaction_type: str
) -> str:
    """
    Categorize a transaction based on its description.
    """

    description = str(
        description or ""
    ).lower().strip()

    transaction_type = str(
        transaction_type or ""
    ).lower().strip()

    # Income transactions
    if transaction_type == "income":
        return "Income"

    # Expense keyword matching
    for category, keywords in CATEGORY_KEYWORDS.items():

        if category == "Income":
            continue

        for keyword in keywords:

            if keyword in description:
                return category

    # Default category
    return "Other"