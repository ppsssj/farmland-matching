import json
import joblib
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
import pathlib
from app.models import Farmland, Buyer

# --- 경로 설정 ---
BASE_DIR = pathlib.Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "ml" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

SAMPLE_DATA_PATH = DATA_DIR / "sample_data.json"
MODEL_PATH = MODEL_DIR / "kmeans_model.joblib"
PREPROCESSOR_PATH = MODEL_DIR / "preprocessors.joblib"

def train_and_save_model(n_clusters=2):
    print("AI 모델 학습을 시작합니다...")

    with open(SAMPLE_DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    farmlands = [Farmland(**f) for f in data.get('farmlands', [])]
    buyers = [Buyer(**b) for b in data.get('buyers', [])]

    # --- 데이터 변환기(Preprocessor) 학습 ---
    # 1. 작물 데이터용 MultiLabelBinarizer
    all_crops = [f.landCrop for f in farmlands if f.landCrop] + \
                [c for b in buyers if b.trustProfile and b.trustProfile.interestCrop for c in b.trustProfile.interestCrop]
    
    if not all_crops:
        all_crops = [""]

    crop_mlb = MultiLabelBinarizer()
    crop_mlb.fit([all_crops])

    # 2. 좌표 데이터용 StandardScaler
    coords = np.array([[f.landLat, f.landLng] for f in farmlands if f.landLat is not None and f.landLng is not None])
    coord_scaler = StandardScaler()
    if len(coords) > 0:
        coord_scaler.fit(coords)

    # --- 전체 데이터 벡터화 ('작물' + '좌표' 기준) ---
    processed_entities = []
    for farm in farmlands:
        # 작물 벡터
        crop_vector = crop_mlb.transform([[farm.landCrop if farm.landCrop else ""]])[0]
        
        # 좌표 벡터 (정규화)
        if farm.landLat is not None and farm.landLng is not None:
            coord_vector = coord_scaler.transform([[farm.landLat, farm.landLng]])[0]
        else:
            # 좌표 정보가 없는 경우, 평균값(0)으로 처리
            coord_vector = np.zeros(2)

        # 두 벡터를 결합
        combined_vector = np.hstack([crop_vector, coord_vector])
        processed_entities.append(combined_vector)

    # --- K-means 모델 학습 및 저장 ---
    if not processed_entities:
        print("경고: 학습할 농지 데이터가 없습니다. 모델 학습을 건너뜁니다.")
        return {"message": "No farmland data to train on. Model training skipped."}
        
    n_clusters = min(n_clusters, len(processed_entities))

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    kmeans.fit(processed_entities)

    joblib.dump(kmeans, MODEL_PATH)
    # 클러스터링에 사용된 모든 preprocessor 저장
    joblib.dump({
        'crop_mlb': crop_mlb,
        'coord_scaler': coord_scaler
    }, PREPROCESSOR_PATH)

    print(f"모델 학습 완료! 모델은 '{MODEL_PATH}'에 저장되었습니다.")
    return {"message": "Model training successful", "clusters_created": n_clusters, "vector_size": len(processed_entities[0])}
