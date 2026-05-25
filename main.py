from typing import Any, Dict, List, Optional, Set

from fastapi import FastAPI
import joblib

app = FastAPI()

model = joblib.load("saved_model/size_model.pkl")

SIZE_CATALOG: List[Dict[str, Any]] = [
    {"id": 1, "name": "Large", "createdAt": "2026-05-08T09:54:06.000Z", "updatedAt": "2026-05-08T09:54:06.000Z"},
    {"id": 2, "name": "Medium", "createdAt": "2026-05-08T09:54:06.000Z", "updatedAt": "2026-05-08T09:54:06.000Z"},
    {"id": 3, "name": "Newborn", "createdAt": "2026-05-08T09:54:06.000Z", "updatedAt": "2026-05-08T09:54:06.000Z"},
    {"id": 4, "name": "Small", "createdAt": "2026-05-08T09:54:06.000Z", "updatedAt": "2026-05-08T09:54:06.000Z"},
    {"id": 5, "name": "Preemie", "createdAt": "2026-05-08T09:54:06.000Z", "updatedAt": "2026-05-08T09:54:06.000Z"},
    {"id": 6, "name": "One Size", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 7, "name": "0-6M", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 8, "name": "12-18M", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 9, "name": "6-12M", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 10, "name": "Size 2", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 11, "name": "Size 3", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 12, "name": "Size 4", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 13, "name": "2T", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 14, "name": "3T", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 15, "name": "4T", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 16, "name": "30x40", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 17, "name": "28x28", "createdAt": "2026-05-08T09:54:07.000Z", "updatedAt": "2026-05-08T09:54:07.000Z"},
    {"id": 18, "name": "Up to 1 Year", "createdAt": "2026-05-08T09:54:08.000Z", "updatedAt": "2026-05-08T09:54:08.000Z"},
    {"id": 19, "name": "0-3", "createdAt": "2026-05-08T09:54:08.000Z", "updatedAt": "2026-05-08T09:54:08.000Z"},
    {"id": 20, "name": "3-6", "createdAt": "2026-05-08T09:54:08.000Z", "updatedAt": "2026-05-08T09:54:08.000Z"},
    {"id": 21, "name": "6-12", "createdAt": "2026-05-08T09:54:08.000Z", "updatedAt": "2026-05-08T09:54:08.000Z"},
    {"id": 22, "name": "12-18", "createdAt": "2026-05-08T09:54:08.000Z", "updatedAt": "2026-05-08T09:54:08.000Z"},
    {"id": 23, "name": "18-24", "createdAt": "2026-05-08T09:54:08.000Z", "updatedAt": "2026-05-08T09:54:08.000Z"},
    {"id": 24, "name": "Mixed Sizes", "createdAt": "2026-05-08T09:54:15.000Z", "updatedAt": "2026-05-08T09:54:15.000Z"},
]

SIZE_ID_MAP = {row["id"]: row for row in SIZE_CATALOG}
SIZE_NAME_MAP = {row["name"]: row for row in SIZE_CATALOG}


def extract_measurements(data: Dict[str, Any]) -> Dict[str, float]:
    height = float(data.get("height", 170))
    weight = float(data.get("weight", 70))

    chest = float(data.get("chest", round(height * 0.56)))
    waist = float(data.get("waist", round(height * 0.47)))
    hip = float(data.get("hip", round(height * 0.57)))

    return {
        "height": height,
        "weight": weight,
        "chest": chest,
        "waist": waist,
        "hip": hip,
    }


def normalize_available_size_ids(data: Dict[str, Any]) -> Optional[Set[int]]:
    raw_sizes = (
        data.get("available_size_ids")
        or data.get("size_ids")
        or data.get("available_sizes")
        or data.get("product_size_ids")
    )

    if not raw_sizes:
        return None

    if not isinstance(raw_sizes, list):
        raw_sizes = [raw_sizes]

    normalized_ids: Set[int] = set()

    for value in raw_sizes:
        if isinstance(value, int):
            if value in SIZE_ID_MAP:
                normalized_ids.add(value)
            continue

        if isinstance(value, str):
            stripped = value.strip()
            if stripped.isdigit():
                size_id = int(stripped)
                if size_id in SIZE_ID_MAP:
                    normalized_ids.add(size_id)
            elif stripped in SIZE_NAME_MAP:
                normalized_ids.add(SIZE_NAME_MAP[stripped]["id"])
            continue

        if isinstance(value, dict):
            if "id" in value and value["id"] in SIZE_ID_MAP:
                normalized_ids.add(value["id"])
            elif "name" in value and value["name"] in SIZE_NAME_MAP:
                normalized_ids.add(SIZE_NAME_MAP[value["name"]]["id"])

    return normalized_ids or None


def pick_size(features: List[List[float]], allowed_ids: Optional[Set[int]]) -> Dict[str, Any]:
    if not allowed_ids:
        predicted_name = model.predict(features)[0]
        return SIZE_NAME_MAP.get(predicted_name, {"id": None, "name": predicted_name})

    probabilities = model.predict_proba(features)[0]
    best_record: Optional[Dict[str, Any]] = None
    best_score = -1.0

    for class_name, score in zip(model.classes_, probabilities):
        size_record = SIZE_NAME_MAP.get(class_name)
        if not size_record:
            continue
        if size_record["id"] not in allowed_ids:
            continue
        if score > best_score:
            best_score = score
            best_record = size_record

    if best_record:
        return best_record

    predicted_name = model.predict(features)[0]
    return SIZE_NAME_MAP.get(predicted_name, {"id": None, "name": predicted_name})


def build_predict_response(size_record: Dict[str, Any], measurements: Dict[str, float], allowed_ids: Optional[Set[int]]) -> Dict[str, Any]:
    return {
        "status": 200,
        "success": True,
        "message": "Size predicted successfully",
        "data": {
            "recommendedSize": size_record,
            "recommendedSizeId": size_record.get("id"),
            "recommendedSizeName": size_record.get("name"),
            "availableSizeIdsUsed": sorted(allowed_ids) if allowed_ids else [],
            "measurements": measurements,
        },
        "recommended_size": size_record.get("name"),
        "recommended_size_id": size_record.get("id"),
        "measurements": measurements,
    }


@app.get("/sizes")
def get_sizes() -> Dict[str, Any]:
    return {
        "status": 200,
        "success": True,
        "message": "Fetching all size list",
        "data": {
            "allSizeList": SIZE_CATALOG,
        },
    }


@app.post("/predict")
def predict(data: Dict[str, Any]) -> Dict[str, Any]:
    measurements = extract_measurements(data)
    allowed_ids = normalize_available_size_ids(data)

    features = [[
        measurements["height"],
        measurements["weight"],
        measurements["chest"],
        measurements["waist"],
        measurements["hip"],
    ]]

    size_record = pick_size(features, allowed_ids)
    return build_predict_response(size_record, measurements, allowed_ids)
