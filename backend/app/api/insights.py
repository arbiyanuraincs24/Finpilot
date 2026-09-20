from fastapi import APIRouter, HTTPException

from app.services.insights import generate_insights

router = APIRouter()


@router.post("/insights")
async def get_insights(data: dict):
    try:
        transactions = data.get(
            "transactions",
            []
        )

        summary = data.get(
            "summary",
            {}
        )

        if not transactions:
            raise HTTPException(
                status_code=400,
                detail="No transactions provided"
            )

        result = generate_insights(
            transactions,
            summary
        )

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Could not generate insights: {str(error)}"
        )