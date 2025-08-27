// api/SeniorUser.js
import API_BASE from "../config/apiBase";
console.log("API BASE_URL:", API_BASE);

export async function getSeller(sellerId) {
  const url = `${API_BASE}/seller/${sellerId}`;
  console.log("getSeller 호출 URL:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("판매자 정보 불러오기 실패");
  return res.json();
}

// 숫자 변환 유틸: 빈문자/undefined → null, 숫자문자 → Number
function toIntOrNull(v) {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

// 내부 유틸: 값이 undefined인 키는 제거(부분 업데이트용)
// null은 "명시적 초기화" 의도가 있는 것으로 간주하여 유지
function stripUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

// ✳️ 프론트 상태 → 백엔드 DTO로 변환해서 PATCH(부분 업데이트)
export async function updateSeller(sellerId, profile) {
  // 1) 프론트 → DTO 매핑
  const mapped = {
    sellerName: profile.name,                     // string | undefined | ""
    sellerYear: toIntOrNull(profile.birthYear),  // number | null | undefined
    sellerNumber: profile.phone,                 // string | undefined | ""
    sellerAddress: profile.address,              // string | undefined | ""
    sellerLand: toIntOrNull(profile.landCount),  // number | null | undefined
  };

  // 2) PATCH 특성상 undefined 필드는 제거(BE가 부분 업데이트만 받도록)
  //    - null은 남겨 두어 "해당 필드 비우기" 시나리오를 지원
  const payload = stripUndefined(mapped);

  const url = `${API_BASE}/seller-update/${sellerId}`;
  console.log("updateSeller(PATCH) 호출 URL:", url);
  console.log("updateSeller(PATCH) payload:", payload);

  const res = await fetch(url, {
    method: "PATCH", // ✅ 핵심 변경
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // BE가 204(No Content) 반환할 수 있음 → text/json 처리 분기
  const raw = await res.text();
  console.log("서버 응답 상태:", res.status);
  console.log("서버 응답 본문:", raw);

  if (!res.ok) throw new Error("판매자 정보 업데이트 실패");

  // 204 또는 빈 본문이면 null 반환
  if (!raw) return null;

  // JSON 파싱 시도
  try {
    return JSON.parse(raw);
  } catch {
    // 혹시 평문을 주는 서버라면 그대로 반환
    return raw;
  }
}
