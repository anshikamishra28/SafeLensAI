import httpx


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def get_current_weather(
    latitude: float,
    longitude: float,
):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "precipitation,"
            "wind_speed_10m,"
            "weather_code,"
            "visibility"
        ),
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            OPEN_METEO_URL,
            params=params,
        )

    response.raise_for_status()

    data = response.json()
    current = data.get("current")

    if not current:
        return None

    return {
        "source": "open-meteo",
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "observed_at": current.get("time"),
        "temperature_c": current.get("temperature_2m"),
        "precipitation_mm": current.get("precipitation"),
        "wind_speed_kmh": current.get("wind_speed_10m"),
        "weather_code": current.get("weather_code"),
        "visibility_m": current.get("visibility"),
    }