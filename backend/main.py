from fastapi import FastAPI, Request, status, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging

from agents import AgentOrchestrator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI App
app = FastAPI(
    title="OptiFlow API",
    description="Deterministic AI backend for Live Event Crowd Control with Real-Time WebSockets.",
    version="1.0.0",
)

# CORS configuration for the React frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Phase 3: WebSocket Connection Manager
# ---------------------------------------------------------
class ConnectionManager:
    """Handles active WebSocket clients and broadcasts data in real-time."""
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        """Broadcasts a JSON string to all connected clients with graceful error handling."""
        disconnected_clients = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except RuntimeError:
                # Handles edge case where connection state is invalid
                disconnected_clients.append(connection)
            except Exception as e:
                logger.error(f"Failed to send message to a client: {e}")
                disconnected_clients.append(connection)
                
        # Clean up any dropped clients to prevent memory leaks
        for client in disconnected_clients:
            self.disconnect(client)

manager = ConnectionManager()
orchestrator = AgentOrchestrator()

@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    """
    WebSocket endpoint for the React frontend to listen to live telemetry 
    and deterministic agent decisions.
    """
    await manager.connect(websocket)
    try:
        while True:
            # We keep the connection alive. We don't expect messages from the frontend dashboard.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/ingest")
async def ingest_telemetry(request: Request):
    """
    Endpoint to receive live telemetry stream from sensors/generators.
    Triggers the multi-agent pipeline sequentially in a fast event loop,
    and then broadcasts the AlertAgent output via WebSockets.
    """
    try:
        payload = await request.json()
        
        # Run the lightweight ML agent pipeline
        alert_result_json = orchestrator.run_pipeline(payload)
        
        # -------------------------------------------------
        # Real-Time Event Bus
        # Hook the AlertAgent's output into the ConnectionManager
        # -------------------------------------------------
        await manager.broadcast(alert_result_json)
        
        # We can also save this to TimescaleDB here
        # ... db logic ...
        
        return JSONResponse(content={"status": "success", "agent_output": alert_result_json})
        
    except Exception as e:
        logger.error(f"Error processing telemetry: {str(e)}")
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# Map the stream_generator's /api/telemetry to the same ingest logic
@app.post("/api/telemetry")
async def api_telemetry(request: Request):
    return await ingest_telemetry(request)

# Global Exception Handler Middleware
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception occurred: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An unexpected internal server error occurred."},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
