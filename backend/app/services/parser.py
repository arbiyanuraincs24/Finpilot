import pandas as pd
from io import BytesIO


REQUIRED_COLUMNS = {
    "date",
    "description",
    "amount",
    "transaction_type",
}


def parse_csv_file(file_bytes: bytes):

    if not file_bytes or not file_bytes.strip():
        raise ValueError("The uploaded CSV file is empty.")

    try:
        df = pd.read_csv(BytesIO(file_bytes))
    except pd.errors.EmptyDataError:
        raise ValueError("The uploaded CSV file is empty.")
    except pd.errors.ParserError:
        raise ValueError(
            "The CSV file structure is invalid or could not be parsed."
        )
    except Exception as error:
        raise ValueError(
            f"Could not read the CSV file: {str(error)}"
        )

    if df.empty:
        raise ValueError(
            "The CSV file does not contain any transaction rows."
        )

    # Normalize column names
    df.columns = [
        str(column).strip().lower().replace(" ", "_")
        for column in df.columns
    ]

    # Remove completely unnamed columns created by malformed CSV files
    df = df.loc[
        :,
        [
            column
            for column in df.columns
            if not column.startswith("unnamed:")
        ],
    ]

    if df.empty:
        raise ValueError(
            "The CSV file does not contain usable columns."
        )

    missing_columns = REQUIRED_COLUMNS - set(df.columns)

    if missing_columns:
        raise ValueError(
            "Missing required columns: "
            + ", ".join(sorted(missing_columns))
        )

    return df