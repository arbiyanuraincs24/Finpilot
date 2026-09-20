from fastapi import APIRouter, HTTPException

from app.services.anomalies import detect_anomalies


router = APIRouter()


@router.post("/anomalies")
async def get_anomalies(data: dict):

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

        result = detect_anomalies(
            transactions
        )

        return result

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=(
                "Could not detect unusual spending: "
                f"{str(error)}"
            )
        )