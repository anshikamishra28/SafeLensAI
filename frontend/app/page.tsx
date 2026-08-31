"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";
export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

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
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              AI-powered personal safety intelligence
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Know the risk.
              <br />
              <span className="text-cyan-400">Choose the safer way.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              SafeLens combines real-time signals, community reports,
              environmental context and AI to help people make safer travel
              decisions before danger becomes an emergency.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Explore SafeLens
              </button>

              <button className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold transition hover:border-slate-500">
                See how it works
              </button>
            </div>

            {/* Initial product signals */}
            <div className="mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">Safety intelligence</p>
                <p className="mt-2 text-2xl font-semibold">0–100</p>
                <p className="mt-1 text-xs text-slate-500">
                  Explainable risk score
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">Decision support</p>
                <p className="mt-2 text-2xl font-semibold">AI</p>
                <p className="mt-1 text-xs text-slate-500">
                  Context-aware safety advisor
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">Community signal</p>
                <p className="mt-2 text-2xl font-semibold">Live</p>
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