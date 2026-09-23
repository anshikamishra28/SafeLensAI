const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

export type SafetyAssessment = {
  location: {
    latitude: number;
    longitude: number;
    address: string | null;
  };
  score: number | null;
  confidence: number;
  risk_level: "unknown" | "low" | "moderate" | "high" | "critical";
  factors: string[];
  assessed_at: string;
};

export type NearbyPlace = {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance_m: number | null;
  source: string;
};

export type WeatherData = {
  source: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  temperature_c: number;
  precipitation_mm: number;
  wind_speed_kmh: number;
  weather_code: number;
  visibility_m: number;
};

export type PoliceStation = {
  name: string;
  latitude: number;
  longitude: number;
  distance_m: number;
};

export type NearestPoliceStationResponse = {
  station: PoliceStation | null;
  source: string;
  message?: string;
};

export type PredictionFeatures = {
  weather_available: boolean;
  precipitation_mm: number | null;
  wind_speed_kmh: number | null;
  visibility_m: number | null;
  nearby_hospitals: number;
  nearby_pharmacies: number;
  evidence_count: number;
  historical_crime_available: boolean;
  historical_crime_records: number;
};

export type Incident = {
  location: {
    latitude: number;
    longitude: number;
    address: string | null;
  };
  incident_type: string;
  severity: "low" | "medium" | "high" | "critical";
  reported_at: string;
  verified: boolean;
  source: string;
  description: string | null;
};
export type SafetyPrediction = {
  score: number | null;
  risk_level: "unknown" | "low" | "moderate" | "high" | "critical";
  confidence: number;
  factors: string[];
  method: string;
};
export type SafetyAssessmentResponse = {
  assessment: SafetyAssessment;
  weather: WeatherData | null;
  nearby_places: NearbyPlace[];
  incidents: Incident[];
  data_sources: string[];
  prediction_features: PredictionFeatures;
  prediction: SafetyPrediction;
};

export async function getSafetyAssessment(
  latitude: number,
  longitude: number,
  radiusM = 1000,
): Promise<SafetyAssessmentResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radius_m: String(radiusM),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/assessment?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Safety assessment request failed");
  }

  return response.json();
}

export async function getNearestPoliceStation(
  latitude: number,
  longitude: number,
): Promise<NearestPoliceStationResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/police-stations/nearest?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Nearest police station request failed");
  }

  return response.json();
}


export type GeocodedLocation = {
  found: boolean;
  query: string;
  latitude?: number;
  longitude?: number;
  display_name?: string;
};

export async function geocodeLocation(
  query: string,
): Promise<GeocodedLocation> {
  const params = new URLSearchParams({
    q: query,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/geocode?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Location search failed");
  }

  return response.json();
}