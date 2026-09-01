from datetime import datetime, timezone

from models.safety import SafetyAssessment, SafetyContext


def assess_safety(context: SafetyContext) -> SafetyAssessment:
    """
    Produce an explainable safety assessment from available evidence.

    The engine distinguishes between:
    - evidence of risk,
    - contextual/support information,
    - and missing evidence.

    Missing data is never treated as evidence of safety or danger.
    """

    factors: list[str] = []

    available_evidence = [
        evidence
        for evidence in context.evidence
        if evidence.status == "available"
    ]

    if not available_evidence:
        return SafetyAssessment(
            location=context.location,
            score=None,
            confidence=0.0,
            risk_level="unknown",
            factors=[
                "Insufficient safety evidence is currently available."
            ],
            assessed_at=datetime.now(timezone.utc),
        )

    risk_points = 0.0
    risk_evidence_count = 0

    # ---------------------------------------------------------
    # Weather evidence
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

        precipitation = weather.get("precipitation_mm")
        wind_speed = weather.get("wind_speed_kmh")
        visibility = weather.get("visibility_m")

        if isinstance(precipitation, (int, float)):
            if precipitation >= 10:
                risk_points += 25
                risk_evidence_count += 1
                factors.append(
                    "Heavy precipitation may increase environmental risk."
                )
            elif precipitation >= 2:
                risk_points += 10
                risk_evidence_count += 1
                factors.append(
                    "Precipitation may increase environmental risk."
                )
            else:
                factors.append(
                    "No significant precipitation was observed."
                )

        if isinstance(wind_speed, (int, float)):
            if wind_speed >= 50:
                risk_points += 25
                risk_evidence_count += 1
                factors.append(
                    "Strong winds may increase environmental risk."
                )
            elif wind_speed >= 30:
                risk_points += 10
                risk_evidence_count += 1
                factors.append(
                    "Elevated wind speeds may increase environmental risk."
                )

        if isinstance(visibility, (int, float)):
            if visibility < 1000:
                risk_points += 25
                risk_evidence_count += 1
                factors.append(
                    "Very low visibility may increase travel risk."
                )
            elif visibility < 5000:
                risk_points += 10
                risk_evidence_count += 1
                factors.append(
                    "Reduced visibility may increase travel risk."
                )

    # ---------------------------------------------------------
    # Nearby support context
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
        places = places_evidence.data.get("places", [])

        hospitals = [
            place
            for place in places
            if place.get("category") == "hospital"
        ]

        pharmacies = [
            place
            for place in places
            if place.get("category") == "pharmacy"
        ]

        if hospitals:
            factors.append(
                f"{len(hospitals)} mapped hospital(s) found nearby."
            )

        if pharmacies:
            factors.append(
                f"{len(pharmacies)} mapped pharmacy/pharmacies found nearby."
            )

        if not hospitals and not pharmacies:
            factors.append(
                "No mapped medical facilities were returned "
                "by the current OpenStreetMap query."
            )

    # ---------------------------------------------------------
    # No actual risk evidence
    # ---------------------------------------------------------
    if risk_evidence_count == 0:
        factors.append(
            "No verified incident or significant environmental "
"risk evidence is currently available."
        )

        return SafetyAssessment(
            location=context.location,
            score=None,
            confidence=0.35,
            risk_level="unknown",
            factors=factors,
            assessed_at=datetime.now(timezone.utc),
        )

    # ---------------------------------------------------------
    # Risk classification
    # ---------------------------------------------------------
    score = max(0.0, min(100.0, 100.0 - risk_points))

    if score >= 75:
        risk_level = "low"
    elif score >= 50:
        risk_level = "moderate"
    elif score >= 25:
        risk_level = "high"
    else:
        risk_level = "critical"

    # Confidence reflects the amount of actual risk evidence.
    confidence = min(
        0.9,
        0.35 + (0.15 * risk_evidence_count),
    )

    return SafetyAssessment(
        location=context.location,
        score=round(score, 2),
        confidence=round(confidence, 2),
        risk_level=risk_level,
        factors=factors,
        assessed_at=datetime.now(timezone.utc),
    )