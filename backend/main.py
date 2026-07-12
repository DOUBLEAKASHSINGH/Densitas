import asyncio
import random
import time
from typing import List, Dict
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="OptiFlow Core Processing Engine")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------
# WEBSOCKET CONNECTION MANAGER
# ----------------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Handle dead client connections gracefully
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead)

manager = ConnectionManager()

# Data model for incoming edge telemetry
class TelemetryPayload(BaseModel):
    venue: str
    zone_id: str
    location_name: str
    headcount: int
    max_capacity: int
    flow_rate: float

# ----------------------------------------------------------------
# THE DETERMINISTIC MULTI-AGENT PIPELINE
# ----------------------------------------------------------------
class DensityAgent:
    def process(self, payload: TelemetryPayload) -> float:
        # Computes pure mathematical saturation profile
        if payload.max_capacity <= 0:
            return 0.0
        return round((payload.headcount / payload.max_capacity) * 100, 2)

class PredictionAgent:
    def process(self, current_density: float, flow_rate: float) -> float:
        # Proxy for XGBoost regression trend analysis looking 5 minutes ahead
        # If flow rate is positive, capacity is predicted to scale upwards linearly
        growth_factor = flow_rate * 0.45 
        predicted_density = current_density + growth_factor
        return round(max(0.0, min(100.0, predicted_density)), 2)

class DecisionAgent:
    def process(self, zone: str, current: float, predicted: float) -> Dict:
        # Explicit, non-hallucinating corporate safety logic rules
        status = "NORMAL"
        action = "MONITORING METRICS: Flow rates within nominal safety thresholds."
        dispatch = "Standby"
        signage = f"WELCOME TO THE {zone.upper()}"

        if predicted >= 85.0 or current >= 85.0:
            status = "CRITICAL"
            action = f"CRITICAL CONGESTION: Zone {zone} capacity breached. Opening all secondary emergency exits."
            dispatch = "DEPLOYED: 5 Marshals"
            signage = f"ALERT: REROUTE IMMEDIATELY TO EXIT C"
        elif predicted >= 70.0 or current >= 70.0:
            status = "WARNING"
            action = f"WARNING INDICATOR: High traffic buildup detected in Zone {zone}. Diverting incoming queues."
            dispatch = "STANDBY: 2 Guards Assigned"
            signage = f"NOTICE: EXTENDED DELAYS USE ALTERNATE PATHS"

        return {"status": status, "action": action, "dispatch": dispatch, "signage": signage}

class AlertAgent:
    def serialize(self, payload: TelemetryPayload, density: float, predicted: float, decision: Dict) -> dict:
        # Formats the unified payload explicitly for UI components
        return {
            "timestamp": time.strftime("%H:%M:%S"),
            "stream_status": "Connected",
            "venue": payload.venue,
            "zone_id": payload.zone_id,
            "location_name": payload.location_name,
            "current_capacity": density,
            "predicted_capacity": predicted,
            "agent_status": decision["status"],
            "agent_log": f"> [AlertAgent] {decision['action']}",
            "dispatch_status": decision["dispatch"],
            "signage_text": decision["signage"],
            "gate_metrics": {
                "flow_rate": payload.flow_rate,
                "congestion_index": round(density * 0.9, 2)
            }
        }

# Instantiate our micro-agent classes
density_agent = DensityAgent()
prediction_agent = PredictionAgent()
decision_agent = DecisionAgent()
alert_agent = AlertAgent()

# ----------------------------------------------------------------
# API ROUTES & LIVE STREAM BUS
# ----------------------------------------------------------------
@app.post("/api/telemetry")
async def ingest_telemetry(payload: TelemetryPayload):
    # Execute the modular multi-agent lifecycle on the live tick
    current_density = density_agent.process(payload)
    predicted_density = prediction_agent.process(current_density, payload.flow_rate)
    decision = decision_agent.process(payload.location_name, current_density, predicted_density)
    
    # Package into clean JSON
    frontend_packet = alert_agent.serialize(payload, current_density, predicted_density, decision)
    
    # Broadcast the data downstream instantly over WebSockets
    await manager.broadcast(frontend_packet)
    
    return {"status": "processed", "target_clients": len(manager.active_connections)}

@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the channel alive and listening for client updates
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
