import numpy as np
from pathlib import Path
import joblib

WEIGHTS_PATH = Path(__file__).parent.parent / "weights" / "anomaly_model.joblib"

class AnomalyDetector:
    def __init__(self):
        self.model = None
        self.ready = False
        if WEIGHTS_PATH.exists():
            self.model = joblib.load(WEIGHTS_PATH)
            self.ready = True

    def predict(self, events: list) -> dict:
        if not events:
            return {"anomaly": False, "score": 0.0, "reason": "no_events"}

        if not self.ready:
            return {"anomaly": False, "score": 0.0, "reason": "model_not_trained", "stub": True}

        features = np.array([[
            e.get("transit_days", 0),
            e.get("num_handoffs", 0),
            e.get("route_deviation_km", 0),
            e.get("time_gap_hours", 0),
        ] for e in events])

        scores = self.model.decision_function(features)
        avg_score = float(np.mean(scores))
        is_anomaly = avg_score < -0.3

        reasons = []
        for e in events:
            if e.get("route_deviation_km", 0) > 500:
                reasons.append("excessive_route_deviation")
            if e.get("time_gap_hours", 0) > 168:
                reasons.append("long_custody_gap")
            if e.get("num_handoffs", 0) > 5:
                reasons.append("too_many_handoffs")

        return {
            "anomaly": is_anomaly,
            "score": round(abs(avg_score), 4),
            "reason": ", ".join(set(reasons)) if reasons else "statistical_outlier",
        }