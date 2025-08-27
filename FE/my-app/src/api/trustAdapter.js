// src/api/trustAdapter.js
import API_BASE from "../config/apiBase";
/** ---- BE 호출 유틸 ---- **/
export async function getBuyerProfile(buyerId = 1, token) {
  // 👉 너희 팀에서 쓰는 프로필 GET 엔드포인트로 바꿔도 됨.
  // 예: /buyer/{buyerId} 또는 /{buyerId}/buyer-info 등
  const url = `${API_BASE}/buyer/${encodeURIComponent(buyerId)}`;
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`[getBuyerProfile] ${res.status}`);
  return res.json();
}

export async function getLicenses(buyerId = 1, token) {
  // 📌 네가 사용하던: GET http://localhost:8080/{buyerId}/licenses
  const url = `${API_BASE}/${encodeURIComponent(buyerId)}/licenses`;
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`[getLicenses] ${res.status}`);
  return res.json(); // 예시: [{licenseId, licenseName, fileUrl}, ...] 또는 ["컴활1급", ...]
}

export async function getSuggests(buyerId = 1, token) {
  // 📌 네가 사용하던: GET http://localhost:8080/{buyerId}/suggests
  const url = `${API_BASE}/${encodeURIComponent(buyerId)}/suggests`;
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`[getSuggests] ${res.status}`);
  return res.json(); // 예시: [{suggestId,suggestName,suggestRelationShip,suggestNumber,suggestEmail}, ...]
}

export async function getAwards(buyerId = 1, token) {
  // ⚠️ 수상경력 API가 아직 없으면 빈 배열 반환하도록 안전 처리
  const url = `${API_BASE}/${encodeURIComponent(buyerId)}/awards`;
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    return res.json(); // 예시: [{title:"OO대회 최우수상"}, ...] 또는 ["OO수상", ...]
  } catch {
    return [];
  }
}

/** ---- 정규화(어댑터): BE 응답 → TrustScore.jsx가 읽는 user 형태로 변환 ---- **/
export function normalizeUserForTrustScore({
  buyerProfile = {},
  licenses = [],
  suggests = [],
  awards = [],
}) {
  // 1) 이름
  const name =
    buyerProfile.buyerName ||
    buyerProfile.name ||
    buyerProfile.username ||
    "사용자";

  // 2) 자격증 리스트
  // TrustScore는 개수만 필요. 객체/문자열 둘 다 안전 처리
  const certificationList = Array.isArray(licenses)
    ? licenses.map((it) =>
        typeof it === "string"
          ? { name: it }
          : { name: it.licenseName || it.name || "자격증" }
      )
    : [];

  // 3) 수상 경력
  const awardsList = Array.isArray(awards)
    ? awards.map((it) =>
        typeof it === "string" ? { title: it } : { title: it.title || it.name || "수상" }
      )
    : [];

  // 4) 소개/한마디/SNS
  const intro = {
    // 네가 쓰던 BE 필드명: oneIntroduction, introduction, (sns 미정이면 videoURL/instagram 등으로 보완)
    OneWord:
      buyerProfile.oneIntroduction ||
      buyerProfile.buyerOneWord ||
      buyerProfile.oneword ||
      "",
    PullWord:
      buyerProfile.introduction ||
      buyerProfile.selfIntroduction ||
      buyerProfile.about ||
      "",
    sns:
      buyerProfile.sns ||
      buyerProfile.instagram ||
      buyerProfile.facebook ||
      buyerProfile.blog ||
      "", // 없으면 빈 문자열
  };

  // 5) 추천인
  const recommendersList = Array.isArray(suggests)
    ? suggests.map((s) => ({
        name: s.suggestName || s.name || "",
        relation: s.suggestRelationShip || s.relation || "",
        phone: s.suggestNumber || s.phone || "",
        email: s.suggestEmail || s.email || "",
      }))
    : [];

  return {
    name,
    detail: {
      certificationList,
      awardsList,
      intro,
      recommendersList,
      // 🔁 TrustScore.jsx는 레거시 키도 읽도록 작성되어 있음(예: recommand1~3, certification, win 등).
      // 여기선 최신 키만 채워도 정상 동작.
    },
  };
}

/** ---- 한번에 로드해서 TrustScore에 바로 꽂기 ---- **/
export async function loadUserForTrustScore(buyerId = 1, token) {
  const [buyerProfile, licenses, suggests, awards] = await Promise.all([
    getBuyerProfile(buyerId, token).catch(() => ({})),
    getLicenses(buyerId, token).catch(() => []),
    getSuggests(buyerId, token).catch(() => []),
    getAwards(buyerId, token).catch(() => []),
  ]);
  return normalizeUserForTrustScore({ buyerProfile, licenses, suggests, awards });
}
