import json
from typing import Dict, Any
import pandas as pd

# In a production environment, you would load your trained XGBoost/LightGBM model here.
# For example: import xgboost as xgb

# ---------------------------------------------------------
# OptiFlow Deterministic Agents
# Fast, lightweight, strictly rules-based & ML-driven. No LLMs.
# ---------------------------------------------------------

# Hardcoded zone capacities based on the seed data from schema.sql
ZONE_CAPACITIES = {
    1: 2000,   # North Entrance
    2: 10000,  # Main Hall
    3: 500,    # VIP Lounge
}

class DensityAgent:
    """
    Receives the raw JSON payload and calculates the current capacity percentage
    based on the zone's max limits.
    """
    def __init__(self):
        self.zone_capacities = ZONE_CAPACITIES

    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        zone_id = payload.get("zone_id")
        headcount = payload.get("headcount", 0)
        
        max_capacity = self.zone_capacities.get(zone_id, 1000) # default fallback
        capacity_pct = (headcount / max_capacity) * 100
        
        # Augment payload with density calculations
        payload["capacity_percentage"] = capacity_pct
        payload["max_capacity"] = max_capacity
        return payload


class PredictionAgent:
    """
    Uses a mocked ML model (XGBoost/LightGBM representation) to predict 
    the headcount 5 minutes into the future.
    """
    def __init__(self):
        # self.model = xgb.Booster()
        # self.model.load_model('optiflow_xgboost.json')
        self.model_loaded = True 

    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        current_headcount = payload.get("headcount", 0)
        flow_rate = payload.get("flow_rate", 0) # e.g., net people per minute
        
        # Mocking the XGBoost regression output:
        # A simple linear projection (current + flow_rate * 5 mins)
        predicted_headcount = current_headcount + (flow_rate * 5)
        
        # Floor it at 0
        predicted_headcount = max(0, predicted_headcount)
        
        predicted_capacity_pct = (predicted_headcount / payload["max_capacity"]) * 100
        
        payload["predicted_headcount_5m"] = predicted_headcount
        payload["predicted_capacity_percentage_5m"] = predicted_capacity_pct
        return payload


class DecisionAgent:
    """
    Takes the prediction and executes deterministic logic.
    If predicted capacity > 90%, it triggers a specific hardcoded action.
    """
    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        predicted_pct = payload.get("predicted_capacity_percentage_5m", 0)
        
        action = "None"
        if predicted_pct > 100:
            action = "CRITICAL: Open Emergency Exits and Dispatch 5 Guards"
        elif predicted_pct > 90:
            action = "WARNING: Dispatch 3 guards and redirect traffic"
        elif predicted_pct > 75:
            action = "ALERT: Monitor zone closely, prepare staff"
            
        payload["deterministic_action"] = action
        return payload


class AlertAgent:
    """
    Formats the finalized decision into a strict JSON payload.
    This guarantees perfectly structured outputs without the hallucination risk of LLMs.
    """
    def process(self, payload: Dict[str, Any]) -> str:
        alert_data = {
            "timestamp": payload.get("timestamp"),
            "zone_id": payload.get("zone_id"),
            "current_capacity_pct": round(payload.get("capacity_percentage", 0), 2),
            "predicted_capacity_pct_5m": round(payload.get("predicted_capacity_percentage_5m", 0), 2),
            "action_required": payload.get("deterministic_action")
        }
        
        return json.dumps(alert_data)


class AgentOrchestrator:
    """
    Wires the 4 classes together in a lightning-fast event loop.
    """
    def __init__(self):
        self.density_agent = DensityAgent()
        self.prediction_agent = PredictionAgent()
        self.decision_agent = DecisionAgent()
        self.alert_agent = AlertAgent()
        
    def run_pipeline(self, raw_payload: Dict[str, Any]) -> str:
        """Executes the deterministic agent pipeline in sequence."""
        # 1. Calculate Density
        data = self.density_agent.process(raw_payload)
        
        # 2. Predict Future State (ML)
        data = self.prediction_agent.process(data)
        
        # 3. Formulate Decision
        data = self.decision_agent.process(data)
        
        # 4. Generate Strict JSON Alert
        final_json = self.alert_agent.process(data)
        
        return final_json
