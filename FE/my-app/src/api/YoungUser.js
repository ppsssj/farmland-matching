// src/api/YoungUser.js
import API_BASE from "../config/apiBase";

// 따옴표/공백 정리
function unquote(val) {
  if (val == null) return "";
  const s = String(val).trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1).trim();
  }
  return s.replace(/\\"/g, '"').trim();
}

// 서버 → UI 매핑
function mapToUiProfile(apiObj = {}) {
  return {
    id: apiObj.id ?? "",
    name: unquote(apiObj.buyerName),
    age: apiObj.buyerAge != null ? String(apiObj.buyerAge) : "",
    sex: unquote(apiObj.buyerGender),
    mail: unquote(apiObj.buyerEmail),
    callNumber: unquote(apiObj.buyerNumber),
    profileImage:
      apiObj.buyerImageURL || apiObj.buyerImage || "/images/default_profile.png",
    address: unquote(apiObj.buyerAddress),

    // ⬇️ 좌표 매핑 (백엔드 필드명 buyerLat / buyerLng)
    buyerLat: apiObj.buyerLat ?? null,
    buyerLng: apiObj.buyerLng ?? null,
  };
}

// 공통 fetch (JSON 안전)
async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    console.error("[YoungUser] !ok", res.status, text.slice(0, 300));
    throw new Error(`${options.method || "GET"} ${url} → ${res.status}`);
  }
  if (res.status === 204) return null;
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "(no body)");
    console.error("[YoungUser] invalid content-type:", ct, text.slice(0, 300));
    throw new Error("Response is not valid JSON");
  }
  return res.json();
}

// GET: 구매자 기본 정보
export async function getYoungUserData() {
  try {
    const url = `${API_BASE}/buyer/1`;
    console.log("[YoungUser] GET", url);
    const data = await request(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const obj = Array.isArray(data) ? data[0] : data;
    return [mapToUiProfile(obj || {})];
  } catch (e) {
    console.error("❌ getYoungUserData 실패:", e);
    return [mapToUiProfile()];
  }
}

// POST/PUT: 구매자 정보 저장 (form-data)
export async function saveYoungUserData(user, { method = "POST" } = {}) {
  try {
    const formData = new FormData();
    if (user.id) formData.append("id", user.id);
    formData.append("buyerName", user.name || "");
    formData.append("buyerAge", user.age || "");
    formData.append("buyerGender", user.sex || "");
    formData.append("buyerAddress", user.address || "");
    formData.append("buyerNumber", user.callNumber || "");
    formData.append("buyerEmail", user.mail || "");

    // ⬇️ 좌표 전송
    if (user.buyerLat != null && user.buyerLat !== "")
      formData.append("buyerLat", String(user.buyerLat));
    if (user.buyerLng != null && user.buyerLng !== "")
      formData.append("buyerLng", String(user.buyerLng));

    // 프로필 이미지 파일이 새로 업로드된 경우만 append
    if (user.profileImage instanceof File) {
      formData.append("buyerImage", user.profileImage);
    }

    const url = `${API_BASE}/buyer-upload`;
    console.log("[YoungUser] SAVE", method, url);
    await fetch(url, { method, body: formData });
    return true;
  } catch (e) {
    console.error("❌ saveYoungUserData 실패:", e);
    return false;
  }
}
