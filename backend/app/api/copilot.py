from fastapi import APIRouter, HTTPException

from app.services.copilot import ask_copilot


router = APIRouter()


@router.post("/copilot")
async def copilot(data: dict):

    question = str(
        data.get(
            "question",
            ""
        )
    ).strip()

    transactions = data.get(
        "transactions",
        []
    )

    summary = data.get(
        "summary"
    )

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required"
        )

    if not transactions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Please import a financial "
                "statement first."
            )
        )

    try:

        result = await ask_copilot(
            question=question,
            transactions=transactions,
            summary=summary
        )

        return result

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Copilot failed: {str(error)}"
            )
        )