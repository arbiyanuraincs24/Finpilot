from fastapi import APIRouter, HTTPException

from app.services.forecast import generate_forecast


router = APIRouter()


@router.post("/forecast")
async def get_forecast(data: dict):
    try:
        transactions = data.get(
            "transactions",
            []
        )

        if not transactions:
            raise HTTPException(
                status_code=400,
                detail="No transactions provided"
            )

        result = generate_forecast(
            transactions
        )

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Could not generate forecast: {str(error)}"
        )