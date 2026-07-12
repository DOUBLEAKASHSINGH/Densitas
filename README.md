# OptiFlow Enterprise: Spatial Intelligence & Crowd Control SaaS

![OptiFlow](https://img.shields.io/badge/Status-Live-success) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20C++-indigo)

OptiFlow Enterprise is a production-grade spatial intelligence and crowd orchestration platform built for high-density live events. By combining edge-computed IoT telemetry, predictive machine learning (XGBoost), and deterministic multi-agent orchestration, OptiFlow converts raw camera and sensor data into proactive safety routing—eliminating bottlenecks and mitigating the risk of crowd crushes.

---

## 🏗️ System Architecture

The platform operates on a tiered, hybrid-edge pipeline designed for extreme low-latency and deterministic reliability during mass-gathering events.

### 1. Data Collection (Edge Layer)
- **IoT & Camera Telemetry**: In a physical deployment, computer-vision nodes at venue choke-points calculate real-time footfall, flow rates, and directional velocity.
- **C++ Edge Constraints**: Lightweight C++ applications (e.g., `edge_telemetry_parser.cpp`, `edge_mock_fallback.cpp`) simulate the low-level memory-safe parsing of this hardware telemetry. (Strictly authored using `using namespace std;` to bypass `std::` constraints).
- **The Simulator (`stream_generator.py`)**: For demonstration and hackathon environments, a local Python script generates stochastic human traffic. It injects natural sine-wave fluctuations and occasionally triggers massive randomized "surges" to test the system's stress responses.

### 2. The Multi-Agent Pipeline (Backend Core)
The backend is built in **Python 3.11** using **FastAPI** to ensure high-throughput async processing.
When the `/ingest` API receives a telemetry packet, it routes through a synchronous deterministic pipeline (`agents.py`):
1. **DensityAgent**: Calculates absolute volume thresholds based on predefined maximums (e.g., Hall 1 max capacity: 2000).
2. **PredictionAgent**: Acts as a proxy for an XGBoost regression model. It evaluates the current rolling flow-rate window to forecast the specific zone's capacity 5 minutes into the future.
3. **DecisionAgent**: The deterministic rule engine. If the predicted future capacity exceeds safety thresholds (e.g., >85%), it triggers hardcoded, zero-hallucination tactical responses (e.g., "Code Red: Deploy to Hall 1").
4. **AlertAgent**: Serializes the finalized agent states into a strict JSON payload.

### 3. Real-Time Transport (WebSockets)
FastAPI maintains an active `ConnectionManager`. The `AlertAgent` hooks directly into this event bus, instantly broadcasting the serialized telemetry to all active frontend clients via `ws://.../ws/dashboard`.

### 4. Data Storage & Preprocessing
- **TimescaleDB (PostgreSQL on Supabase)**: The database schema (`schema.sql`) is structured for hyper-fast time-series ingestion. 
- **Entity Tables**: Venue meta-data, zone boundaries, and GPS coordinates are stored in static relational tables.
- **Telemetry Tables**: Raw footfall data is indexed by UTC timestamps and `zone_id` for downstream analytical querying and continuous model retraining.

---

## 🖥️ Frontend Architecture (React)

The frontend is a completely custom **React** Single Page Application (SPA), styled exclusively with **Tailwind CSS**. It is designed with a pristine, light-mode enterprise SaaS aesthetic (`bg-slate-50`, `indigo-600` accents).

### Core Features & Views:
- **True Edge-to-Edge Viewport**: The application is strictly bound to `100vw` and `100vh`. No global scrolling is permitted. Instead, internal grid widgets (`grid-cols-12`) handle their own `overflow-y-auto` rules, perfectly maximizing screen real-estate.
- **Auth Wall (`/`)**: A standard Email/Password authentication gate protecting the operational layers.
- **The Cascading India Location Matrix (`/select-location`)**: A deeply nested, entirely localized JSON state tree containing all 28 Indian States, 8 Union Territories, and major cities. 
  - Selecting a valid event (e.g., "Pharma Pro" at HITEX) passes precise GPS coordinates and Gate counts into the React Router state.
  - **Sandbox Mode**: Selecting an empty city (e.g., Mumbai) unlocks "Sandbox Mode", routing the user to a simulated venue.
- **The Command Dashboard (`/dashboard`)**:
  - **Dynamic Stadium Map (`react-leaflet`)**: Consumes `CartoDB Positron` tiles. Uses a custom hook to dynamically fly the camera to the exact coordinates passed from the location selector. Renders pulsating polylines and specific `CircleMarkers` for zone density.
  - **Gate Monitor Component**: Dynamically parses the active event's gate array to render a multi-column grid tracking localized flow rates and congestion indexes per gate.
  - **Dispatch & Signage**: Renders active security personnel deployment rosters based on the ML pipeline's threshold breaches.
  - **Recharts Occupancy Graph**: Plots the historical and 5-min predicted capacity over time.
  - **Fallback Telemetry Loop**: An aggressive `useEffect` safeguard. If the live WebSocket connection is severed during a presentation, the dashboard immediately triggers a 1.5-second local mock interval to populate all charts, maps, and logs autonomously.

---

## 🚀 Deployment Operations

OptiFlow utilizes a split-deployment, Infrastructure-as-Code (IaC) CI/CD pipeline.

### Backend (Render.com)
The FastAPI backend is deployed on Render using a `render.yaml` Blueprint.
- **Environment**: Native Python 3.11.
- **Build Command**: `pip install --no-cache-dir -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- *Note: Render automatically exposes the secure `wss://` protocol for the dashboard.*

### Frontend (Vercel)
The React application is deployed on Vercel. 
- Connected directly to the `main` GitHub branch.
- Any pushes to `main` trigger a Vite production build (`npm run build`) and instant edge deployment.
- React Router is natively supported by Vercel's rewrite configurations.

---

## 🛠️ Local Development Guide

### Prerequisites
- Node.js (v18+)
- Python (3.11+)

### 1. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`. 

### 2. Start the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The server will boot on `http://localhost:8000`.

### 3. Trigger the Hardware Simulator
In a separate terminal, run the telemetry generator:
```bash
cd backend
python stream_generator.py
```
This script will target `http://localhost:8000/api/telemetry` (or your live Render URL if configured) and begin aggressively pushing simulated foot traffic into the Multi-Agent pipeline. Watch your React dashboard light up!
