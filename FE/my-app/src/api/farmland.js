// src/api/farmland.js
import API_BASE from "../config/apiBase";

function toNumberSafe(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// ──────────────────────────────
// ① crop → emoji 규칙
// ──────────────────────────────
function normalizeCrop(crop) {
  if (crop == null) return "";
  let s = String(crop).trim();
  if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
  return s.replace(/\s+/g, "").toLowerCase(); // 공백 제거, 소문자
}

export function inferEmojiFromCrop(cropRaw) {
  const c = normalizeCrop(cropRaw);

  // 과수
  if (/사과|apple/.test(c)) return "🍎";
  if (/배(?!추)|pear/.test(c)) return "🍐";
  if (/복숭아|peach/.test(c)) return "🍑";
  if (/포도|grape/.test(c)) return "🍇";
  if (/딸기|strawberry/.test(c)) return "🍓";
  if (/수박|watermelon/.test(c)) return "🍉";
  if (/참외|koreanmelon/.test(c)) return "🍈";
  if (/(귤|감귤|오렌지|orange|mandarin|tangerine)/.test(c)) return "🍊";
  if (/블루베리|blueberry|blueberries/.test(c)) return "🫐";

  // 채소/특용
  if (/토마토|tomato/.test(c)) return "🍅";
  if (/(고추|청양|pepper|chili)/.test(c)) return "🌶️";
  if (/오이|cucumber/.test(c)) return "🥒";
  if (/(상추|lettuce|배추|cabbage)/.test(c)) return "🥬";
  if (/깻잎|perilla/.test(c)) return "🌿";
  if (/양파|onion/.test(c)) return "🧅";
  if (/마늘|garlic/.test(c)) return "🧄";
  if (/가지|eggplant|aubergine/.test(c)) return "🍆";
  if (/호박|pumpkin/.test(c)) return "🎃";

  // 뿌리/구황
  if (/감자|potato/.test(c)) return "🥔";
  if (/(고구마|sweetpotato)/.test(c)) return "🍠";

  // 곡물/두류
  if (/(옥수수|corn|maize)/.test(c)) return "🌽";
  if (/(벼|쌀|rice)/.test(c)) return "🌾";
  if (/(밀|보리|wheat|barley)/.test(c)) return "🌾";
  if (/(콩|soy|bean|soybean)/.test(c)) return "🫘";

  // 모르면 기본
  if (!c || c === "작물미입력") return "🌿";
  return "🌱";
}

// ──────────────────────────────
// ② 서버 → UI 매핑
// ──────────────────────────────
export function mapServerToUi(item, idx) {
  const crop = item?.landCrop ?? "작물 미입력";
  return {
    id: item?.landId ?? item?.id ?? idx + 1,
    name: item?.landName ?? "이름 미정",
    address: item?.landAddress ?? "주소 미입력",
    crop,
    area: toNumberSafe(item?.landArea),
    price: toNumberSafe(item?.landPrice),
    lat: toNumberSafe(item?.landLat, null),
    lng: toNumberSafe(item?.landLng, null),
    // 백엔드가 emoji를 주면 우선 사용, 아니면 crop 기반 추론
    emoji: item?.emoji ?? inferEmojiFromCrop(crop),
    _raw: item,
  };
}

// ──────────────────────────────
// ③ 목록 fetch
// ──────────────────────────────
export async function fetchFarmlands() {
  const url = `${API_BASE}/farmland`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`GET /farmland 실패: ${res.status}`);
  const data = await res.json();

  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
    ? data.content
    : [];

  // 지도 마커용: 좌표 없는 항목 제외
  return list.map(mapServerToUi).filter((f) => f.lat != null && f.lng != null);
}

// ──────────────────────────────
// ③ 목록 fetch (URL 하드코딩 테스트 버전)
// ──────────────────────────────
// export async function fetchFarmlands() {
//   // 테스트: 로컬호스트 대신 서버 IP 하드코딩
//   const url = "http://43.203.207.57/api/farmland";

//   console.log("👉 farmland API 호출:", url);

//   const res = await fetch(url, { headers: { Accept: "application/json" } });
//   if (!res.ok) throw new Error(`GET /farmland 실패: ${res.status}`);
//   const data = await res.json();

//   const list = Array.isArray(data)
//     ? data
//     : Array.isArray(data?.content)
//     ? data.content
//     : [];

//   // 지도 마커용: 좌표 없는 항목 제외
//   return list.map(mapServerToUi).filter((f) => f.lat != null && f.lng != null);
// }
