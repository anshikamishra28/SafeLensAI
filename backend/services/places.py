import math
import xml.etree.ElementTree as ET

import httpx

from models.safety import NearbyPlace


OSM_MAP_URL = "https://api.openstreetmap.org/api/0.6/map"

USER_AGENT = "SafeLensAI/0.1 (local development)"


PLACE_CATEGORIES = {
    "police": "police",
    "hospital": "hospital",
    "pharmacy": "pharmacy",
    "fire_station": "fire_station",
}


def _distance_m(
    latitude_1: float,
    longitude_1: float,
    latitude_2: float,
    longitude_2: float,
) -> float:
    """Calculate approximate great-circle distance in meters."""

    earth_radius_m = 6_371_000

    lat1 = math.radians(latitude_1)
    lat2 = math.radians(latitude_2)

    delta_lat = math.radians(latitude_2 - latitude_1)
    delta_lon = math.radians(longitude_2 - longitude_1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a),
    )

    return earth_radius_m * c


def _element_coordinates(element):
    """Extract coordinates from an OSM node/way/relation."""

    latitude = element.attrib.get("lat")
    longitude = element.attrib.get("lon")

    if latitude and longitude:
        return float(latitude), float(longitude)

    center = element.find("center")

    if center is not None:
        latitude = center.attrib.get("lat")
        longitude = center.attrib.get("lon")

        if latitude and longitude:
            return float(latitude), float(longitude)

    # Ways from the map endpoint don't contain a <center>.
    # Calculate their approximate center from their node references
    # later if necessary.
    return None


async def get_nearby_places(
    latitude: float,
    longitude: float,
    radius_m: int = 1000,
) -> list[NearbyPlace]:
    """
    Retrieve nearby useful places from OpenStreetMap.

    This uses a small bounding box rather than Overpass so that
    SafeLens does not depend on an Overpass server.
    """

    # Approximate conversion from meters to degrees.
    latitude_delta = radius_m / 111_000

    longitude_delta = radius_m / (
        111_000 * max(math.cos(math.radians(latitude)), 0.01)
    )

    south = latitude - latitude_delta
    north = latitude + latitude_delta
    west = longitude - longitude_delta
    east = longitude + longitude_delta

    params = {
        "bbox": f"{west},{south},{east},{north}",
    }

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/xml",
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                OSM_MAP_URL,
                params=params,
                headers=headers,
            )

        response.raise_for_status()

        root = ET.fromstring(response.content)

    except (httpx.HTTPError, ET.ParseError):
        return []

    places: list[NearbyPlace] = []

    for element in root.findall("node"):
        tags = {
            tag.attrib.get("k"): tag.attrib.get("v")
            for tag in element.findall("tag")
        }

        amenity = tags.get("amenity")

        if amenity not in PLACE_CATEGORIES:
            continue

        name = tags.get("name")

        if not name:
            continue

        element_latitude = element.attrib.get("lat")
        element_longitude = element.attrib.get("lon")

        if not element_latitude or not element_longitude:
            continue

        element_latitude = float(element_latitude)
        element_longitude = float(element_longitude)

        distance = _distance_m(
            latitude,
            longitude,
            element_latitude,
            element_longitude,
        )

        if distance > radius_m:
            continue

        places.append(
            NearbyPlace(
                name=name,
                category=PLACE_CATEGORIES[amenity],
                latitude=element_latitude,
                longitude=element_longitude,
                distance_m=round(distance, 2),
                source="openstreetmap",
            )
        )

    places.sort(
        key=lambda place: (
            place.distance_m
            if place.distance_m is not None
            else float("inf")
        )
    )

    return places