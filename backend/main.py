from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.insights import router as insights_router
from app.api.forecast import router as forecast_router
from app.api.copilot import router as copilot_router
from app.api.expectations import router as expectations_router
from app.api.anomalies import router as anomalies_router


app = FastAPI(
    title="FinPilot API",
    description="AI-powered personal finance decision support agent",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    upload_router,
    prefix="/api"
)


app.include_router(
    insights_router,
    prefix="/api"
)


app.include_router(
    forecast_router,
    prefix="/api"
)


app.include_router(
    copilot_router,
    prefix="/api"
)


app.include_router(
    expectations_router,
    prefix="/api"
)


app.include_router(
    anomalies_router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "FinPilot API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinPilot Backend"
    }