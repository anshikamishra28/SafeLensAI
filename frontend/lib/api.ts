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

export type SafetyAssessmentResponse = {
  assessment: SafetyAssessment;
  weather: WeatherData | null;
  nearby_places: NearbyPlace[];
  data_sources: string[];
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