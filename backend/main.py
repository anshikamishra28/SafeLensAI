from fastapi import FastAPI

app = FastAPI(
    title="SafeLens AI API",
    description="Backend API for the SafeLens AI safety intelligence platform.",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "SafeLens AI API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "safelens-api",
    }