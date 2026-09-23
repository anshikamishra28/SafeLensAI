"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  checkBackendHealth,
  geocodeLocation,
  getSafetyAssessment,
  getNearestPoliceStation,
  type SafetyAssessment,
  type SafetyAssessmentResponse,
  type PoliceStation,
} from "@/lib/api";

const SafetyMap = dynamic(
  () => import("@/components/SafetyMap"),
  {
    ssr: false,
  },
);

export default function Home() {
  const [backendStatus, setBackendStatus] = useState(
    "Checking backend...",
  );

  const [assessment, setAssessment] =
    useState<SafetyAssessment | null>(null);

  const [assessmentData, setAssessmentData] =
    useState<SafetyAssessmentResponse | null>(null);

  const [nearestPoliceStation, setNearestPoliceStation] =
    useState<PoliceStation | null>(null);

  const [locationQuery, setLocationQuery] = useState("");

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);

  const [locationStatus, setLocationStatus] = useState("");

  const [assessmentStatus, setAssessmentStatus] = useState(
    "Loading safety assessment...",
  );

  async function handleLocationSearch() {
    const query = locationQuery.trim();

    if (!query) {
      setLocationStatus("Please enter a location.");
      return;
    }

    setLocationStatus("Searching...");

    try {
      const location = await geocodeLocation(query);

      if (
        !location.found ||
        location.latitude === undefined ||
        location.longitude === undefined
      ) {
        setLocationStatus("Location not found.");
        return;
      }

      setSelectedLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.display_name ?? query,
      });

      setLocationStatus("Loading safety assessment...");
      setAssessmentStatus("Analyzing safety signals...");

      const result = await getSafetyAssessment(
        location.latitude,
        location.longitude,
        1000,
      );

      const nearestStation = await getNearestPoliceStation(
        location.latitude,
        location.longitude,
      );

      setNearestPoliceStation(nearestStation.station);

      const updatedAssessment: SafetyAssessment = {
        ...result.assessment,
        location: {
          ...result.assessment.location,
          address: location.display_name ?? query,
        },
      };

      setAssessment(updatedAssessment);

      setAssessmentData({
        ...result,
        assessment: updatedAssessment,
      });

      setLocationStatus("Assessment updated");
      setAssessmentStatus("Assessment available");
    } catch (error) {
      console.error("Location search failed:", error);
      setLocationStatus("Unable to search this location.");
    }
  }

  useEffect(() => {
    checkBackendHealth()
      .then(() => {
        setBackendStatus("Backend connected");
      })
      .catch(() => {
        setBackendStatus("Backend unavailable");
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">

        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950">
              S
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">
                SafeLens
              </p>

              <p className="text-xs text-slate-400">
                AI Safety Intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>
          </div>

          <div className="hidden text-sm text-slate-500 md:block">
            {backendStatus}
          </div>

          <button className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-300">
            Get Started
          </button>
        </nav>

        {/* Hero */}
        <section className="flex flex-1 items-center py-20">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              AI-powered personal safety intelligence
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Know the risk.
              <br />
              <span className="text-cyan-400">
                Choose the safer way.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              SafeLens combines real-time signals, community reports,
              environmental context and AI to help people make safer
              travel decisions before danger becomes an emergency.
            </p>

            {/* Location Search */}
            <div className="mt-10 max-w-2xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(event) =>
                    setLocationQuery(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleLocationSearch();
                    }
                  }}
                  placeholder="Search a location..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />

                <button
                  onClick={handleLocationSearch}
                  className="rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Check safety
                </button>
              </div>

              {locationStatus && (
                <p className="mt-3 text-sm text-slate-400">
                  {locationStatus}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Explore SafeLens
              </button>

              <button className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold transition hover:border-slate-500">
                See how it works
              </button>
            </div>

            {/* Live Safety Assessment */}
            <div className="mt-10 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Live safety assessment
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {assessmentStatus}
                  </p>
                </div>

                {assessment && (
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                    {assessment.risk_level}
                  </span>
                )}
              </div>

              {!assessment && (
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-400">
                    Search for a location to generate an
                    evidence-based safety assessment.
                  </p>
                </div>
              )}

              {assessment && (
                <>
                  {/* Score Overview */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <p className="text-xs text-slate-500">
                        Risk level
                      </p>

                      <p className="mt-2 text-xl font-semibold capitalize">
                        {assessment.risk_level}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          Safety score
                        </p>

                        <span className="text-xs text-slate-500">
                          0–100
                        </span>
                      </div>

                      <div className="mt-3 flex items-end gap-2">
                        <p className="text-3xl font-bold text-cyan-400">
                          {assessment.score ?? "N/A"}
                        </p>

                        {assessment.score !== null && (
                          <p className="pb-1 text-sm text-slate-500">
                            / 100
                          </p>
                        )}
                      </div>

                      {assessment.score !== null && (
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                            style={{
                              width: `${assessment.score}%`,
                            }}
                          />
                        </div>
                      )}

                      <p className="mt-2 text-xs text-slate-500">
                        Explainable safety assessment
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <p className="text-xs text-slate-500">
                        Confidence
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {Math.round(
                          assessment.confidence * 100,
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Safety Intelligence Summary */}
                  <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-sm font-bold text-slate-950">
                        S
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          Safety Intelligence
                        </p>

                        <p className="text-xs text-slate-500">
                          Current evidence-based context
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {assessment.risk_level === "unknown"
                        ? "SafeLens currently does not have enough verified evidence to assign a numeric safety score. This does not mean the location is confirmed safe."
                        : `SafeLens currently classifies this location as ${assessment.risk_level} risk based on the available safety signals.`}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                        Confidence{" "}
                        {Math.round(
                          assessment.confidence * 100,
                        )}
                        %
                      </span>

                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                        Evidence-aware
                      </span>

                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                        Explainable
                      </span>
                    </div>
                  </div>

                  {/* Prediction Context */}
{assessmentData && (
  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-200">
          Prediction Context
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Structured signals prepared for safety prediction
        </p>
      </div>

      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
        {assessmentData.prediction_features
          .historical_crime_available
          ? "Historical context available"
          : "Limited historical context"}
      </span>
    </div>

    {/* Prediction Result */}
    <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Current Prediction
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-200 capitalize">
            {assessmentData.prediction.risk_level}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Confidence
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-200">
            {Math.round(
              assessmentData.prediction.confidence * 100,
            )}
            %
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500">
          Prediction method
        </p>

        <p className="mt-1 text-sm text-slate-300">
          {assessmentData.prediction.method}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500">
          Prediction factors
        </p>

        <ul className="mt-2 space-y-1">
          {assessmentData.prediction.factors.map(
            (factor, index) => (
              <li
                key={index}
                className="text-sm leading-5 text-slate-400"
              >
                • {factor}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>

    {/* Prediction Features */}
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
        <p className="text-xs text-slate-500">
          Evidence signals
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-200">
          {
            assessmentData.prediction_features
              .evidence_count
          }
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
        <p className="text-xs text-slate-500">
          Hospitals nearby
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-200">
          {
            assessmentData.prediction_features
              .nearby_hospitals
          }
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
        <p className="text-xs text-slate-500">
          Pharmacies nearby
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-200">
          {
            assessmentData.prediction_features
              .nearby_pharmacies
          }
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
        <p className="text-xs text-slate-500">
          Historical records
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-200">
          {
            assessmentData.prediction_features
              .historical_crime_records
          }
        </p>
      </div>
    </div>

    <p className="mt-4 text-xs leading-5 text-slate-500">
      Historical crime records represent Bengaluru-wide
      aggregate data and are used as contextual prediction
      input. They are not location-specific incidents.
    </p>
  </div>
)}

                  {/* Assessment Explanation */}
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                    <p className="text-xs text-slate-500">
                      Why SafeLens says this
                    </p>

                    <div className="mt-3 space-y-3">
                      {assessment.factors.length > 0 ? (
                        assessment.factors.map((factor, index) => (
                          <div
                            key={index}
                            className="flex gap-3 text-sm text-slate-300"
                          >
                            <span className="mt-0.5 text-cyan-400">
                              •
                            </span>

                            <span>{factor}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">
                          No additional assessment factors are
                          available.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Evidence Notice */}
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                    <p className="text-xs text-slate-500">
                      Evidence status
                    </p>

                    {assessment.risk_level === "unknown" ? (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-200">
                          Not enough verified risk evidence
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          SafeLens does not treat missing incident data
                          as proof that a location is safe. The current
                          assessment is based only on the verified
                          signals available to the system.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-200">
                          Risk signals detected
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          The current assessment includes environmental
                          or other available risk signals. Review the
                          factors above to understand what influenced
                          the result.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Safety Recommendation */}
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                    <p className="text-xs text-slate-500">
                      What should I do?
                    </p>

                    <div className="mt-3">
                      {assessment.risk_level === "unknown" ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Travel with normal caution
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            SafeLens does not currently have enough
                            verified incident evidence to determine
                            whether this location is safe or unsafe.
                            Stay aware of your surroundings and keep
                            emergency support information available.
                          </p>
                        </>
                      ) : assessment.factors.some((factor) =>
                          factor
                            .toLowerCase()
                            .includes("visibility"),
                        ) ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Reduced visibility detected
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Environmental conditions may make travel
                            more difficult. Consider delaying travel or
                            choosing a better-lit and more visible route
                            when possible.
                          </p>
                        </>
                      ) : assessment.factors.some((factor) =>
                          factor
                            .toLowerCase()
                            .includes("precipitation"),
                        ) ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Weather conditions may affect travel
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Precipitation is currently influencing the
                            assessment. Consider covered routes and
                            allow extra travel time.
                          </p>
                        </>
                      ) : assessment.factors.some((factor) =>
                          factor
                            .toLowerCase()
                            .includes("wind"),
                        ) ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Strong wind conditions detected
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Wind conditions are influencing the current
                            assessment. Consider postponing unnecessary
                            travel if conditions worsen.
                          </p>
                        </>
                      ) : assessment.risk_level === "low" ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Conditions currently look relatively
                            favorable
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            No major risk signal is currently dominating
                            the assessment. Continue using normal safety
                            precautions.
                          </p>
                        </>
                      ) : assessment.risk_level === "moderate" ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Consider taking additional precautions
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Some risk signals are present. Consider
                            traveling with someone, staying in
                            well-populated areas, and keeping emergency
                            support information available.
                          </p>
                        </>
                      ) : assessment.risk_level === "high" ? (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Consider a safer alternative
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Significant risk signals are currently
                            affecting this assessment. Consider delaying
                            travel or choosing a safer alternative when
                            possible.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-200">
                            Avoid unnecessary travel if possible
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Multiple significant risk signals are
                            currently affecting this assessment.
                            Prioritize personal safety and use emergency
                            support if necessary.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Environmental Context */}
                  {assessmentData && (
                    <div className="mt-8 border-t border-slate-800 pt-6">
                      <p className="text-xs text-slate-500">
                        Environmental & support context
                      </p>

                      {/* Weather */}
                      {assessmentData.weather && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <p className="text-xs text-slate-500">
                              Temperature
                            </p>

                            <p className="mt-2 text-lg font-semibold">
                              {assessmentData.weather.temperature_c}°C
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <p className="text-xs text-slate-500">
                              Precipitation
                            </p>

                            <p className="mt-2 text-lg font-semibold">
                              {assessmentData.weather.precipitation_mm}{" "}
                              mm
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <p className="text-xs text-slate-500">
                              Visibility
                            </p>

                            <p className="mt-2 text-lg font-semibold">
                              {Math.round(
                                assessmentData.weather.visibility_m /
                                  1000,
                              )}{" "}
                              km
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Nearest Police Station */}
                      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-xs text-slate-500">
                          Emergency support
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Nearest mapped police station
                        </p>

                        {nearestPoliceStation ? (
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <p className="font-medium text-slate-200">
                              {nearestPoliceStation.name}
                            </p>

                            <span className="text-sm text-slate-400">
                              {nearestPoliceStation.distance_m >= 1000
                                ? `${(
                                    nearestPoliceStation.distance_m /
                                    1000
                                  ).toFixed(2)} km away`
                                : `${Math.round(
                                    nearestPoliceStation.distance_m,
                                  )} m away`}
                            </span>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-400">
                            No mapped police station available.
                          </p>
                        )}
                      </div>

                      {/* Nearby Support */}
                      <div className="mt-6">
                        <p className="text-xs text-slate-500">
                          Nearby support
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                          {
                            assessmentData.nearby_places.filter(
                              (place) =>
                                place.category === "hospital",
                            ).length
                          }{" "}
                          hospitals and{" "}
                          {
                            assessmentData.nearby_places.filter(
                              (place) =>
                                place.category === "pharmacy",
                            ).length
                          }{" "}
                          pharmacies mapped within 1 km.
                        </p>
                      </div>

                      {/* Data Sources */}
                      <div className="mt-6">
                        <p className="text-xs text-slate-500">
                          Data sources
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {assessmentData.data_sources.map(
                            (source) => (
                              <span
                                key={source}
                                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400"
                              >
                                {source}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Safety Map */}
            {selectedLocation && (
              <div className="mt-10 max-w-3xl">
                <div className="mb-4">
                  <p className="text-sm text-slate-400">
                    Safety map
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Selected location and nearest mapped police station
                  </p>
                </div>

                <SafetyMap
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                  locationName={selectedLocation.name}
                  policeStation={nearestPoliceStation}
                />
              </div>
            )}

            {/* Initial Product Signals */}
            <div className="mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">
                  Safety intelligence
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  0–100
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Explainable risk score
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">
                  Decision support
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  AI
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Context-aware safety advisor
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">
                  Community signal
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  Live
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Verified incident reports
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Direction */}
        <section
          id="features"
          className="grid gap-5 border-t border-slate-800 pt-10 md:grid-cols-3"
        >
          <div>
            <p className="text-sm font-semibold text-cyan-400">
              PREDICT
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Understand risk before you travel.
            </h2>
          </div>

          <div>
            <p className="text-sm font-semibold text-cyan-400">
              PROTECT
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Get safer route recommendations.
            </h2>
          </div>

          <div>
            <p className="text-sm font-semibold text-cyan-400">
              RESPOND
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Act quickly when something goes wrong.
            </h2>
          </div>
        </section>
      </section>
    </main>
  );
}