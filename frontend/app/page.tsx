"use client";

import { useEffect, useState } from "react";
import {
  checkBackendHealth,
  geocodeLocation,
  getSafetyAssessment,
  type SafetyAssessment,
} from "@/lib/api";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState(
    "Checking backend...",
  );

  const [assessment, setAssessment] =
    useState<SafetyAssessment | null>(null);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [assessmentStatus, setAssessmentStatus] =
    useState("Search for a location to begin.");

  async function handleLocationSearch() {
    const query = locationQuery.trim();

    if (!query) {
      setLocationStatus("Please enter a location.");
      return;
    }

    setLocationStatus("Searching...");
    setAssessmentStatus("Finding location...");
    setAssessment(null);

    try {
      const location = await geocodeLocation(query);

      if (
        !location.found ||
        location.latitude === undefined ||
        location.longitude === undefined
      ) {
        setLocationStatus("Location not found.");
        setAssessmentStatus("No location could be found.");
        return;
      }

      setLocationStatus("Location found.");
      setAssessmentStatus("Building safety assessment...");

      const result = await getSafetyAssessment(
        location.latitude,
        location.longitude,
        1000,
      );

      setAssessment({
        ...result,
        location: {
          ...result.location,
          address: location.display_name ?? query,
        },
      });

      setLocationStatus("Assessment updated.");
      setAssessmentStatus("Assessment based on currently available evidence.");
    } catch {
      setLocationStatus("Unable to search this location.");
      setAssessmentStatus("Safety assessment unavailable.");
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

  const riskLabel = assessment
    ? assessment.risk_level === "unknown"
      ? "Insufficient evidence"
      : `${assessment.risk_level} risk`
    : null;

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
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#about" className="transition hover:text-white">
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
          <div className="w-full max-w-4xl">
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

            {/* Location search */}
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

            {/* Secondary actions */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold transition hover:border-slate-500">
                See how it works
              </button>
            </div>

            {/* Safety assessment */}
            {assessment && (
              <div className="mt-12 max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
                <div className="border-b border-slate-800 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-cyan-400">
                        Safety assessment
                      </p>

                      <h2 className="mt-2 text-xl font-semibold">
                        {assessment.location.address ||
                          "Selected location"}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {assessmentStatus}
                      </p>
                    </div>

                    <span className="inline-flex w-fit rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-300">
                      {riskLabel}
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Risk level
                    </p>

                    <p className="mt-2 text-2xl font-semibold capitalize">
                      {assessment.risk_level}
                    </p>

                    {assessment.risk_level === "unknown" && (
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        There is not enough verified evidence to
                        determine a reliable risk level.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Confidence
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {Math.round(
                        assessment.confidence * 100,
                      )}
                      %
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Confidence in the available evidence
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Safety score
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {assessment.score ?? "—"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {assessment.score === null
                        ? "Not enough evidence for a score"
                        : "Out of 100"}
                    </p>
                  </div>
                </div>

                {/* Evidence */}
                {assessment.factors.length > 0 && (
                  <div className="border-t border-slate-800 p-6">
                    <p className="text-sm font-semibold">
                      What SafeLens found
                    </p>

                    <ul className="mt-4 space-y-3">
                      {assessment.factors.map((factor, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-slate-300"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsible interpretation */}
                {assessment.risk_level === "unknown" && (
                  <div className="border-t border-slate-800 bg-slate-950/40 p-6">
                    <p className="text-sm font-medium text-slate-300">
                      Important
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      An unknown assessment does not mean the location
                      is unsafe. It means SafeLens currently does not
                      have enough verified evidence to make a reliable
                      safety determination.
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-800 px-6 py-4">
                  <p className="text-xs text-slate-600">
                    Assessed{" "}
                    {new Date(
                      assessment.assessed_at,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Initial product signals */}
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

        {/* Product direction */}
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