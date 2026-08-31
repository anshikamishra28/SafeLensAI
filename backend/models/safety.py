from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class Location(BaseModel):
    latitude: float
    longitude: float
    address: str | None = None


class SafetySignal(BaseModel):
    source: str
    signal_type: str
    value: float | str | bool
    observed_at: datetime
    confidence: float = Field(ge=0.0, le=1.0)
    metadata: dict = Field(default_factory=dict)


class Incident(BaseModel):
    location: Location
    incident_type: str
    severity: Literal["low", "medium", "high", "critical"]
    reported_at: datetime
    verified: bool = False
    source: str
    description: str | None = None


class SafetyContext(BaseModel):
    location: Location
    observed_at: datetime
    signals: list[SafetySignal] = Field(default_factory=list)
    incidents: list[Incident] = Field(default_factory=list)
    data_sources: list[str] = Field(default_factory=list)


class SafetyAssessment(BaseModel):
    location: Location
    score: float | None = Field(default=None, ge=0.0, le=100.0)
    confidence: float = Field(ge=0.0, le=1.0)
    risk_level: Literal[
        "unknown",
        "low",
        "moderate",
        "high",
        "critical",
    ]
    factors: list[str] = Field(default_factory=list)
    assessed_at: datetime