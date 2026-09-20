from fastapi import APIRouter, HTTPException

from app.services.expectations import generate_expectations


router = APIRouter()


@router.post("/expectations")
async def get_expectations(data: dict):

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

        result = generate_expectations(
            transactions
        )

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Could not generate expectations: "
                f"{str(error)}"
            )
        )