import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import joblib
import time

def train_optiflow_model():
    print("Loading historical telemetry data...")
    # Load dataset
    df = pd.read_csv('historical_telemetry.csv')

    print("Preprocessing data...")
    # 1. Handle missing values
    df = df.dropna()

    # 2. Encode categorical variables
    label_encoder = LabelEncoder()
    df['zone_id_encoded'] = label_encoder.fit_transform(df['zone_id'])

    # 3. Select features and target
    features = ['zone_id_encoded', 'time_of_day', 'current_count', 'flow_rate', 'average_velocity']
    X = df[features]
    y = df['occupancy_after_5_min']

    # 4. Scale the numerical features for regression stability
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 5. Split into 80% training and 20% testing sets
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    print(f"Training XGBoost Regressor on {len(X_train)} samples...")
    start_time = time.time()
    
    # Initialize and train the XGBoost Regressor
    model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective='reg:squarederror'
    )
    
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    print(f"Model trained successfully in {training_time:.2f} seconds.")

    # 6. Evaluate the model
    print("Evaluating model performance on testing set...")
    predictions = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)

    print("\n--- MODEL EVALUATION METRICS ---")
    print(f"Mean Absolute Error (MAE): {mae:.4f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"R² Score: {r2:.4f}")
    print("--------------------------------\n")

    # 7. Export the trained model and scalers using joblib
    print("Exporting model pipeline artifacts...")
    joblib.dump(model, 'xgboost_model.pkl')
    joblib.dump(scaler, 'feature_scaler.pkl')
    joblib.dump(label_encoder, 'zone_encoder.pkl')
    
    print("SUCCESS: Pipeline artifacts successfully saved:")
    print(" - xgboost_model.pkl")
    print(" - feature_scaler.pkl")
    print(" - zone_encoder.pkl")

if __name__ == "__main__":
    train_optiflow_model()
