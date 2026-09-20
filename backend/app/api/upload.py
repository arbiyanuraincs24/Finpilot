from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.parser import parse_csv_file
from app.services.categorizer import categorize_transaction
from app.services.analytics import calculate_financial_summary


router = APIRouter()


VALID_TRANSACTION_TYPES = {
    "income",
    "expense",
}


def is_valid_date(value):
    """
    Validate common date formats while keeping the
    original value for the existing frontend response.
    """

    if value is None:
        return False

    value = str(value).strip()

    if not value:
        return False

    try:
        parsed = datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )

        return parsed is not None

    except ValueError:
        pass

    common_formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%Y/%m/%d",
        "%d-%b-%Y",
        "%d %b %Y",
    ]

    for date_format in common_formats:
        try:
            datetime.strptime(
                value,
                date_format
            )
            return True
        except ValueError:
            continue

    return False


def normalize_amount(value):
    """
    Convert common amount representations such as
    '₹12,500' or '12,500.50' into a float.
    """

    if value is None:
        raise ValueError(
            "Amount is required."
        )

    if isinstance(value, str):
        cleaned = (
            value
            .strip()
            .replace("₹", "")
            .replace(",", "")
            .replace("$", "")
            .replace("€", "")
            .replace("£", "")
        )

        if not cleaned:
            raise ValueError(
                "Amount is required."
            )

        value = cleaned

    try:
        amount = float(value)
    except (TypeError, ValueError):
        raise ValueError(
            "Amount must be a valid number."
        )

    if not amount == amount:
        raise ValueError(
            "Amount must be a valid number."
        )

    if amount <= 0:
        raise ValueError(
            "Amount must be greater than zero."
        )

    return amount


def create_duplicate_key(
    date,
    description,
    amount,
    transaction_type,
):
    return (
        str(date).strip().lower(),
        str(description).strip().lower(),
        round(float(amount), 2),
        str(transaction_type).strip().lower(),
    )


@router.post("/upload/csv")
async def upload_csv(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a CSV file."
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded CSV file is empty."
        )

    try:
        df = parse_csv_file(content)

        transactions = []
        validation_errors = []
        duplicate_rows = []

        seen_transactions = set()

        for index, row in df.iterrows():

            # CSV rows are 0-indexed internally.
            # Add 2 so the number matches the actual
            # spreadsheet row including the header.
            row_number = index + 2

            # -----------------------------
            # DATE
            # -----------------------------

            raw_date = row.get("date")

            if pd_is_missing(raw_date):
                validation_errors.append({
                    "row": row_number,
                    "field": "date",
                    "message": "Date is required."
                })
                continue

            date_value = str(
                raw_date
            ).strip()

            if not is_valid_date(date_value):
                validation_errors.append({
                    "row": row_number,
                    "field": "date",
                    "message": (
                        "Date must be a valid date."
                    )
                })
                continue

            # -----------------------------
            # DESCRIPTION
            # -----------------------------

            raw_description = row.get(
                "description"
            )

            if pd_is_missing(
                raw_description
            ):
                validation_errors.append({
                    "row": row_number,
                    "field": "description",
                    "message": (
                        "Description is required."
                    )
                })
                continue

            description = str(
                raw_description
            ).strip()

            if not description:
                validation_errors.append({
                    "row": row_number,
                    "field": "description",
                    "message": (
                        "Description is required."
                    )
                })
                continue

            # -----------------------------
            # AMOUNT
            # -----------------------------

            raw_amount = row.get("amount")

            try:
                amount = normalize_amount(
                    raw_amount
                )
            except ValueError as error:
                validation_errors.append({
                    "row": row_number,
                    "field": "amount",
                    "message": str(error)
                })
                continue

            # -----------------------------
            # TRANSACTION TYPE
            # -----------------------------

            raw_transaction_type = row.get(
                "transaction_type"
            )

            if pd_is_missing(
                raw_transaction_type
            ):
                validation_errors.append({
                    "row": row_number,
                    "field": "transaction_type",
                    "message": (
                        "Transaction type is required."
                    )
                })
                continue

            transaction_type = str(
                raw_transaction_type
            ).strip().lower()

            if transaction_type not in VALID_TRANSACTION_TYPES:
                validation_errors.append({
                    "row": row_number,
                    "field": "transaction_type",
                    "message": (
                        "Transaction type must be "
                        "'income' or 'expense'."
                    )
                })
                continue

            # -----------------------------
            # DUPLICATE CHECK
            # -----------------------------

            duplicate_key = create_duplicate_key(
                date_value,
                description,
                amount,
                transaction_type,
            )

            if duplicate_key in seen_transactions:

                duplicate_rows.append(
                    row_number
                )

                validation_errors.append({
                    "row": row_number,
                    "field": "transaction",
                    "message": (
                        "Duplicate transaction detected."
                    )
                })

                continue

            seen_transactions.add(
                duplicate_key
            )

            # -----------------------------
            # CATEGORIZATION
            # -----------------------------

            category = categorize_transaction(
                description,
                transaction_type
            )

            transactions.append({
                "date": date_value,
                "description": description,
                "amount": amount,
                "transaction_type": transaction_type,
                "category": category
            })

        # ---------------------------------
        # IF ANY VALIDATION ERRORS EXIST
        # ---------------------------------

        if validation_errors:

            raise HTTPException(
                status_code=400,
                detail={
                    "message": (
                        "CSV validation failed. "
                        "Please correct the highlighted "
                        "rows and upload the file again."
                    ),
                    "validation": {
                        "total_rows": len(df),
                        "valid_rows": len(transactions),
                        "invalid_rows": len(
                            validation_errors
                        ),
                        "duplicate_rows": len(
                            duplicate_rows
                        ),
                        "errors": validation_errors,
                    }
                }
            )

        # ---------------------------------
        # FINANCIAL ANALYSIS
        # ---------------------------------

        summary = calculate_financial_summary(
            transactions
        )

        return {
            "filename": file.filename,
            "rows": len(transactions),
            "summary": summary,
            "transactions": transactions,
            "validation": {
                "total_rows": len(df),
                "valid_rows": len(transactions),
                "invalid_rows": 0,
                "duplicate_rows": 0,
                "errors": []
            }
        }

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Could not process CSV: "
                f"{str(error)}"
            )
        )


def pd_is_missing(value):
    """
    Safely detect pandas NaN/NaT/None values.
    """

    if value is None:
        return True

    try:
        return bool(
            __import__("pandas").isna(value)
        )
    except (TypeError, ValueError):
        return False