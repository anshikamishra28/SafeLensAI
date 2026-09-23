\# SafeLensAI



> \*\*Know the risk. Choose the safer way.\*\*



SafeLensAI is a location-aware safety intelligence platform being developed to help users understand the \*\*safety-relevant context around a location\*\* before making a travel or movement decision.



The project combines real-world data sources, geospatial information, environmental conditions, historical crime context, structured evidence, and an explainable prediction layer.



SafeLensAI is being developed beyond a hackathon prototype with a focus on \*\*real data, explainability, uncertainty, maintainability, and production readiness\*\*.



\---



\## 1. Project Status



\*\*Current status: Active development — functional full-stack local application\*\*



\### Currently implemented



\- Next.js frontend

\- FastAPI backend

\- Frontend ↔ backend API integration

\- Location search and geocoding

\- OpenStreetMap integration

\- Open-Meteo weather integration

\- Nearby hospitals and pharmacies

\- Bengaluru police-station dataset

\- Nearest police-station calculation

\- Bengaluru 2023 historical crime dataset

\- Structured safety evidence models

\- Explainable safety assessment

\- Transparent baseline prediction engine

\- Prediction Context UI

\- Interactive Leaflet map

\- Police-station map visualization

\- Safety intelligence summary

\- Git/GitHub version control

\- Public GitHub repository



\### Important current limitation



The current prediction engine is \*\*not a machine-learning model\*\*.



It is a transparent, rule-based baseline that currently uses measurable environmental signals such as:



\- precipitation

\- wind speed

\- visibility



Historical crime data is currently used as \*\*city-level context\*\*, not as location-specific crime predictions.



\---



\# 2. Product Goal



The long-term goal of SafeLensAI is to answer:



> \*\*"What safety-relevant information is available around this location right now, how reliable is it, and what factors should the user consider?"\*\*



The platform is intentionally designed around evidence rather than presenting an unexplained `safe/unsafe` label.



\### Product principles



1\. Evidence before claims

2\. No fabricated crime data

3\. No false precision

4\. Explain predictions

5\. Show uncertainty

6\. Separate current signals from historical context

7\. Prefer free/open data sources where practical

8\. Keep the architecture ready for future ML models



\---



\# 3. System Architecture



```text

&#x20;                        ┌─────────────────────────┐

&#x20;                        │       User / Browser     │

&#x20;                        └────────────┬────────────┘

&#x20;                                     │

&#x20;                                     ▼

&#x20;                        ┌─────────────────────────┐

&#x20;                        │    Next.js Frontend      │

&#x20;                        │ React + TypeScript       │

&#x20;                        │ Tailwind + Leaflet       │

&#x20;                        └────────────┬────────────┘

&#x20;                                     │

&#x20;                                 HTTP / JSON

&#x20;                                     │

&#x20;                                     ▼

&#x20;                        ┌─────────────────────────┐

&#x20;                        │      FastAPI API         │

&#x20;                        │        Python            │

&#x20;                        └────────────┬────────────┘

&#x20;                                     │

&#x20;         ┌───────────────────────────┼───────────────────────────┐

&#x20;         │                           │                           │

&#x20;         ▼                           ▼                           ▼

&#x20;┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐

&#x20;│ External Sources│       │ Local Data        │       │ Feature Layer    │

&#x20;├─────────────────┤       ├──────────────────┤       ├──────────────────┤

&#x20;│ Nominatim       │       │ Crime CSV        │       │ Weather          │

&#x20;│ Open-Meteo      │       │ Police CSV       │       │ Infrastructure   │

&#x20;│ OpenStreetMap   │       │                  │       │ Evidence         │

&#x20;└─────────────────┘       └──────────────────┘       │ Historical       │

&#x20;                                                     └────────┬─────────┘

&#x20;                                                              │

&#x20;                                                              ▼

&#x20;                                                   ┌────────────────────┐

&#x20;                                                   │ Prediction Layer   │

&#x20;                                                   │ Transparent        │

&#x20;                                                   │ Baseline           │

&#x20;                                                   └─────────┬──────────┘

&#x20;                                                             │

&#x20;                                                             ▼

&#x20;                                                   ┌────────────────────┐

&#x20;                                                   │ Safety Assessment  │

&#x20;                                                   │ + Evidence         │

&#x20;                                                   │ + Prediction       │

&#x20;                                                   └────────────────────┘

Long-term architecture

Data Sources

&#x20;    ↓

Evidence Layer

&#x20;    ↓

Feature Layer

&#x20;    ↓

Prediction Layer

&#x20;    ↓

FastAPI

&#x20;    ↓

Next.js

&#x20;    ↓

User

4\. Repository Structure



Current high-level structure:



SafeLensAI/

│

├── frontend/

│   ├── app/

│   ├── components/

│   ├── lib/

│   ├── package.json

│   └── package-lock.json

│

├── backend/

│   ├── main.py

│   │

│   ├── models/

│   │   └── safety.py

│   │

│   ├── services/

│   │   ├── crime\_history.py

│   │   ├── geocoding.py

│   │   ├── places.py

│   │   ├── police\_stations.py

│   │   ├── prediction.py

│   │   ├── risk.py

│   │   └── weather.py

│   │

│   ├── data/

│   │   ├── bengaluru\_crime\_2023.csv

│   │   └── bengaluru\_police\_stations.csv

│   │

│   └── .venv/

│

├── README.md

└── .gitignore

5\. Backend Architecture



The backend is built using FastAPI + Python.



backend/main.py



Main FastAPI application.



Responsibilities:



API routes

request handling

collecting data from services

creating safety context

running assessment

running prediction

returning structured JSON responses

backend/models/safety.py



Contains the main Pydantic models.



Current models include:



Location

SafetySignal

Incident

NearbyPlace

Evidence

SafetyContext

SafetyAssessment

SafetyAssessmentResponse



These models provide a structured foundation for the safety intelligence layer.



backend/services/geocoding.py



Responsible for converting a user-entered location into:



latitude

longitude

address/display name



Data source:



OpenStreetMap Nominatim



backend/services/weather.py



Retrieves current environmental information from Open-Meteo.



Current fields include:



temperature

precipitation

wind speed

weather code

visibility

backend/services/places.py



Retrieves nearby mapped infrastructure from OpenStreetMap.



Current useful categories include:



hospitals

pharmacies

police

fire stations



These are currently treated as supporting infrastructure, not direct proof of safety.



backend/services/crime\_history.py



Loads historical Bengaluru crime statistics from the local CSV dataset.



The data is treated as historical city-level context.



backend/services/police\_stations.py



Loads mapped Bengaluru police-station locations.



It calculates the nearest police station using geographic distance.



The result includes:



station name

latitude

longitude

distance from selected location

backend/services/risk.py



Contains the explainable safety assessment logic.



It evaluates available evidence such as:



precipitation

wind

visibility

nearby infrastructure



The system intentionally distinguishes:



No evidence of danger



from:



Evidence that the location is safe

backend/services/prediction.py



Contains the current prediction layer.



It has two major responsibilities:



Build structured prediction features.

Generate the transparent baseline prediction.



The current implementation is intentionally not called AI/ML.



6\. Frontend Architecture



The frontend is built using:



Next.js

React

TypeScript

Tailwind CSS

Leaflet

React-Leaflet



Important files include:



frontend/

├── app/

├── components/

│   └── SafetyMap.tsx

└── lib/

&#x20;   └── api.ts



The frontend currently displays:



location search

safety assessment

risk level

prediction confidence

prediction factors

environmental context

nearby infrastructure

historical crime context

interactive map

nearest police station

police-station distance

safety intelligence information

7\. API Architecture



Local backend:



http://127.0.0.1:8000



Frontend:



http://localhost:3000

GET /health



Checks whether the backend is running.



Example:



GET http://127.0.0.1:8000/health

GET /api/v1/geocode



Converts a location query into coordinates.



Parameter

q



Example:



GET /api/v1/geocode?q=Cubbon%20Park%20Bengaluru

Data source



OpenStreetMap Nominatim.



GET /api/v1/assessment



Main safety intelligence endpoint.



Parameters

latitude

longitude

radius\_m



Example:



GET /api/v1/assessment?latitude=12.9716\&longitude=77.5946\&radius\_m=1000

Response includes

assessment

weather

nearby\_places

incidents

data\_sources

prediction\_features

prediction

GET /api/v1/police-stations/nearest



Finds the nearest mapped police station.



Parameters

latitude

longitude



Example:



GET /api/v1/police-stations/nearest?latitude=12.9716\&longitude=77.5946

8\. External Data Sources



SafeLensAI currently uses public/free sources wherever practical.



OpenStreetMap



Website:



https://www.openstreetmap.org/



Used for:



map data

nearby infrastructure

hospitals

pharmacies

mapped emergency-related places

Nominatim



Website:



https://nominatim.org/



Used for:



location search

geocoding



Important:



Public Nominatim usage is subject to its usage policy and rate limits.



Open-Meteo



Website:



https://open-meteo.com/



Used for current weather information.



Current fields:



temperature

precipitation

wind speed

weather code

visibility

OpenCity — Bengaluru Crime Data 2023



Dataset:



https://data.opencity.in/dataset/bengaluru-crime-data-2023



Used for historical Bengaluru-wide crime context.



Important:



These statistics are aggregate city-level data. They are not location-specific incident records.



Therefore SafeLensAI does not convert these statistics into fake map pins.



OpenCity — Police Station Locations



Dataset:



https://data.opencity.in/dataset/police-station-locations



Used for mapped Bengaluru police-station locations.



The source contains approximately 135 mapped police stations.



9\. Local CSV Data

bengaluru\_crime\_2023.csv



Location:



backend/data/bengaluru\_crime\_2023.csv



Current columns:



Type of Crime

2021 Reported

2021 Detected

2022 Reported

2022 Detected

2023 Reported

2023 Detected



Current categories include examples such as:



Murder

Dacoity

Robbery

Chain Snatching

HBT (Day)

HBT (Night)

House Thefts

Motor Vehicle Thefts

Ordinary Thefts



This dataset provides historical context rather than current location-specific incidents.



bengaluru\_police\_stations.csv



Location:



backend/data/bengaluru\_police\_stations.csv



Important fields:



POL\_STAName

latitude

longitude



This dataset powers the nearest police-station feature.



10\. Evidence Architecture



SafeLensAI is designed around structured evidence.



Conceptually:



Location

&#x20;  │

&#x20;  ├── Weather

&#x20;  ├── Nearby Infrastructure

&#x20;  ├── Police Stations

&#x20;  ├── Historical Crime Context

&#x20;  └── Future Data Sources

&#x20;         │

&#x20;         ▼

&#x20;   Evidence Layer

&#x20;         │

&#x20;         ▼

&#x20;   Safety Context

&#x20;         │

&#x20;         ▼

&#x20;   Feature Layer

&#x20;         │

&#x20;         ▼

&#x20;   Prediction Layer



Each evidence signal is designed to preserve information such as:



source

signal type

value

observation time

confidence

metadata



This will make the system more auditable as the project grows.



11\. Current Prediction Engine



The current prediction engine is called:



Transparent Baseline Predictor



It is not currently an ML model.



Current environmental signals

Precipitation



Higher precipitation can contribute environmental risk points.



Wind



Higher wind speeds can contribute environmental risk points.



Visibility



Low visibility can contribute environmental risk points.



Current behavior



If no significant current environmental risk evidence is available, the system may return:



score = null

risk\_level = unknown

confidence = 0.35



This is intentional.



SafeLensAI does not make the logical mistake:



No evidence of danger

&#x20;       ≠

Evidence of safety



When meaningful environmental risk evidence exists, the baseline can produce a bounded score together with explanatory factors.



12\. Prediction Features



Current structured features include:



weather\_available

precipitation\_mm

wind\_speed\_kmh

visibility\_m



nearby\_hospitals

nearby\_pharmacies



evidence\_count



historical\_crime\_available

historical\_crime\_records

historical\_total\_reported\_crime

historical\_total\_detected\_crime

historical\_detection\_rate



reported\_robbery

reported\_chain\_snatching

reported\_hbt\_night

reported\_vehicle\_theft

reported\_ordinary\_theft



Historical crime features are currently used as context rather than direct location-specific prediction labels.



13\. Map Architecture



The map uses:



Leaflet

React-Leaflet

OpenStreetMap tiles



Current map features:



selected location marker

nearest police station marker

police station popup

distance display

connecting line between selected location and police station



The map is intended to become the foundation for future geospatial safety layers.



Possible future layers:



verified incidents

roads

lighting infrastructure

public transport

hospitals

pharmacies

emergency services

statistically valid historical heatmaps

14\. End-to-End Workflow

User enters location

&#x20;       │

&#x20;       ▼

Next.js sends request

&#x20;       │

&#x20;       ▼

FastAPI geocoding

&#x20;       │

&#x20;       ▼

Latitude + Longitude

&#x20;       │

&#x20;       ├───────────────┐

&#x20;       ▼               ▼

&#x20;    Weather       Nearby Places

&#x20;       │               │

&#x20;       └───────┬───────┘

&#x20;               ▼

&#x20;      Historical Context

&#x20;               │

&#x20;               ▼

&#x20;       Safety Context

&#x20;               │

&#x20;               ▼

&#x20;      Evidence Collection

&#x20;               │

&#x20;               ▼

&#x20;      Feature Construction

&#x20;               │

&#x20;               ▼

&#x20;     Transparent Predictor

&#x20;               │

&#x20;               ▼

&#x20;    Safety Assessment JSON

&#x20;               │

&#x20;               ▼

&#x20;        Next.js UI

&#x20;               │

&#x20;       ┌───────┼────────┐

&#x20;       ▼       ▼        ▼

&#x20;    Context Prediction  Map

15\. Local Development

Backend



Open PowerShell:



cd C:\\Projects\\SafeLensAI\\backend



Activate the virtual environment:



.\\.venv\\Scripts\\Activate.ps1



Start FastAPI:



uvicorn main:app --reload



Backend:



http://127.0.0.1:8000

Frontend



Open another PowerShell terminal:



cd C:\\Projects\\SafeLensAI\\frontend



Start Next.js:



npm run dev



Frontend:



http://localhost:3000

16\. Environment and Security



Development-generated and secret files should not be committed to GitHub.



Examples:



.venv/

node\_modules/

.next/

\_\_pycache\_\_/

.env



Before production deployment, SafeLensAI still needs:



production environment variables

secret management

API rate limiting

stronger CORS configuration

request validation

structured logging

monitoring

error tracking

abuse protection

provider usage-policy compliance

17\. Git and GitHub



Repository:



https://github.com/anshikamishra28/SafeLensAI



Default branch:



main



Current major development commit:



8272eb2

Add safety intelligence and prediction features



Current Git workflow:



Make change

&#x20;   ↓

Test locally

&#x20;   ↓

git status

&#x20;   ↓

git add .

&#x20;   ↓

git commit

&#x20;   ↓

git push

&#x20;   ↓

GitHub updated

18\. Implementation Timeline



The dates below are based on the actual Git commit history of the project.



Times are recorded in IST where available.



Date	Milestone	Commit

31 Aug 2026	SafeLensAI project initialization	3d9b1d5

31 Aug 2026	Backend foundation	1ae7d1d

31 Aug 2026	Frontend ↔ backend connection	ae73f53

31 Aug 2026	Location-aware safety API	0145721

31 Aug 2026	OpenStreetMap geocoding	994fe79

1 Sep 2026	Explainable safety assessment	84fd7c8

1 Sep 2026	Location search dashboard	ac92477

1 Sep 2026	Safety assessment interface improvements	59cbec7

1 Sep 2026	Frontend safety-assessment integration	fe0b004

1 Sep 2026	Explainable risk-engine cleanup	e255ec5

23 Sep 2026	Safety intelligence + prediction features	8272eb2

Major milestone — 23 September 2026



The latest major implementation milestone introduced:



Bengaluru historical crime dataset

Bengaluru police-station dataset

nearest police-station service

prediction feature construction

transparent baseline prediction

prediction context UI

interactive safety map

expanded safety-assessment response

GitHub-backed project development

19\. Current Status Checklist

Application

&#x20;Next.js frontend

&#x20;FastAPI backend

&#x20;Frontend/backend integration

&#x20;Location search

&#x20;Weather integration

&#x20;OpenStreetMap integration

&#x20;Nearby infrastructure

&#x20;Police-station dataset

&#x20;Nearest police station

&#x20;Historical crime dataset

&#x20;Structured evidence

&#x20;Explainable safety assessment

&#x20;Transparent baseline prediction

&#x20;Interactive map

&#x20;Prediction Context UI

&#x20;GitHub repository

Still to build

&#x20;Automated backend tests

&#x20;Frontend/component tests

&#x20;API integration tests

&#x20;Production database

&#x20;Data ingestion pipelines

&#x20;Data freshness tracking

&#x20;Better incident data

&#x20;More granular safety signals

&#x20;Temporal intelligence

&#x20;Production deployment

&#x20;Monitoring

&#x20;CI/CD

&#x20;Validated ML model

20\. Future Work

Phase 1 — Engineering Foundation

&#x20;Comprehensive backend tests

&#x20;Frontend component tests

&#x20;API integration tests

&#x20;Structured logging

&#x20;Centralized error handling

&#x20;Stronger request validation

&#x20;API documentation improvements

&#x20;Health/readiness checks

&#x20;Production configuration

Phase 2 — Data Engineering

&#x20;Repeatable data ingestion pipelines

&#x20;Data-source provenance

&#x20;Data freshness tracking

&#x20;Data-quality validation

&#x20;External-provider failure handling

&#x20;Caching

&#x20;Automated dataset updates

Phase 3 — Database



The long-term data layer can move from static CSV files to:



PostgreSQL

&#x20;    │

&#x20;    ├── Locations

&#x20;    ├── Evidence

&#x20;    ├── Weather Observations

&#x20;    ├── Infrastructure

&#x20;    ├── Police Stations

&#x20;    ├── Incidents

&#x20;    ├── Historical Statistics

&#x20;    └── Prediction Results



PostGIS can later be considered for production geospatial queries.



Phase 4 — More Safety Signals



Potential future sources/signals:



verified incident reports

traffic conditions

road characteristics

lighting infrastructure

public transport

road accessibility

emergency response infrastructure

time-of-day

day-of-week

historical weather

additional official/public datasets



Every new source should be evaluated for:



reliability

geographic resolution

temporal resolution

licensing

privacy

bias

update frequency

Phase 5 — Temporal Intelligence



Planned derived features:



hour

day\_of\_week

month

is\_weekend

is\_night



These can be derived from the assessment timestamp without inventing external data.



Phase 6 — Machine Learning



A true ML model should only be introduced when sufficiently granular and reliable training labels are available.



Planned pipeline:



Raw Data

&#x20;   ↓

Data Cleaning

&#x20;   ↓

Feature Engineering

&#x20;   ↓

Training Dataset

&#x20;   ↓

Model Training

&#x20;   ↓

Validation

&#x20;   ↓

Calibration

&#x20;   ↓

Model Registry

&#x20;   ↓

Prediction API



The transparent baseline should remain available even after ML is introduced so the system can preserve interpretability and provide a baseline for comparison.



Phase 7 — Production Deployment



Target architecture:



&#x20;                   Internet

&#x20;                      │

&#x20;                      ▼

&#x20;                CDN / Edge

&#x20;                      │

&#x20;           ┌──────────┴──────────┐

&#x20;           ▼                     ▼

&#x20;      Next.js App           API Service

&#x20;                                 │

&#x20;                   ┌─────────────┼─────────────┐

&#x20;                   ▼             ▼             ▼

&#x20;              PostgreSQL      Cache      External APIs

&#x20;              / PostGIS



Production concerns include:



HTTPS

custom domain

secure environment variables

database backups

monitoring

rate limiting

authentication where required

API quotas

caching

observability

CI/CD

automated testing

deployment rollback

21\. Responsible Use



SafeLensAI is an informational safety-intelligence product.



It should never claim certainty that a location or person is safe.



Important limitations:



A high score is not a guarantee of safety.

Missing incident data does not mean no incidents occurred.

City-level crime statistics are not location-specific crime rates.

Nearby hospitals/pharmacies indicate infrastructure availability, not safety.

External data can be incomplete, delayed or unavailable.

Predictions should expose their evidence and uncertainty.

Future ML models should be evaluated for geographic, demographic and temporal bias.



The goal is to help users make better-informed decisions, not to replace personal judgment or emergency services.



22\. Development Philosophy



SafeLensAI is being developed incrementally:



Prototype

&#x20;   ↓

Real Data

&#x20;   ↓

Structured Evidence

&#x20;   ↓

Explainable Assessment

&#x20;   ↓

Feature Engineering

&#x20;   ↓

Validated Prediction

&#x20;   ↓

Production Infrastructure



The project intentionally avoids adding complexity merely for the appearance of being "AI-powered".



A future ML system should be introduced because the available data supports it — not simply because the product name contains "AI".



23\. Long-Term Vision



The long-term SafeLensAI platform is intended to combine:



&#x20;                      SafeLensAI

&#x20;                          │

&#x20;         ┌────────────────┴────────────────┐

&#x20;         │                                 │

&#x20;   User Experience                  Safety Intelligence

&#x20;         │                                 │

&#x20;  Next.js Dashboard                 Evidence Layer

&#x20;         │                                 │

&#x20;         │                    ┌────────────┼────────────┐

&#x20;         │                    │            │            │

&#x20;         │                 Weather     Location    Historical

&#x20;         │                              Context       Data

&#x20;         │                    │            │            │

&#x20;         │                    └────────────┼────────────┘

&#x20;         │                                 │

&#x20;         │                          Feature Layer

&#x20;         │                                 │

&#x20;         │                    ┌────────────┴────────────┐

&#x20;         │                    │                         │

&#x20;         │              Baseline Engine             ML Models

&#x20;         │                    │                         │

&#x20;         │                    └────────────┬────────────┘

&#x20;         │                                 │

&#x20;         └──────────────────────► Safety Intelligence



The long-term objective is a system that is:



data-driven

explainable

geographically aware

uncertainty-aware

privacy-conscious

scalable

production-ready

24\. Project Motto



Know the risk. Choose the safer way.



SafeLensAI is being built to make location-aware safety information more transparent, contextual and useful — one reliable data source at a time.





After pasting, press \*\*Ctrl + S\*\* and close Notepad.



Then tell me \*\*“saved”\*\*. We'll do the Git check next, and only then commit and push it to GitHub.

wait, you can easily update my genai readme file but not this, why, is there a permission issue



Yes — it is very likely a permission/connector-scope difference, and you caught an important distinction.



For your GenAI project, I was able to work with the repository through the available GitHub integration with write access. For SafeLensAI, when I tried to create README.md directly in:



anshikamishra28/SafeLensAI



GitHub returned:



403 — Resource not accessible by integration



So this isn't because the README is special or because the repository is public/private. The specific GitHub integration available in this conversation currently doesn't have content-write permission for that repository.



The good news



Your local Git setup does have permission, because you already successfully did:



git push -u origin main



So we have two separate access paths:



Access	SafeLensAI

Read repository through GitHub integration	Yes

Write repository files through GitHub integration	❌ 403

Your local Git credentials	✅ Yes

Push from your PC	✅ Yes



That's why I suggested creating the README locally and then pushing it normally.



And honestly, we don't need to change any GitHub permissions right now. Your existing local Git access is enough.



If you want, we can also 

check whether the GitHub integration has a repository-specific permission/configuration issue before doing anything else.



okay let me be honest, it's getting difficult to copy paste one by one , the content that you gave for the readme file, why dont you send it in a single copy paste format 



Absolutely. You’re right — copying dozens of separate blocks is unnecessarily painful.



I’ll give you the entire README as ONE single copy-paste block. You can copy everything inside it at once and paste directly into README.md.



\# SafeLensAI



> \*\*Know the risk. Choose the safer way.\*\*



SafeLensAI is a location-aware safety intelligence platform being developed to help users understand the \*\*safety-relevant context around a location\*\* before making a travel or movement decision.



The project combines real-world data sources, geospatial information, environmental conditions, historical crime context, structured evidence, and an explainable prediction layer.



SafeLensAI is being developed beyond a hackathon prototype with a focus on \*\*real data, explainability, uncertainty, maintainability, and production readiness\*\*.



\---



\## 1. Project Status



\*\*Current status: Active development — functional full-stack local application\*\*



\### Currently implemented



\- Next.js frontend

\- FastAPI backend

\- Frontend ↔ backend API integration

\- Location search and geocoding

\- OpenStreetMap integration

\- Open-Meteo weather integration

\- Nearby hospitals and pharmacies

\- Bengaluru police-station dataset

\- Nearest police-station calculation

\- Bengaluru 2023 historical crime dataset

\- Structured safety evidence models

\- Explainable safety assessment

\- Transparent baseline prediction engine

\- Prediction Context UI

\- Interactive Leaflet map

\- Police-station map visualization

\- Safety intelligence summary

\- Git/GitHub version control

\- Public GitHub repository



\### Important current limitation



The current prediction engine is \*\*not a machine-learning model\*\*.



It is a transparent, rule-based baseline that currently uses measurable environmental signals such as:



\- precipitation

\- wind speed

\- visibility



Historical crime data is currently used as \*\*city-level context\*\*, not as location-specific crime predictions.



\---



\# 2. Product Goal



The long-term goal of SafeLensAI is to answer:



> \*\*"What safety-relevant information is available around this location right now, how reliable is it, and what factors should the user consider?"\*\*



The platform is intentionally designed around evidence rather than presenting an unexplained `safe/unsafe` label.



\### Product principles



1\. Evidence before claims

2\. No fabricated crime data

3\. No false precision

4\. Explain predictions

5\. Show uncertainty

6\. Separate current signals from historical context

7\. Prefer free/open data sources where practical

8\. Keep the architecture ready for future ML models



\---



\# 3. System Architecture



```text

&#x20;                        ┌─────────────────────────┐

&#x20;                        │       User / Browser     │

&#x20;                        └────────────┬────────────┘

&#x20;                                     │

&#x20;                                     ▼

&#x20;                        ┌─────────────────────────┐

&#x20;                        │    Next.js Frontend      │

&#x20;                        │ React + TypeScript       │

&#x20;                        │ Tailwind + Leaflet       │

&#x20;                        └────────────┬────────────┘

&#x20;                                     │

&#x20;                                 HTTP / JSON

&#x20;                                     │

&#x20;                                     ▼

&#x20;                        ┌─────────────────────────┐

&#x20;                        │      FastAPI API         │

&#x20;                        │        Python            │

&#x20;                        └────────────┬────────────┘

&#x20;                                     │

&#x20;         ┌───────────────────────────┼───────────────────────────┐

&#x20;         │                           │                           │

&#x20;         ▼                           ▼                           ▼

&#x20;┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐

&#x20;│ External Sources│       │ Local Data        │       │ Feature Layer    │

&#x20;├─────────────────┤       ├──────────────────┤       ├──────────────────┤

&#x20;│ Nominatim       │       │ Crime CSV        │       │ Weather          │

&#x20;│ Open-Meteo      │       │ Police CSV       │       │ Infrastructure   │

&#x20;│ OpenStreetMap   │       │                  │       │ Evidence         │

&#x20;└─────────────────┘       └──────────────────┘       │ Historical       │

&#x20;                                                     └────────┬─────────┘

&#x20;                                                              │

&#x20;                                                              ▼

&#x20;                                                   ┌────────────────────┐

&#x20;                                                   │ Prediction Layer   │

&#x20;                                                   │ Transparent        │

&#x20;                                                   │ Baseline           │

&#x20;                                                   └─────────┬──────────┘

&#x20;                                                             │

&#x20;                                                             ▼

&#x20;                                                   ┌────────────────────┐

&#x20;                                                   │ Safety Assessment  │

&#x20;                                                   │ + Evidence         │

&#x20;                                                   │ + Prediction       │

&#x20;                                                   └────────────────────┘

Long-term architecture

Data Sources

&#x20;    ↓

Evidence Layer

&#x20;    ↓

Feature Layer

&#x20;    ↓

Prediction Layer

&#x20;    ↓

FastAPI

&#x20;    ↓

Next.js

&#x20;    ↓

User

4\. Repository Structure



Current high-level structure:



SafeLensAI/

│

├── frontend/

│   ├── app/

│   ├── components/

│   ├── lib/

│   ├── package.json

│   └── package-lock.json

│

├── backend/

│   ├── main.py

│   │

│   ├── models/

│   │   └── safety.py

│   │

│   ├── services/

│   │   ├── crime\_history.py

│   │   ├── geocoding.py

│   │   ├── places.py

│   │   ├── police\_stations.py

│   │   ├── prediction.py

│   │   ├── risk.py

│   │   └── weather.py

│   │

│   ├── data/

│   │   ├── bengaluru\_crime\_2023.csv

│   │   └── bengaluru\_police\_stations.csv

│   │

│   └── .venv/

│

├── README.md

└── .gitignore

5\. Backend Architecture



The backend is built using FastAPI + Python.



backend/main.py



Main FastAPI application.



Responsibilities:



API routes

request handling

collecting data from services

creating safety context

running assessment

running prediction

returning structured JSON responses

backend/models/safety.py



Contains the main Pydantic models.



Current models include:



Location

SafetySignal

Incident

NearbyPlace

Evidence

SafetyContext

SafetyAssessment

SafetyAssessmentResponse



These models provide a structured foundation for the safety intelligence layer.



backend/services/geocoding.py



Responsible for converting a user-entered location into:



latitude

longitude

address/display name



Data source:



OpenStreetMap Nominatim



backend/services/weather.py



Retrieves current environmental information from Open-Meteo.



Current fields include:



temperature

precipitation

wind speed

weather code

visibility

backend/services/places.py



Retrieves nearby mapped infrastructure from OpenStreetMap.



Current useful categories include:



hospitals

pharmacies

police

fire stations



These are currently treated as supporting infrastructure, not direct proof of safety.



backend/services/crime\_history.py



Loads historical Bengaluru crime statistics from the local CSV dataset.



The data is treated as historical city-level context.



backend/services/police\_stations.py



Loads mapped Bengaluru police-station locations.



It calculates the nearest police station using geographic distance.



The result includes:



station name

latitude

longitude

distance from selected location

backend/services/risk.py



Contains the explainable safety assessment logic.



It evaluates available evidence such as:



precipitation

wind

visibility

nearby infrastructure



The system intentionally distinguishes:



No evidence of danger



from:



Evidence that the location is safe

backend/services/prediction.py



Contains the current prediction layer.



It has two major responsibilities:



Build structured prediction features.

Generate the transparent baseline prediction.



The current implementation is intentionally not called AI/ML.



6\. Frontend Architecture



The frontend is built using:



Next.js

React

TypeScript

Tailwind CSS

Leaflet

React-Leaflet



Important files include:



frontend/

├── app/

├── components/

│   └── SafetyMap.tsx

└── lib/

&#x20;   └── api.ts



The frontend currently displays:



location search

safety assessment

risk level

prediction confidence

prediction factors

environmental context

nearby infrastructure

historical crime context

interactive map

nearest police station

police-station distance

safety intelligence information

7\. API Architecture



Local backend:



http://127.0.0.1:8000



Frontend:



http://localhost:3000

GET /health



Checks whether the backend is running.



Example:



GET http://127.0.0.1:8000/health

GET /api/v1/geocode



Converts a location query into coordinates.



Parameter

q



Example:



GET /api/v1/geocode?q=Cubbon%20Park%20Bengaluru

Data source



OpenStreetMap Nominatim.



GET /api/v1/assessment



Main safety intelligence endpoint.



Parameters

latitude

longitude

radius\_m



Example:



GET /api/v1/assessment?latitude=12.9716\&longitude=77.5946\&radius\_m=1000

Response includes

assessment

weather

nearby\_places

incidents

data\_sources

prediction\_features

prediction

GET /api/v1/police-stations/nearest



Finds the nearest mapped police station.



Parameters

latitude

longitude



Example:



GET /api/v1/police-stations/nearest?latitude=12.9716\&longitude=77.5946

8\. External Data Sources



SafeLensAI currently uses public/free sources wherever practical.



OpenStreetMap



Website:



https://www.openstreetmap.org/



Used for:



map data

nearby infrastructure

hospitals

pharmacies

mapped emergency-related places

Nominatim



Website:



https://nominatim.org/



Used for:



location search

geocoding



Public Nominatim usage is subject to its usage policy and rate limits.



Open-Meteo



Website:



https://open-meteo.com/



Used for current weather information.



Current fields:



temperature

precipitation

wind speed

weather code

visibility

OpenCity — Bengaluru Crime Data 2023



Dataset:



https://data.opencity.in/dataset/bengaluru-crime-data-2023



Used for historical Bengaluru-wide crime context.



Important:



These statistics are aggregate city-level data. They are not location-specific incident records.



Therefore SafeLensAI does not convert these statistics into fake map pins.



OpenCity — Police Station Locations



Dataset:



https://data.opencity.in/dataset/police-station-locations



Used for mapped Bengaluru police-station locations.



The source contains approximately 135 mapped police stations.



9\. Local CSV Data

bengaluru\_crime\_2023.csv



Location:



backend/data/bengaluru\_crime\_2023.csv



Current columns:



Type of Crime

2021 Reported

2021 Detected

2022 Reported

2022 Detected

2023 Reported

2023 Detected



Current categories include examples such as:



Murder

Dacoity

Robbery

Chain Snatching

HBT (Day)

HBT (Night)

House Thefts

Motor Vehicle Thefts

Ordinary Thefts



This dataset provides historical context rather than current location-specific incidents.



bengaluru\_police\_stations.csv



Location:



backend/data/bengaluru\_police\_stations.csv



Important fields:



POL\_STAName

latitude

longitude



This dataset powers the nearest police-station feature.



10\. Evidence Architecture



SafeLensAI is designed around structured evidence.



Conceptually:



Location

&#x20;  │

&#x20;  ├── Weather

&#x20;  ├── Nearby Infrastructure

&#x20;  ├── Police Stations

&#x20;  ├── Historical Crime Context

&#x20;  └── Future Data Sources

&#x20;         │

&#x20;         ▼

&#x20;   Evidence Layer

&#x20;         │

&#x20;         ▼

&#x20;   Safety Context

&#x20;         │

&#x20;         ▼

&#x20;   Feature Layer

&#x20;         │

&#x20;         ▼

&#x20;   Prediction Layer



Each evidence signal is designed to preserve information such as:



source

signal type

value

observation time

confidence

metadata



This will make the system more auditable as the project grows.



11\. Current Prediction Engine



The current prediction engine is called:



Transparent Baseline Predictor



It is not currently an ML model.



Current environmental signals

Precipitation



Higher precipitation can contribute environmental risk points.



Wind



Higher wind speeds can contribute environmental risk points.



Visibility



Low visibility can contribute environmental risk points.



Current behavior



If no significant current environmental risk evidence is available, the system may return:



score = null

risk\_level = unknown

confidence = 0.35



This is intentional.



SafeLensAI does not make the logical mistake:



No evidence of danger

&#x20;       ≠

Evidence of safety



When meaningful environmental risk evidence exists, the baseline can produce a bounded score together with explanatory factors.



12\. Prediction Features



Current structured features include:



weather\_available

precipitation\_mm

wind\_speed\_kmh

visibility\_m



nearby\_hospitals

nearby\_pharmacies



evidence\_count



historical\_crime\_available

historical\_crime\_records

historical\_total\_reported\_crime

historical\_total\_detected\_crime

historical\_detection\_rate



reported\_robbery

reported\_chain\_snatching

reported\_hbt\_night

reported\_vehicle\_theft

reported\_ordinary\_theft



Historical crime features are currently used as context rather than direct location-specific prediction labels.



13\. Map Architecture



The map uses:



Leaflet

React-Leaflet

OpenStreetMap tiles



Current map features:



selected location marker

nearest police station marker

police station popup

distance display

connecting line between selected location and police station



The map is intended to become the foundation for future geospatial safety layers.



Possible future layers:



verified incidents

roads

lighting infrastructure

public transport

hospitals

pharmacies

emergency services

statistically valid historical heatmaps

14\. End-to-End Workflow

User enters location

&#x20;       │

&#x20;       ▼

Next.js sends request

&#x20;       │

&#x20;       ▼

FastAPI geocoding

&#x20;       │

&#x20;       ▼

Latitude + Longitude

&#x20;       │

&#x20;       ├───────────────┐

&#x20;       ▼               ▼

&#x20;    Weather       Nearby Places

&#x20;       │               │

&#x20;       └───────┬───────┘

&#x20;               ▼

&#x20;      Historical Context

&#x20;               │

&#x20;               ▼

&#x20;       Safety Context

&#x20;               │

&#x20;               ▼

&#x20;      Evidence Collection

&#x20;               │

&#x20;               ▼

&#x20;      Feature Construction

&#x20;               │

&#x20;               ▼

&#x20;     Transparent Predictor

&#x20;               │

&#x20;               ▼

&#x20;    Safety Assessment JSON

&#x20;               │

&#x20;               ▼

&#x20;        Next.js UI

&#x20;               │

&#x20;       ┌───────┼────────┐

&#x20;       ▼       ▼        ▼

&#x20;    Context Prediction  Map

15\. Local Development

Backend



Open PowerShell:



cd C:\\Projects\\SafeLensAI\\backend



Activate the virtual environment:



.\\.venv\\Scripts\\Activate.ps1



Start FastAPI:



uvicorn main:app --reload



Backend:



http://127.0.0.1:8000

Frontend



Open another PowerShell terminal:



cd C:\\Projects\\SafeLensAI\\frontend



Start Next.js:



npm run dev



Frontend:



http://localhost:3000

16\. Environment and Security



Development-generated and secret files should not be committed to GitHub.



Examples:



.venv/

node\_modules/

.next/

\_\_pycache\_\_/

.env



Before production deployment, SafeLensAI still needs:



production environment variables

secret management

API rate limiting

stronger CORS configuration

request validation

structured logging

monitoring

error tracking

abuse protection

provider usage-policy compliance

17\. Git and GitHub



Repository:



https://github.com/anshikamishra28/SafeLensAI



Default branch:



main



Current major development commit:



8272eb2

Add safety intelligence and prediction features



Current Git workflow:



Make change

&#x20;   ↓

Test locally

&#x20;   ↓

git status

&#x20;   ↓

git add .

&#x20;   ↓

git commit

&#x20;   ↓

git push

&#x20;   ↓

GitHub updated

18\. Implementation Timeline



The dates below are based on the actual Git commit history of the project.



Times are recorded in IST where available.



Date	Milestone	Commit

31 Aug 2026	SafeLensAI project initialization	3d9b1d5

31 Aug 2026	Backend foundation	1ae7d1d

31 Aug 2026	Frontend ↔ backend connection	ae73f53

31 Aug 2026	Location-aware safety API	0145721

31 Aug 2026	OpenStreetMap geocoding	994fe79

1 Sep 2026	Explainable safety assessment	84fd7c8

1 Sep 2026	Location search dashboard	ac92477

1 Sep 2026	Safety assessment interface improvements	59cbec7

1 Sep 2026	Frontend safety-assessment integration	fe0b004

1 Sep 2026	Explainable risk-engine cleanup	e255ec5

23 Sep 2026	Safety intelligence + prediction features	8272eb2

Major milestone — 23 September 2026



The latest major implementation milestone introduced:



Bengaluru historical crime dataset

Bengaluru police-station dataset

nearest police-station service

prediction feature construction

transparent baseline prediction

prediction context UI

interactive safety map

expanded safety-assessment response

GitHub-backed project development

19\. Current Status Checklist

Application

&#x20;Next.js frontend

&#x20;FastAPI backend

&#x20;Frontend/backend integration

&#x20;Location search

&#x20;Weather integration

&#x20;OpenStreetMap integration

&#x20;Nearby infrastructure

&#x20;Police-station dataset

&#x20;Nearest police station

&#x20;Historical crime dataset

&#x20;Structured evidence

&#x20;Explainable safety assessment

&#x20;Transparent baseline prediction

&#x20;Interactive map

&#x20;Prediction Context UI

&#x20;GitHub repository

Still to build

&#x20;Automated backend tests

&#x20;Frontend/component tests

&#x20;API integration tests

&#x20;Production database

&#x20;Data ingestion pipelines

&#x20;Data freshness tracking

&#x20;Better incident data

&#x20;More granular safety signals

&#x20;Temporal intelligence

&#x20;Production deployment

&#x20;Monitoring

&#x20;CI/CD

&#x20;Validated ML model

20\. Future Work

Phase 1 — Engineering Foundation

&#x20;Comprehensive backend tests

&#x20;Frontend component tests

&#x20;API integration tests

&#x20;Structured logging

&#x20;Centralized error handling

&#x20;Stronger request validation

&#x20;API documentation improvements

&#x20;Health/readiness checks

&#x20;Production configuration

Phase 2 — Data Engineering

&#x20;Repeatable data ingestion pipelines

&#x20;Data-source provenance

&#x20;Data freshness tracking

&#x20;Data-quality validation

&#x20;External-provider failure handling

&#x20;Caching

&#x20;Automated dataset updates

Phase 3 — Database



The long-term data layer can move from static CSV files to:



PostgreSQL

&#x20;    │

&#x20;    ├── Locations

&#x20;    ├── Evidence

&#x20;    ├── Weather Observations

&#x20;    ├── Infrastructure

&#x20;    ├── Police Stations

&#x20;    ├── Incidents

&#x20;    ├── Historical Statistics

&#x20;    └── Prediction Results



PostGIS can later be considered for production geospatial queries.



Phase 4 — More Safety Signals



Potential future sources/signals:



verified incident reports

traffic conditions

road characteristics

lighting infrastructure

public transport

road accessibility

emergency response infrastructure

time-of-day

day-of-week

historical weather

additional official/public datasets



Every new source should be evaluated for:



reliability

geographic resolution

temporal resolution

licensing

privacy

bias

update frequency

Phase 5 — Temporal Intelligence



Planned derived features:



hour

day\_of\_week

month

is\_weekend

is\_night



These can be derived from the assessment timestamp without inventing external data.



Phase 6 — Machine Learning



A true ML model should only be introduced when sufficiently granular and reliable training labels are available.



Planned pipeline:



Raw Data

&#x20;   ↓

Data Cleaning

&#x20;   ↓

Feature Engineering

&#x20;   ↓

Training Dataset

&#x20;   ↓

Model Training

&#x20;   ↓

Validation

&#x20;   ↓

Calibration

&#x20;   ↓

Model Registry

&#x20;   ↓

Prediction API



The transparent baseline should remain available even after ML is introduced so the system can preserve interpretability and provide a baseline for comparison.



Phase 7 — Production Deployment



Target architecture:



&#x20;                   Internet

&#x20;                      │

&#x20;                      ▼

&#x20;                CDN / Edge

&#x20;                      │

&#x20;           ┌──────────┴──────────┐

&#x20;           ▼                     ▼

&#x20;      Next.js App           API Service

&#x20;                                 │

&#x20;                   ┌─────────────┼─────────────┐

&#x20;                   ▼             ▼             ▼

&#x20;              PostgreSQL      Cache      External APIs

&#x20;              / PostGIS



Production concerns include:



HTTPS

custom domain

secure environment variables

database backups

monitoring

rate limiting

authentication where required

API quotas

caching

observability

CI/CD

automated testing

deployment rollback

21\. Responsible Use



SafeLensAI is an informational safety-intelligence product.



It should never claim certainty that a location or person is safe.



Important limitations:



A high score is not a guarantee of safety.

Missing incident data does not mean no incidents occurred.

City-level crime statistics are not location-specific crime rates.

Nearby hospitals/pharmacies indicate infrastructure availability, not safety.

External data can be incomplete, delayed or unavailable.

Predictions should expose their evidence and uncertainty.

Future ML models should be evaluated for geographic, demographic and temporal bias.



The goal is to help users make better-informed decisions, not to replace personal judgment or emergency services.



22\. Development Philosophy



SafeLensAI is being developed incrementally:



Prototype

&#x20;   ↓

Real Data

&#x20;   ↓

Structured Evidence

&#x20;   ↓

Explainable Assessment

&#x20;   ↓

Feature Engineering

&#x20;   ↓

Validated Prediction

&#x20;   ↓

Production Infrastructure



The project intentionally avoids adding complexity merely for the appearance of being "AI-powered".



A future ML system should be introduced because the available data supports it — not simply because the product name contains "AI".



23\. Long-Term Vision



The long-term SafeLensAI platform is intended to combine:



&#x20;                      SafeLensAI

&#x20;                          │

&#x20;         ┌────────────────┴────────────────┐

&#x20;         │                                 │

&#x20;   User Experience                  Safety Intelligence

&#x20;         │                                 │

&#x20;  Next.js Dashboard                 Evidence Layer

&#x20;         │                                 │

&#x20;         │                    ┌────────────┼────────────┐

&#x20;         │                    │            │            │

&#x20;         │                 Weather     Location    Historical

&#x20;         │                              Context       Data

&#x20;         │                    │            │            │

&#x20;         │                    └────────────┼────────────┘

&#x20;         │                                 │

&#x20;         │                          Feature Layer

&#x20;         │                                 │

&#x20;         │                    ┌────────────┴────────────┐

&#x20;         │                    │                         │

&#x20;         │              Baseline Engine             ML Models

&#x20;         │                    │                         │

&#x20;         │                    └────────────┬────────────┘

&#x20;         │                                 │

&#x20;         └──────────────────────► Safety Intelligence



The long-term objective is a system that is:



data-driven

explainable

geographically aware

uncertainty-aware

privacy-conscious

scalable

production-ready

24\. Project Motto



Know the risk. Choose the safer way.



SafeLensAI is being built to make location-aware safety information more transparent, contextual and useful — one reliable data source at a time.

