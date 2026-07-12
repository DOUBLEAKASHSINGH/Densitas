import time
import math
import random
import requests

API_URL = "http://localhost:8000/api/telemetry"

# Real-world mid-2026 event metadata configurations
venues = [
    {"name": "Pharma Pro & Pack Expo", "location": "HITEX Exhibition Centre, Hall 1", "max": 2000, "id": "HITEX-H1"},
    {"name": "Pharma Pro & Pack Expo", "location": "HITEX Exhibition Centre, Hall 3", "max": 1500, "id": "HITEX-H3"},
    {"name": "Harris Jayaraj Live", "location": "Boulder Hills Open Arena", "max": 5000, "id": "BH-OA"}
]

print("Initializing live hardware telemetry simulation...")

tick = 0
while True:
    for venue in venues:
        tick += 1
        
        # Base population using a sine wave to represent standard entry/exit traffic waves
        base_sine = (math.sin(tick * 0.1) + 1) / 2  # Cycles smoothly between 0 and 1
        
        # Introduce a 10% chance of a massive localized crowd surge (e.g., concert finale or sudden rain)
        if random.random() > 0.90:
            headcount = int(venue["max"] * random.uniform(0.86, 0.98))
            flow_rate = random.uniform(45.0, 75.0)
            print(f"⚠️ [ANOMALY DETECTED] Simulating severe bottleneck velocity vectors at {venue['location']}")
        else:
            headcount = int(venue["max"] * (base_sine * 0.6 + 0.2))  # Fluctuates naturally between 20% and 80%
            flow_rate = random.uniform(12.0, 32.0)

        payload = {
            "venue": venue["name"],
            "zone_id": venue["id"],
            "location_name": venue["location"],
            "headcount": headcount,
            "max_capacity": venue["max"],
            "flow_rate": round(flow_rate, 2)
        }

        try:
            response = requests.post(API_URL, json=payload, timeout=2)
            if response.status_code == 200:
                print(f"Sent -> {venue['location']} | Occupancy: {headcount}/{venue['max']} | Flow: {payload['flow_rate']}/min")
        except requests.exceptions.ConnectionError:
            print("❌ Backend connection refused. Verify that main.py is running on port 8000.")

    time.sleep(1.5)
