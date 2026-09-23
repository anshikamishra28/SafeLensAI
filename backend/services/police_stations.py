import csv
from pathlib import Path


DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "bengaluru_police_stations.csv"
)


def get_police_stations() -> list[dict]:
    """Load Bengaluru police-station locations from the source CSV."""
    with DATA_FILE.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        stations = []

        for row in reader:
            stations.append(
                {
                    "name": row["POL_STAName"],
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                }
            )

    return stations
from math import radians, sin, cos, sqrt, atan2


def find_nearest_police_station(
    latitude: float,
    longitude: float,
) -> dict | None:
    """Find the nearest mapped police station using straight-line distance."""

    stations = get_police_stations()

    if not stations:
        return None

    earth_radius_m = 6_371_000

    lat1 = radians(latitude)
    lon1 = radians(longitude)

    nearest_station = None
    nearest_distance = float("inf")

    for station in stations:
        lat2 = radians(station["latitude"])
        lon2 = radians(station["longitude"])

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = (
            sin(dlat / 2) ** 2
            + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        )

        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance_m = earth_radius_m * c

        if distance_m < nearest_distance:
            nearest_distance = distance_m
            nearest_station = {
                **station,
                "distance_m": round(distance_m, 1),
            }

    return nearest_station