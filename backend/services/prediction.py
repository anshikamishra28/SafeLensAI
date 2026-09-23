from models.safety import SafetyContext


def build_prediction_features(
    context: SafetyContext,
) -> dict:
    """
    Build structured, explainable features for a future
    safety prediction model.

    Historical crime data is city-level context only.
    It must not be interpreted as location-specific incidents.
    """

    features = {
        # Current environmental signals
        "weather_available": False,
        "precipitation_mm": None,
        "wind_speed_kmh": None,
        "visibility_m": None,

        # Nearby support infrastructure
        "nearby_hospitals": 0,
        "nearby_pharmacies": 0,

        # Evidence availability
        "evidence_count": 0,

        # Historical crime context
        "historical_crime_available": False,
        "historical_crime_records": 0,
        "historical_total_reported_crime": 0,
        "historical_total_detected_crime": 0,
        "historical_detection_rate": None,

        # Selected crime categories
        "reported_robbery": 0,
        "reported_chain_snatching": 0,
        "reported_hbt_night": 0,
        "reported_vehicle_theft": 0,
        "reported_ordinary_theft": 0,
    }

    # ---------------------------------------------------------
    # Available evidence
    # ---------------------------------------------------------

    available_evidence = [
        evidence
        for evidence in context.evidence
        if evidence.status == "available"
    ]

    features["evidence_count"] = len(available_evidence)

    # ---------------------------------------------------------
    # Historical Bengaluru crime data
    # ---------------------------------------------------------

    if context.historical_crime:
        features["historical_crime_available"] = True
        features["historical_crime_records"] = len(
            context.historical_crime
        )

        total_reported = 0
        total_detected = 0

        for record in context.historical_crime:
            reported = record.get("reported", 0)
            detected = record.get("detected", 0)
            crime_type = record.get("crime_type", "")

            total_reported += reported
            total_detected += detected

            if crime_type == "Robbery":
                features["reported_robbery"] = reported

            elif crime_type == "Chain Snatching":
                features["reported_chain_snatching"] = reported

            elif crime_type == "HBT (Night)":
                features["reported_hbt_night"] = reported

            elif crime_type == "M.V. Thefts":
                features["reported_vehicle_theft"] = reported

            elif crime_type == "Ordinary Thefts":
                features["reported_ordinary_theft"] = reported

        features["historical_total_reported_crime"] = total_reported
        features["historical_total_detected_crime"] = total_detected

        if total_reported > 0:
            features["historical_detection_rate"] = round(
                total_detected / total_reported,
                4,
            )

    # ---------------------------------------------------------
    # Weather
    # ---------------------------------------------------------

    weather_evidence = next(
        (
            evidence
            for evidence in available_evidence
            if evidence.type == "weather"
        ),
        None,
    )

    if weather_evidence:
        weather = weather_evidence.data

        features["weather_available"] = True

        features["precipitation_mm"] = weather.get(
            "precipitation_mm"
        )

        features["wind_speed_kmh"] = weather.get(
            "wind_speed_kmh"
        )

        features["visibility_m"] = weather.get(
            "visibility_m"
        )

    # ---------------------------------------------------------
    # Nearby places
    # ---------------------------------------------------------

    places_evidence = next(
        (
            evidence
            for evidence in available_evidence
            if evidence.type == "nearby_places"
        ),
        None,
    )

    if places_evidence:
        places = places_evidence.data.get(
            "places",
            [],
        )

        features["nearby_hospitals"] = sum(
            1
            for place in places
            if place.get("category") == "hospital"
        )

        features["nearby_pharmacies"] = sum(
            1
            for place in places
            if place.get("category") == "pharmacy"
        )

    return features
def predict_safety_from_features(
    features: dict,
) -> dict:
    """
    Generate a transparent baseline prediction from
    observed environmental and historical features.

    Historical crime statistics are Bengaluru-wide context.
    They are NOT treated as location-specific incidents.
    """

    risk_points = 0
    factors = []

    # ---------------------------------------------------------
    # Current environmental conditions
    # ---------------------------------------------------------

    precipitation = features.get("precipitation_mm")

    if precipitation is not None:
        if precipitation >= 10:
            risk_points += 25
            factors.append(
                "Heavy precipitation may increase travel and visibility-related risk."
            )
        elif precipitation >= 2:
            risk_points += 10
            factors.append(
                "Moderate precipitation may affect travel conditions."
            )

    wind_speed = features.get("wind_speed_kmh")

    if wind_speed is not None:
        if wind_speed >= 50:
            risk_points += 25
            factors.append(
                "High wind speed may create difficult travel conditions."
            )
        elif wind_speed >= 30:
            risk_points += 10
            factors.append(
                "Elevated wind speed may affect travel conditions."
            )

    visibility = features.get("visibility_m")

    if visibility is not None:
        if visibility < 1000:
            risk_points += 25
            factors.append(
                "Very low visibility may increase environmental risk."
            )
        elif visibility < 5000:
            risk_points += 10
            factors.append(
                "Reduced visibility may affect travel conditions."
            )

    # ---------------------------------------------------------
    # Historical context
    # ---------------------------------------------------------

    historical_available = features.get(
        "historical_crime_available",
        False,
    )

    if historical_available:
        factors.append(
            "Historical Bengaluru crime statistics are available as city-level context."
        )

    # ---------------------------------------------------------
    # No current environmental risk evidence
    # ---------------------------------------------------------

    if risk_points == 0:
        return {
            "score": None,
            "risk_level": "unknown",
            "confidence": 0.35,
            "factors": factors + [
                "No significant current environmental risk evidence was observed."
            ],
            "method": "transparent_baseline",
        }

    # ---------------------------------------------------------
    # Convert environmental risk points to score
    # ---------------------------------------------------------

    score = max(
        0,
        min(100, 100 - risk_points),
    )

    if score >= 75:
        risk_level = "low"
    elif score >= 50:
        risk_level = "moderate"
    elif score >= 25:
        risk_level = "high"
    else:
        risk_level = "critical"

    # ---------------------------------------------------------
    # Confidence
    # ---------------------------------------------------------

    evidence_count = features.get(
        "evidence_count",
        0,
    )

    confidence = min(
        0.90,
        0.35 + (0.10 * evidence_count),
    )

    return {
        "score": score,
        "risk_level": risk_level,
        "confidence": round(confidence, 2),
        "factors": factors,
        "method": "transparent_baseline",
    }