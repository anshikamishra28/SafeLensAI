# SafeLensAI

> **Know the risk. Choose the safer way.**

SafeLensAI is a location-aware safety intelligence platform being
developed to help people understand the **safety-relevant context around
a location** before making a travel or movement decision.

The project combines geospatial information, current environmental
conditions, public/open data, historical crime context, structured
evidence, and an explainable prediction layer.

SafeLensAI is being developed beyond a hackathon prototype with a focus
on **real data, explainability, uncertainty, maintainability, and
production readiness**.

------------------------------------------------------------------------

## Project Status

**Status: Active development --- functional full-stack local
application**

### Currently implemented

-   Next.js + React + TypeScript frontend
-   Tailwind CSS UI
-   FastAPI + Python backend
-   Frontend ↔ backend API integration
-   Location search and geocoding
-   OpenStreetMap integration
-   Open-Meteo weather integration
-   Nearby hospitals and pharmacies
-   Bengaluru police-station dataset
-   Nearest police-station calculation
-   Bengaluru 2023 historical crime dataset
-   Structured safety evidence models
-   Explainable safety assessment
-   Transparent baseline prediction engine
-   Prediction Context UI
-   Interactive Leaflet map
-   Police-station map visualization
-   Safety intelligence summary
-   Git/GitHub version control
-   Public GitHub repository

### Important limitation

The current prediction engine is **not a machine-learning model**.

It is a transparent, rule-based baseline that currently uses measurable
environmental signals such as:

-   precipitation
-   wind speed
-   visibility

Historical crime data is currently used as **city-level context**, not
as location-specific crime prediction.

The project deliberately avoids fabricating incident-level crime data or
converting aggregate statistics into fake map markers.

------------------------------------------------------------------------

# 1. Product Goal

The long-term goal of SafeLensAI is to answer:

> **"What safety-relevant information is available around this location
> right now, how reliable is it, and what factors should the user
> consider?"**

The platform is intentionally designed around evidence rather than
presenting an unexplained `safe/unsafe` label.

### Product principles

1.  Evidence before claims
2.  No fabricated crime data
3.  No false precision
4.  Explain predictions
5.  Show uncertainty
6.  Separate current signals from historical context
7.  Prefer free/open data sources where practical
8.  Keep the architecture ready for future ML models

------------------------------------------------------------------------

# 2. System Architecture

``` text
                         User / Browser
                               |
                               v
                    +-----------------------+
                    |    Next.js Frontend   |
                    | React + TypeScript    |
                    | Tailwind + Leaflet    |
                    +-----------+-----------+
                                |
                             HTTP/JSON
                                |
                                v
                    +-----------------------+
                    |      FastAPI API      |
                    |        Python         |
                    +-----------+-----------+
                                |
             +------------------+------------------+
             |                  |                  |
             v                  v                  v
      External Sources     Local Data       Feature Layer
      ----------------     ----------       -------------
      Nominatim            Crime CSV        Weather
      Open-Meteo           Police CSV       Infrastructure
      OpenStreetMap                         Evidence
                                            Historical Context
                                                   |
                                                   v
                                      +-----------------------+
                                      |   Prediction Layer    |
                                      | Transparent Baseline |
                                      +-----------+-----------+
                                                  |
                                                  v
                                      +-----------------------+
                                      |  Safety Assessment    |
                                      | + Evidence            |
                                      | + Prediction          |
                                      +-----------------------+
```

### Long-term architecture

``` text
Data Sources
     |
     v
Evidence Layer
     |
     v
Feature Layer
     |
     +--------------------+
     |                    |
     v                    v
Baseline Engine      Future ML Models
     |                    |
     +---------+----------+
               |
               v
        Prediction API
               |
               v
          FastAPI
               |
               v
           Next.js
               |
               v
             User
```

------------------------------------------------------------------------

# 3. Repository Structure

``` text
SafeLensAI/
|
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── package-lock.json
|
├── backend/
│   ├── main.py
│   ├── models/
│   │   └── safety.py
│   ├── services/
│   │   ├── crime_history.py
│   │   ├── geocoding.py
│   │   ├── places.py
│   │   ├── police_stations.py
│   │   ├── prediction.py
│   │   ├── risk.py
│   │   └── weather.py
│   ├── data/
│   │   ├── bengaluru_crime_2023.csv
│   │   └── bengaluru_police_stations.csv
│   └── .venv/
|
├── README.md
└── .gitignore
```

------------------------------------------------------------------------

# 4. Backend Architecture

The backend is built with **FastAPI + Python**.

## `backend/main.py`

The main FastAPI application is responsible for:

-   API routes
-   request handling
-   collecting data from services
-   constructing safety context
-   running the safety assessment
-   constructing prediction features
-   running the prediction layer
-   returning structured JSON responses

## `backend/models/safety.py`

Contains the main Pydantic models:

-   `Location`
-   `SafetySignal`
-   `Incident`
-   `NearbyPlace`
-   `Evidence`
-   `SafetyContext`
-   `SafetyAssessment`
-   `SafetyAssessmentResponse`

These models provide the structured foundation for the safety
intelligence layer.

## `backend/services/geocoding.py`

Converts a user-entered location into:

-   latitude
-   longitude
-   address/display name

**Source:** OpenStreetMap Nominatim.

## `backend/services/weather.py`

Retrieves current environmental information from Open-Meteo.

Current fields include:

-   temperature
-   precipitation
-   wind speed
-   weather code
-   visibility

## `backend/services/places.py`

Retrieves nearby mapped infrastructure from OpenStreetMap.

Current useful categories include:

-   hospitals
-   pharmacies
-   police
-   fire stations

These are treated as **supporting infrastructure**, not direct proof of
safety.

## `backend/services/crime_history.py`

Loads historical Bengaluru crime statistics from the local CSV dataset.

The data is treated as **historical city-level context**.

## `backend/services/police_stations.py`

Loads mapped Bengaluru police-station locations and calculates the
nearest station using geographic distance.

The result includes:

-   station name
-   latitude
-   longitude
-   distance from selected location

## `backend/services/risk.py`

Contains the explainable safety-assessment logic.

Current environmental signals include:

-   precipitation
-   wind
-   visibility

The system intentionally distinguishes:

> **No evidence of danger**

from:

> **Evidence that the location is safe**

## `backend/services/prediction.py`

Contains the current prediction layer.

It has two main responsibilities:

1.  Build structured prediction features.
2.  Generate the transparent baseline prediction.

The current implementation is intentionally **not described as AI/ML**.

------------------------------------------------------------------------

# 5. Frontend Architecture

The frontend uses:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Leaflet
-   React-Leaflet

Important frontend areas include:

``` text
frontend/
├── app/
├── components/
│   └── SafetyMap.tsx
└── lib/
    └── api.ts
```

The current UI displays:

-   location search
-   safety assessment
-   risk level
-   prediction confidence
-   prediction factors
-   environmental context
-   nearby infrastructure
-   historical crime context
-   prediction features
-   interactive map
-   nearest police station
-   police-station distance
-   safety intelligence information

------------------------------------------------------------------------

# 6. API Architecture

## Local development URLs

Backend:

``` text
http://127.0.0.1:8000
```

Frontend:

``` text
http://localhost:3000
```

## `GET /health`

Checks whether the backend is running.

Example:

``` text
GET http://127.0.0.1:8000/health
```

## `GET /api/v1/geocode`

Converts a location query into coordinates.

Parameter:

``` text
q
```

Example:

``` text
GET /api/v1/geocode?q=Cubbon%20Park%20Bengaluru
```

Data source:

-   OpenStreetMap Nominatim

## `GET /api/v1/assessment`

Main safety-intelligence endpoint.

Parameters:

-   `latitude`
-   `longitude`
-   `radius_m`

Example:

``` text
GET /api/v1/assessment?latitude=12.9716&longitude=77.5946&radius_m=1000
```

Response includes:

-   `assessment`
-   `weather`
-   `nearby_places`
-   `incidents`
-   `data_sources`
-   `prediction_features`
-   `prediction`

## `GET /api/v1/police-stations/nearest`

Finds the nearest mapped police station.

Parameters:

-   `latitude`
-   `longitude`

Example:

``` text
GET /api/v1/police-stations/nearest?latitude=12.9716&longitude=77.5946
```

------------------------------------------------------------------------

# 7. External Data Sources

SafeLensAI currently uses public/free sources wherever practical.

## OpenStreetMap

https://www.openstreetmap.org/

Used for:

-   map data
-   nearby infrastructure
-   hospitals
-   pharmacies
-   mapped emergency-related places

## Nominatim

https://nominatim.org/

Used for:

-   location search
-   geocoding

Public Nominatim usage is subject to its usage policy and rate limits.

## Open-Meteo

https://open-meteo.com/

Used for current weather information:

-   temperature
-   precipitation
-   wind speed
-   weather code
-   visibility

## OpenCity --- Bengaluru Crime Data 2023

https://data.opencity.in/dataset/bengaluru-crime-data-2023

Used for historical Bengaluru-wide crime context.

**Important:** these are aggregate city-level statistics, not
location-specific incident records. SafeLensAI therefore does not
convert them into fake map pins.

## OpenCity --- Police Station Locations

https://data.opencity.in/dataset/police-station-locations

Used for mapped Bengaluru police-station locations.

The source dataset contains approximately 135 mapped police stations.

------------------------------------------------------------------------

# 8. Local Data

## `backend/data/bengaluru_crime_2023.csv`

Current columns:

-   `Type of Crime`
-   `2021 Reported`
-   `2021 Detected`
-   `2022 Reported`
-   `2022 Detected`
-   `2023 Reported`
-   `2023 Detected`

Examples of crime categories include:

-   Murder
-   Dacoity
-   Robbery
-   Chain Snatching
-   HBT (Day)
-   HBT (Night)
-   House Thefts
-   Motor Vehicle Thefts
-   Ordinary Thefts

This dataset provides historical context rather than current
location-specific incidents.

## `backend/data/bengaluru_police_stations.csv`

Important fields:

-   `POL_STAName`
-   `latitude`
-   `longitude`

This dataset powers the nearest-police-station feature.

------------------------------------------------------------------------

# 9. Evidence Architecture

SafeLensAI is designed around structured evidence.

``` text
Location
   |
   +-- Weather
   +-- Nearby Infrastructure
   +-- Police Stations
   +-- Historical Crime Context
   +-- Future Data Sources
          |
          v
    Evidence Layer
          |
          v
    Safety Context
          |
          v
    Feature Layer
          |
          v
    Prediction Layer
```

Each evidence signal is designed to preserve information such as:

-   source
-   signal type
-   value
-   observation time
-   confidence
-   metadata

This makes the system easier to audit and extend as more data sources
are added.

------------------------------------------------------------------------

# 10. Current Prediction Engine

## Transparent Baseline Predictor

The current predictor is a **transparent rule-based baseline**, not an
ML model.

### Current environmental signals

#### Precipitation

Higher precipitation can contribute environmental risk points.

#### Wind

Higher wind speeds can contribute environmental risk points.

#### Visibility

Low visibility can contribute environmental risk points.

### Current behavior

If no significant current environmental risk evidence is available, the
system may return:

``` text
score = null
risk_level = unknown
confidence = 0.35
```

This is intentional.

SafeLensAI does not make the logical mistake:

``` text
No evidence of danger
        ≠
Evidence of safety
```

When meaningful environmental risk evidence exists, the baseline can
produce a bounded score together with explanatory factors.

------------------------------------------------------------------------

# 11. Prediction Features

Current structured features include:

### Environmental

``` text
weather_available
precipitation_mm
wind_speed_kmh
visibility_m
```

### Supporting infrastructure

``` text
nearby_hospitals
nearby_pharmacies
```

### Evidence

``` text
evidence_count
```

### Historical context

``` text
historical_crime_available
historical_crime_records
historical_total_reported_crime
historical_total_detected_crime
historical_detection_rate
reported_robbery
reported_chain_snatching
reported_hbt_night
reported_vehicle_theft
reported_ordinary_theft
```

Historical crime features are currently used as **context**, not as
direct location-specific prediction labels.

------------------------------------------------------------------------

# 12. Map Architecture

The map uses:

-   Leaflet
-   React-Leaflet
-   OpenStreetMap tiles

Current map features:

-   selected-location marker
-   nearest police-station marker
-   police-station popup
-   distance display
-   connecting line between selected location and police station

The map is intended to become the foundation for future geospatial
safety layers.

Potential future layers include:

-   verified incidents
-   roads
-   lighting infrastructure
-   public transport
-   hospitals
-   pharmacies
-   emergency services
-   statistically valid historical heatmaps

------------------------------------------------------------------------

# 13. End-to-End Workflow

``` text
User enters location
        |
        v
Next.js sends request
        |
        v
FastAPI geocoding
        |
        v
Latitude + Longitude
        |
        +----------------------+
        |                      |
        v                      v
     Weather             Nearby Places
        |                      |
        +----------+-----------+
                   |
                   v
        Historical Context
                   |
                   v
          Safety Context
                   |
                   v
        Evidence Collection
                   |
                   v
        Feature Construction
                   |
                   v
        Transparent Predictor
                   |
                   v
       Safety Assessment JSON
                   |
                   v
             Next.js UI
                   |
           +-------+-------+
           |       |       |
           v       v       v
        Context Prediction Map
```

------------------------------------------------------------------------

# 14. Local Development

## Backend

Open PowerShell:

``` powershell
cd C:\Projects\SafeLensAI\backend
```

Activate the virtual environment:

``` powershell
.\.venv\Scripts\Activate.ps1
```

Start FastAPI:

``` powershell
uvicorn main:app --reload
```

Backend:

``` text
http://127.0.0.1:8000
```

## Frontend

Open another PowerShell terminal:

``` powershell
cd C:\Projects\SafeLensAI\frontend
```

Start Next.js:

``` powershell
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 15. Environment and Security

Development-generated and secret files should not be committed to
GitHub.

Examples:

``` text
.venv/
node_modules/
.next/
__pycache__/
.env
```

Before production deployment, SafeLensAI still needs:

-   production environment variables
-   secret management
-   API rate limiting
-   stronger CORS configuration
-   request validation
-   structured logging
-   monitoring
-   error tracking
-   abuse protection
-   external-provider usage-policy compliance

------------------------------------------------------------------------

# 16. Git and GitHub

Repository:

https://github.com/anshikamishra28/SafeLensAI

Default branch:

``` text
main
```

Latest major development commit currently documented:

``` text
8272eb2
Add safety intelligence and prediction features
```

The README was subsequently added as:

``` text
ff1e124
Add comprehensive project README
```

### Development workflow

``` text
Make change
    |
    v
Test locally
    |
    v
git status
    |
    v
git add .
    |
    v
git commit -m "..."
    |
    v
git push
    |
    v
GitHub updated
```

------------------------------------------------------------------------

# 17. Implementation Timeline

The project has been developed incrementally.

  Date          Milestone                                   Commit
  ------------- ------------------------------------------- -----------
  31 Aug 2026   SafeLensAI project initialization           `3d9b1d5`
  31 Aug 2026   Backend foundation                          `1ae7d1d`
  31 Aug 2026   Frontend ↔ backend connection               `ae73f53`
  31 Aug 2026   Location-aware safety API                   `0145721`
  31 Aug 2026   OpenStreetMap geocoding                     `994fe79`
  1 Sep 2026    Explainable safety assessment               `84fd7c8`
  1 Sep 2026    Location search dashboard                   `ac92477`
  1 Sep 2026    Safety assessment interface improvements    `59cbec7`
  1 Sep 2026    Frontend safety-assessment integration      `fe0b004`
  1 Sep 2026    Explainable risk-engine cleanup             `e255ec5`
  23 Sep 2026   Safety intelligence + prediction features   `8272eb2`
  23 Sep 2026   Comprehensive project README                `ff1e124`

### Major recent milestone

The `8272eb2` milestone introduced:

-   Bengaluru historical crime dataset
-   Bengaluru police-station dataset
-   nearest police-station service
-   prediction feature construction
-   transparent baseline prediction
-   Prediction Context UI
-   interactive safety map
-   expanded safety-assessment response

------------------------------------------------------------------------

# 18. Current Status

### Implemented

-   [x] Next.js frontend
-   [x] FastAPI backend
-   [x] Frontend/backend integration
-   [x] Location search
-   [x] Weather integration
-   [x] OpenStreetMap integration
-   [x] Nearby infrastructure
-   [x] Police-station dataset
-   [x] Nearest police station
-   [x] Historical crime dataset
-   [x] Structured evidence
-   [x] Explainable safety assessment
-   [x] Transparent baseline prediction
-   [x] Interactive map
-   [x] Prediction Context UI
-   [x] GitHub repository

### Still to build

-   [ ] Automated backend tests
-   [ ] Frontend/component tests
-   [ ] API integration tests
-   [ ] Production database
-   [ ] Repeatable data-ingestion pipelines
-   [ ] Data-freshness tracking
-   [ ] Better verified incident data
-   [ ] More granular safety signals
-   [ ] Temporal intelligence
-   [ ] Production deployment
-   [ ] Monitoring
-   [ ] CI/CD
-   [ ] Validated ML model

------------------------------------------------------------------------

# 19. Future Development Roadmap

## Phase 1 --- Engineering Foundation

-   Comprehensive backend tests
-   Frontend component tests
-   API integration tests
-   Structured logging
-   Centralized error handling
-   Stronger request validation
-   API documentation improvements
-   Health/readiness checks
-   Production configuration

## Phase 2 --- Data Engineering

-   Repeatable data-ingestion pipelines
-   Data-source provenance
-   Data-freshness tracking
-   Data-quality validation
-   External-provider failure handling
-   Caching
-   Automated dataset updates

## Phase 3 --- Database

The long-term data layer can move from static CSV files to PostgreSQL.

Potential structure:

``` text
PostgreSQL / PostGIS
        |
        +-- Locations
        +-- Evidence
        +-- Weather Observations
        +-- Infrastructure
        +-- Police Stations
        +-- Incidents
        +-- Historical Statistics
        +-- Prediction Results
```

PostGIS can later be considered for production geospatial queries.

## Phase 4 --- More Safety Signals

Potential future sources/signals:

-   verified incident reports
-   traffic conditions
-   road characteristics
-   lighting infrastructure
-   public transport
-   road accessibility
-   emergency-response infrastructure
-   time of day
-   day of week
-   historical weather
-   additional official/public datasets

Every new source should be evaluated for:

-   reliability
-   geographic resolution
-   temporal resolution
-   licensing
-   privacy
-   bias
-   update frequency

## Phase 5 --- Temporal Intelligence

Planned derived features:

``` text
hour
day_of_week
month
is_weekend
is_night
```

These can be derived from the assessment timestamp without inventing
external data.

## Phase 6 --- Machine Learning

A true ML model should only be introduced when sufficiently granular and
reliable training labels are available.

Planned pipeline:

``` text
Raw Data
   |
   v
Data Cleaning
   |
   v
Feature Engineering
   |
   v
Training Dataset
   |
   v
Model Training
   |
   v
Validation
   |
   v
Calibration
   |
   v
Model Registry
   |
   v
Prediction API
```

The transparent baseline should remain available even after ML is
introduced so that the system retains an interpretable baseline for
comparison.

## Phase 7 --- Production Deployment

Target architecture:

``` text
                     Internet
                        |
                        v
                   CDN / Edge
                        |
             +----------+----------+
             |                     |
             v                     v
        Next.js App          API Service
                                  |
                    +-------------+-------------+
                    |             |             |
                    v             v             v
               PostgreSQL      Cache      External APIs
               / PostGIS
```

Production concerns include:

-   HTTPS
-   custom domain
-   secure environment variables
-   database backups
-   monitoring
-   rate limiting
-   authentication where required
-   API quotas
-   caching
-   observability
-   CI/CD
-   automated testing
-   deployment rollback

------------------------------------------------------------------------

# 20. Responsible Use

SafeLensAI is an **informational safety-intelligence product**.

It should never claim certainty that a location or person is safe.

Important limitations:

-   A high score is not a guarantee of safety.
-   Missing incident data does not mean no incidents occurred.
-   City-level crime statistics are not location-specific crime rates.
-   Nearby hospitals/pharmacies indicate infrastructure availability,
    not safety.
-   External data can be incomplete, delayed, or unavailable.
-   Predictions should expose their evidence and uncertainty.
-   Future ML models should be evaluated for geographic, demographic,
    and temporal bias.

The goal is to help users make better-informed decisions, not to replace
personal judgment or emergency services.

------------------------------------------------------------------------

# 21. Development Philosophy

SafeLensAI is being developed incrementally:

``` text
Prototype
    |
    v
Real Data
    |
    v
Structured Evidence
    |
    v
Explainable Assessment
    |
    v
Feature Engineering
    |
    v
Validated Prediction
    |
    v
Production Infrastructure
```

The project intentionally avoids adding complexity merely for the
appearance of being "AI-powered".

A future ML system should be introduced because the available data
supports it --- not simply because the product name contains "AI".

------------------------------------------------------------------------

# 22. Long-Term Vision

The long-term SafeLensAI platform is intended to combine a user-friendly
dashboard with a robust safety-intelligence backend.

``` text
                         SafeLensAI
                             |
             +---------------+---------------+
             |                               |
             v                               v
      User Experience                 Safety Intelligence
             |                               |
      Next.js Dashboard                Evidence Layer
                                             |
                            +----------------+----------------+
                            |                |                |
                            v                v                v
                         Weather         Location        Historical
                                        Context            Data
                            |                |                |
                            +----------------+----------------+
                                             |
                                             v
                                       Feature Layer
                                             |
                              +--------------+--------------+
                              |                             |
                              v                             v
                       Baseline Engine                 ML Models
                              |                             |
                              +--------------+--------------+
                                             |
                                             v
                                      Safety Intelligence
```

The long-term objective is a system that is:

-   data-driven
-   explainable
-   geographically aware
-   uncertainty-aware
-   privacy-conscious
-   scalable
-   production-ready

------------------------------------------------------------------------

# 23. Project Motto

> **Know the risk. Choose the safer way.**

SafeLensAI is being built to make location-aware safety information more
transparent, contextual, and useful --- one reliable data source at a
time.
