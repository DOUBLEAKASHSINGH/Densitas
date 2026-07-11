# OptiFlow 🏟️

OptiFlow is a deterministic, AI-driven live event crowd control system built to predict, manage, and mitigate massive crowd surges in real-time. 

## 🚀 Features

- **Live Telemetry Ingestion**: Sub-second data streaming through a lightning-fast FastAPI backend.
- **Deterministic Multi-Agent System**:
  - `DensityAgent`: Calculates real-time zone capacities.
  - `PredictionAgent`: Projects future crowd density using lightweight mathematical regression (strictly avoiding LLM hallucinations).
  - `DecisionAgent`: Triggers strict, deterministic protocols based on predictive safety thresholds.
  - `AlertAgent`: Formats perfectly structured JSON logic for downstream systems.
- **Real-Time Event Bus**: WebSockets broadcast the completely evaluated venue state instantly to connected dashboards.
- **Cyberpunk Command Center**: A sleek React (Vite) + Tailwind CSS dashboard visualizing live heatmaps (Leaflet) and predictive charts (Recharts).
- **Edge Deployment Ready**: Fully compliant with strict C++ edge proxy constraints for high-frequency hardware preprocessing.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Uvicorn, Pandas, WebSockets
- **Frontend**: React (Vite), Tailwind CSS v3, Recharts, React-Leaflet
- **Database**: Supabase (PostgreSQL + TimescaleDB for hyper-table time-series optimization)
- **Deployment**: Vercel (Frontend), Render (Backend), Docker Compose

## 🏃‍♂️ Running Locally

Start the entire stack instantly using Docker:

```bash
docker-compose up --build
```

### Manual Startup

1. **Backend API**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
2. **Telemetry Simulator**:
   ```bash
   cd backend
   python stream_generator.py
   ```
3. **Command Center Dashboard**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Navigate to `http://localhost:5173` to view the live OptiFlow dashboard.

## ☁️ Cloud Deployment

- **Render**: The `render.yaml` blueprint automates the backend infrastructure. Ensure you map a PostgreSQL database for full TimescaleDB data persistence.
- **Vercel**: The `frontend/vercel.json` ensures smooth SPA routing. Set `VITE_WS_URL` to your Render backend WebSocket URL in your Vercel project settings (e.g., `wss://optiflow-backend.onrender.com/ws/dashboard`).
