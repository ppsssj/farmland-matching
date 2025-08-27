// src/utils/matching.js
// Haversine 거리(km)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// 작물별 “필요작업”과 “추천작물” 간단 사전 (임의 규칙)
const CROP_REQUIRED_TASKS = {
  감자: ["경운", "정식", "수확", "운반"],
  양파: ["경운", "정식", "잡초관리", "수확", "운반"],
  사과: ["전정", "방제", "수확", "운반"],
  토마토: ["정식", "지주설치", "수확", "운반"],
  벼: ["이앙", "제초", "수확", "운반"],
  옥수수: ["파종", "제초", "수확", "운반"],
};

const CROP_RECOMMEND = {
  감자: ["양파", "옥수수"],
  양파: ["감자", "마늘"],
  사과: ["배", "복숭아"],
  토마토: ["오이", "파프리카"],
  벼: ["보리", "콩"],
  옥수수: ["감자", "콩"],
};

// “도구 → 수행 가능 작업” 매핑(간단화)
const TOOL_TO_TASKS = {
  관리기: ["경운", "잡초관리"],
  "소형트랙터": ["운반", "경운"],
  경운기: ["경운"],
  예초기: ["잡초관리"],
  트럭: ["운반"],
};

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

export function computeMatching(selectedFarmland, applicant) {
  if (!selectedFarmland || !applicant) {
    return { score: 0, parts: [], derived: {} };
  }

  const farmLat = selectedFarmland.lat;
  const farmLng = selectedFarmland.lng;

  // 1) 거리 점수 (최대 40점)
  const dkm = haversine(farmLat, farmLng, applicant.home_lat, applicant.home_lng);
  const distMax = 30; // 30km 이상이면 0점
  const distRatio = clamp01(1 - dkm / distMax);
  const distScore = Math.round(distRatio * 40);

  // 2) 작업 준비도 (필요작업 대비, 도구로 커버 가능한 작업 비율) (최대 30점)
  const farmCrop = selectedFarmland?.detail?.landInfo?.crop;
  const requiredTasks = CROP_REQUIRED_TASKS[farmCrop] || ["수확", "운반"];
  const tasksCovered = new Set();
  (applicant.tools || []).forEach((tool) => {
    (TOOL_TO_TASKS[tool] || []).forEach((t) => tasksCovered.add(t));
  });
  const coverCount = requiredTasks.filter((t) => tasksCovered.has(t)).length;
  const coverRatio = requiredTasks.length ? coverCount / requiredTasks.length : 0;
  const taskScore = Math.round(coverRatio * 30);

  // 3) 작물 관심도 (관심 작물 ↔ [농지작물 + 추천작물]) (최대 20점)
  const rec = CROP_RECOMMEND[farmCrop] || [];
  const candidateCrops = new Set([farmCrop, ...rec]);
  const interest = applicant.interested_crops || [];
  const overlap = interest.filter((c) => candidateCrops.has(c));
  const cropRatio = interest.length ? overlap.length / interest.length : 0;
  const cropScore = Math.round(cropRatio * 20);

  // 4) 거래 형태 적합도 (최대 10점)
  const preferred = applicant.preferred_trade || [];
  // 간단 룰: 플랫폼/농지에서 특별히 막은 타입이 없으니 임대/매입/공유농 중 하나라도 있으면 가산
  const tradeOk = preferred.some((p) => ["임대", "매입", "공유농"].includes(p));
  const tradeScore = tradeOk ? 10 : 0;

  const total = distScore + taskScore + cropScore + tradeScore;

  return {
    score: total,
    parts: [
      { key: "거리", value: distScore, note: `${dkm.toFixed(1)}km` },
      { key: "작업준비도", value: taskScore, note: `${coverCount}/${requiredTasks.length}개 커버` },
      { key: "작물관심", value: cropScore, note: overlap.length ? `겹침: ${overlap.join(", ")}` : "겹침 없음" },
      { key: "거래형태", value: tradeScore, note: preferred.join(", ") || "선호 없음" },
    ],
    derived: {
      required_tasks: requiredTasks,
      recommended_crops: Array.from(candidateCrops),
      tasks_covered_by_tools: Array.from(tasksCovered),
      distance_km: dkm,
      applicant_name: applicant.name,
    },
  };
}
