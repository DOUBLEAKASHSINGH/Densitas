# OptiFlow Enterprise: Spatial Intelligence & Crowd Control SaaS

![OptiFlow](https://img.shields.io/badge/Status-Live-success) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20C++-indigo)

OptiFlow Enterprise is a production-grade spatial intelligence and crowd orchestration platform built for high-density live events, transit hubs, and large-scale venues. By combining edge-computed IoT telemetry, predictive machine learning regression models, and deterministic multi-agent orchestration, OptiFlow converts raw camera and sensor data into proactive safety routing. This platform serves to eliminate bottlenecks, monitor gate flow rates, and mitigate the risk of crowd crushes through autonomous incident detection.

---

## System Architecture

The platform operates on a tiered, hybrid-edge pipeline designed for extreme low-latency processing and deterministic reliability during mass-gathering events.

### 1. Data Collection and Edge Telemetry Processing
- **IoT & Camera Telemetry Specification**: In a physical deployment, computer-vision nodes and LiDAR sensors placed at venue choke-points calculate real-time footfall, directional flow rates, and velocity vectors. These sensors transmit lightweight JSON payloads over local MQTT or HTTP protocols.
- **C++ Edge Constraints**: Lightweight C++ applications (e.g., `edge_telemetry_parser.cpp`, `edge_mock_fallback.cpp`, `edge_auth.cpp`, `edge_saas.cpp`) simulate the low-level memory-safe parsing of this hardware telemetry before it reaches the cloud. These applications are strictly authored utilizing the `using namespace std;` directive to comply with specific computational edge constraints and bypass `std::` bottlenecks. They demonstrate how raw bytestreams are converted into structured metric arrays locally.
- **The Telemetry Simulator Engine (`stream_generator.py`)**: For demonstration and hackathon environments, a local Python script generates stochastic human traffic. It injects natural sine-wave fluctuations to represent organic crowd movement and occasionally triggers massive randomized numerical surges to aggressively test the backend's stress responses and the threshold limits of the agents.

### 2. The Multi-Agent Orchestration Pipeline (Backend Core)
The backend service is built in **Python 3.11** using the **FastAPI** framework to ensure high-throughput asynchronous processing.
When the `/ingest` API endpoint receives a telemetry packet from the edge, it routes the payload through a synchronous deterministic pipeline located within `agents.py`:
1. **DensityAgent**: This agent ingests the raw footfall and calculates absolute volume percentages based on predefined maximum architectural capacities (e.g., if Hall 1 maximum capacity is 2000, and current headcount is 1500, it sets capacity to 75%).
2. **PredictionAgent**: This agent acts as a proxy for an XGBoost regression model. It evaluates the current rolling flow-rate and velocity window to probabilistically forecast the specific zone's capacity exactly 5 minutes into the future.
3. **DecisionAgent**: The deterministic rule engine. If the predicted future capacity exceeds predefined safety thresholds (e.g., Warning at 70%, Critical at 85%), it triggers hardcoded, zero-hallucination tactical responses such as routing traffic, deploying personnel, or changing signage.
4. **AlertAgent**: This agent finalizes the pipeline by serializing the states of all previous agents into a strict, unified JSON payload for frontend consumption.

### 3. Real-Time Transport Layer (WebSockets)
FastAPI maintains an active, persistent `ConnectionManager` utilizing asynchronous WebSockets. The `AlertAgent` hooks directly into this event bus, instantly broadcasting the serialized telemetry to all active frontend React clients via the `wss://[domain]/ws/dashboard` endpoint at a sub-100ms latency.

### 4. Data Storage and Time-Series Preprocessing
- **TimescaleDB (PostgreSQL via Supabase)**: The database schema (`schema.sql`) is hyper-optimized for time-series ingestion. 
- **Entity Tables Maintenance**: Venue meta-data, zone architectural boundaries, maximum capacity limits, and GPS coordinates are stored in static, normalized relational tables.
- **Telemetry Indexing**: Raw footfall data is indexed aggressively by UTC timestamps and `zone_id`. This allows downstream analytical pipelines to perform complex aggregations for continuous machine learning model retraining without slowing down active reads.

---

## Frontend Architecture (React Single Page Application)

The frontend is a completely custom **React** Single Page Application (SPA), styled exclusively with **Tailwind CSS**. It abandons the traditional dark-neon aesthetic for a pristine, light-mode enterprise SaaS design system utilizing `slate` and `indigo` palettes.

### Core Features and Granular Views:
- **True Edge-to-Edge Viewport Mapping**: The application is strictly bound to `100vw` and `100vh`. No global scrolling is permitted on the window level. Instead, internal grid widgets utilizing a `grid-cols-12` structural standard handle their own `overflow-y-auto` rules. This completely maximizes screen real-estate and creates a command-center feel.
- **Authentication Wall Integration (`/`)**: A secure Email/Password authentication gate protecting the operational layers. It utilizes the Firebase Authentication SDK (`firebase.js`) to securely pass credentials (`createUserWithEmailAndPassword` and `signInWithEmailAndPassword`), managing active loading states and parsing verbose error handling codes (e.g., invalid-credential) for the user.
- **The Cascading India Location Matrix (`/select-location`)**: A deeply nested, entirely localized JSON state tree containing all 28 Indian States, 8 Union Territories, and dozens of major cities. 
  - Selecting a valid, pre-registered event (e.g., "Pharma Pro & Pack Expo" at HITEX) passes precise GPS coordinate floats and detailed Gate array counts deep into the React Router state.
  - **Fallback Sandbox Mode**: Selecting a city with no active deployments (e.g., Mumbai) reveals a specialized empty state. Clicking "Load Sandbox Mode" bypasses the absence of data by routing the user to a simulated venue utilizing central Indian GPS coordinates and a default 4-gate array.
- **The Command Dashboard (`/dashboard`)**:
  - **Dynamic Stadium Map (`react-leaflet`)**: Consumes lightweight `CartoDB Positron` tiles. It utilizes a custom React hook to dynamically fly the Leaflet camera to the exact coordinates passed from the location selector state. It renders pulsating polylines representing evacuation routes and specific `CircleMarkers` dynamically sized and colored based on zone density thresholds.
  - **Gate Monitor Component**: Dynamically parses the active event's gate array to render a highly responsive multi-column grid (`grid-cols-2` scaling to `grid-cols-4`). It isolates and tracks localized flow rates and congestion indexes per individual gate.
  - **Dispatch and Signage UI**: Renders active security personnel deployment rosters based on the ML pipeline's threshold breaches. Ensures absolute text truncation prevention using explicit flex-box sizing.
  - **Recharts Occupancy Graph**: Plots the historical and 5-minute predicted capacity over time in a smooth, multi-line spline graph.
  - **Autonomous Fallback Telemetry Loop**: An aggressive `useEffect` safeguard. If the live WebSocket connection is severed or unreachable, the dashboard bypasses the "Disconnected" error. It actively sets the UI stream badge to "Simulated" and triggers an internal 1.5-second local mock interval. This interval autonomously populates all charts, maps, gate monitors, and terminal logs with calculated sine-wave fluctuations, ensuring the dashboard remains highly active and presentable during pitches without a running backend.

---

## Deployment Operations and CI/CD Pipelines

OptiFlow utilizes a split-deployment, Infrastructure-as-Code (IaC) continuous integration pipeline.

### Backend Infrastructure (Render.com)
The FastAPI backend is deployed on Render utilizing an explicit `render.yaml` Blueprint definition.
- **Environment Targeting**: Native Python 3.11 environment.
- **Plan Constraints**: Explicitly configured for the `free` tier instance.
- **Build Command Execution**: Executes `pip install --no-cache-dir -r requirements.txt` to strictly manage dependencies without bloat.
- **Start Command Execution**: Executes `uvicorn main:app --host 0.0.0.0 --port $PORT` to bind the ASGI server to the dynamic container port.
- *Note: Render automatically terminates SSL, exposing the secure `wss://` protocol for the React dashboard.*

### Frontend Infrastructure (Vercel)
The React application is deployed on Vercel's global edge network. 
- Integrated directly via GitHub push-hooks targeting the `main` branch.
- Any repository push triggers a Vite production build sequence (`npm run build`) and instant edge deployment.
- React Router DOM paths are natively supported by Vercel's internal rewrite configurations, ensuring zero 404 errors on direct sub-path navigation.

---

## Local Development and Initialization Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- Python (3.11.0 or higher)
- Git

### 1. Initializing the React Frontend
Open your terminal and execute the following commands to install Node Modules and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser. 

### 2. Initializing the FastAPI Backend Server
Open a secondary terminal and execute the following to install the Python dependencies and launch the Uvicorn server:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The FastAPI application will boot and begin listening on `http://localhost:8000`.

### 3. Triggering the Hardware Simulator
In a tertiary terminal, run the local telemetry generator to push data into the pipeline:
```bash
cd backend
python stream_generator.py
```
This script will immediately target the `http://localhost:8000/api/telemetry` endpoint and begin aggressively pushing simulated foot traffic JSON payloads into the Multi-Agent pipeline. The React dashboard will process the incoming WebSockets and visualize the data in real-time.
