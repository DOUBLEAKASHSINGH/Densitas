import time
import json
import random
import datetime
import requests

# ---------------------------------------------------------
# OptiFlow Data Simulator
# Generates synthetic live foot traffic and pushes to a FastAPI endpoint.
# ---------------------------------------------------------

# Target FastAPI endpoint (Render Live URL)
FASTAPI_URL = "https://optiflow-backend.onrender.com/api/telemetry"

# Known zones from our seeded PostgreSQL database
ZONES = [1, 2, 3]

def generate_telemetry_stream():
    """
    Simulates live foot traffic by sending a JSON payload every 1 second.
    Occasionally triggers a "surge" in a specific zone to test downstream agents.
    """
    print(f"Starting OptiFlow telemetry simulator. Pushing to {FASTAPI_URL}...")
    
    while True:
        # Generate timestamp in UTC format suitable for TimescaleDB
        current_time = datetime.datetime.now(datetime.timezone.utc).isoformat()
        zone_id = random.choice(ZONES)
        
        # Base metrics representing normal event traffic
        headcount = random.randint(50, 400)
        flow_rate = random.randint(-10, 20)
        
        # -------------------------------------------------
        # Surge Simulation (Edge Case)
        # -------------------------------------------------
        # We introduce a ~5% chance to simulate a rapid, extreme spike in headcount.
        # This tests our system's downstream agent orchestration (e.g., dispatching staff).
        if random.random() < 0.05:
            headcount += random.randint(1000, 3000)  # Massive surge
            flow_rate += random.randint(100, 300)
            print(f"[{current_time}] ⚠️ SURGE DETECTED in Zone {zone_id}! Headcount: {headcount}")
        
        payload = {
            "timestamp": current_time,
            "zone_id": zone_id,
            "headcount": headcount,
            "flow_rate": flow_rate
        }
        
        try:
            # Attempt to POST the data to our FastAPI endpoint
            response = requests.post(FASTAPI_URL, json=payload, timeout=2)
            
            if response.status_code == 200:
                print(f"[{current_time}] Successfully pushed data to Zone {zone_id}")
            else:
                print(f"[{current_time}] Received non-200 status code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            # We catch the exception gracefully so the simulator can run
            # even while the FastAPI server is being developed or is down.
            print(f"[{current_time}] (Local) Payload generated: {json.dumps(payload)}")
            # print(f"Endpoint unreachable: {e}")
            
        # Ensure we push payload exactly every 1 second
        time.sleep(1)

if __name__ == "__main__":
    try:
        generate_telemetry_stream()
    except KeyboardInterrupt:
        print("\nSimulator stopped by user.")
