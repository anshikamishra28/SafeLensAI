from datetime import datetime, timezone

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from models.safety import Location, SafetyAssessment, Evidence
from services.geocoding import geocode_location
from services.weather import get_current_weather
from services.places import get_nearby_places
app = FastAPI(
    title="SafeLens AI API",
    description="Backend API for the SafeLens AI safety intelligence platform.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.get("/api/v1/safety", response_model=SafetyAssessment)
def get_safety(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    location = Location(
        latitude=latitude,
        longitude=longitude,
    )
@app.get("/api/v1/geocode")
async def geocode(q: str = Query(..., min_length=2)):
    result = await geocode_location(q)

    if result is None:
        return {
            "found": False,
            "query": q,
        }

    return {
        "found": True,
        "query": q,
        **result,
    }
    return SafetyAssessment(
        location=location,
        score=None,
        confidence=0.0,
        risk_level="unknown",
        factors=["No safety data has been collected yet"],
        assessed_at=datetime.now(timezone.utc),
    )
@app.get("/api/v1/weather")
async def weather(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    result = await get_current_weather(latitude, longitude)

    if result is None:
        return {
            "found": False,
            "latitude": latitude,
            "longitude": longitude,
        }

    return {
        "found": True,
        "requested_location": {
            "latitude": latitude,
            "longitude": longitude,
        },
        "weather": result,
    }
@app.get("/api/v1/places")
async def nearby_places(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_m: int = Query(1000, ge=100, le=5000),
):
    places = await get_nearby_places(
        latitude,
        longitude,
        radius_m,
    )

    return {
        "latitude": latitude,
        "longitude": longitude,
        "radius_m": radius_m,
        "source": "openstreetmap",
        "count": len(places),
        "places": [
            place.model_dump()
            for place in places
        ],
    }
@app.get("/api/v1/context")
async def get_safety_context(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_m: int = Query(1000, ge=100, le=5000),
):
    observed_at = datetime.now(timezone.utc)

    location = Location(
        latitude=latitude,
        longitude=longitude,
    )

    weather = await get_current_weather(
        latitude,
        longitude,
    )

    places = await get_nearby_places(
        latitude,
        longitude,
        radius_m,
    )

    evidence = []

    if weather is not None:
        evidence.append(
            Evidence(
                type="weather",
                status="available",
                source="open-meteo",
                observed_at=(
                    datetime.fromisoformat(
                        weather["observed_at"]
                    ).replace(tzinfo=timezone.utc)
                    if weather.get("observed_at")
                    else None
                ),
                data=weather,
            )
        )
    else:
        evidence.append(
            Evidence(
                type="weather",
                status="unavailable",
                source="open-meteo",
                observed_at=None,
                data={},
            )
        )

    evidence.append(
        Evidence(
            type="nearby_places",
            status="available" if places else "no_data",
            source="openstreetmap",
            observed_at=observed_at,
            data={
                "radius_m": radius_m,
                "count": len(places),
                "places": [
                    place.model_dump()
                    for place in places
                ],
            },
        )
    )

    return {
        "location": location.model_dump(),
        "observed_at": observed_at,
        "evidence": [
            item.model_dump()
            for item in evidence
        ],
        "nearby_places": [
            place.model_dump()
            for place in places
        ],
        "data_sources": sorted(
            {
                item.source
                for item in evidence
                if item.status == "available"
            }
        ),
    }