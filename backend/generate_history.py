import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_telemetry():
    """
    Generates a robust, physics-based synthetic historical dataset 
    for training the XGBoost prediction model.
    """
    print("Initializing historical crowd telemetry generation...")
    
    # Configuration
    num_rows = 50000
    zones = ["Hall 1", "Hall 2", "Hall 3", "Open Arena"]
    start_time = datetime(2026, 1, 1, 6, 0, 0)
    
    # 1. Generate base time series (50,000 consecutive minutes)
    timestamps = [start_time + timedelta(minutes=i) for i in range(num_rows)]
    
    # 2. Assign deterministic zones
    zone_ids = np.random.choice(zones, size=num_rows)
    
    # 3. Extract time of day as a continuous float (e.g., 10.5 for 10:30 AM)
    time_of_day = np.array([t.hour + t.minute / 60.0 for t in timestamps])
    
    # 4. Math Logic: Create daily patterns
    # We use Gaussian probability density functions to simulate organic crowd surges
    # 10:00 AM Entry Spike
    peak_entry = np.exp(-0.5 * ((time_of_day - 10.0) / 1.5) ** 2)
    # 5:00 PM (17:00) Exit/Event Spike
    peak_event = np.exp(-0.5 * ((time_of_day - 17.0) / 2.0) ** 2)
    
    # Base traffic naturally fluctuates, peaking at specific times
    base_traffic = 200 + (1500 * peak_entry) + (2200 * peak_event)
    
    # Inject organic statistical noise
    noise = np.random.normal(0, 50, num_rows)
    current_count = np.clip(base_traffic + noise, 0, 5000)
    
    # 5. Inject Sudden Anomalies (1.5% chance)
    # E.g., sudden concert rush, gate closure, or emergency evacuation
    anomaly_mask = np.random.random(num_rows) > 0.985
    current_count[anomaly_mask] += np.random.uniform(500, 2000, size=anomaly_mask.sum())
    
    # 6. Calculate Flow Rate (people per minute)
    # Flow rate heavily correlates with the time of day (positive on entry, negative on exit)
    flow_rate = np.random.normal(5, 10, num_rows)
    
    # Morning rush (highly positive flow)
    morning_mask = (time_of_day >= 8.0) & (time_of_day <= 11.0)
    flow_rate[morning_mask] += np.random.uniform(20, 60, size=morning_mask.sum())
    
    # Evening exit (highly negative flow)
    evening_mask = (time_of_day >= 17.0) & (time_of_day <= 19.5)
    flow_rate[evening_mask] -= np.random.uniform(20, 80, size=evening_mask.sum())
    
    # Anomalies disrupt flow drastically
    flow_rate[anomaly_mask] = np.random.choice([-50, 120], size=anomaly_mask.sum())
    
    # 7. Calculate Average Velocity (meters per second)
    # High density (current_count) physics mathematically restrict velocity
    average_velocity = np.clip(1.5 - (current_count / 5000) * 1.1 + np.random.normal(0, 0.1, num_rows), 0.1, 2.0)
    
    # 8. Target Variable Calculation (occupancy_after_5_min)
    # Logically correlates: future count = current + (flow_rate * 5 minutes) + minor stochastic variation
    future_occupancy = current_count + (flow_rate * 5) + np.random.normal(0, 15, num_rows)
    
    # 9. Clean and round data arrays for final output
    current_count = np.clip(np.round(current_count), 0, None).astype(int)
    occupancy_after_5_min = np.clip(np.round(future_occupancy), 0, None).astype(int)
    flow_rate = np.round(flow_rate, 2)
    average_velocity = np.round(average_velocity, 2)
    time_of_day = np.round(time_of_day, 2)
    
    # 10. Construct Pandas DataFrame
    df = pd.DataFrame({
        "timestamp": timestamps,
        "zone_id": zone_ids,
        "time_of_day": time_of_day,
        "current_count": current_count,
        "flow_rate": flow_rate,
        "average_velocity": average_velocity,
        "occupancy_after_5_min": occupancy_after_5_min
    })
    
    # Save to CSV
    output_file = "historical_telemetry.csv"
    df.to_csv(output_file, index=False)
    
    print(f"SUCCESS: Generated {num_rows} rows of physics-based telemetry data.")
    print(f"SUCCESS: Target correlation established: current_count + (flow_rate * 5) -> occupancy_after_5_min")
    print(f"SUCCESS: Dataset successfully saved to '{output_file}'")

if __name__ == "__main__":
    generate_telemetry()
