// src/api/trustProfile.js
import API_BASE from "../config/apiBase";
/**
 * 구매자 신뢰정보 불러오기
 * GET /buyer-trustProfile/{buyerId}
 */
export async function getBuyerTrustProfile(buyerId, { token } = {}) {
  if (buyerId == null) throw new Error("buyerId가 필요합니다.");
  const url = `${API_BASE}/buyer-trustProfile/${encodeURIComponent(buyerId)}`;
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[GET trustProfile] ${res.status} ${res.statusText} ${text}`);
  }

  // 백엔드가 없을 수도 있어 204(No Content) 방지
  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text || null; }
}

/**
 * 구매자 신뢰정보 저장(등록/수정)
 * POST /buyer-trustProfile-save/{buyerId}
 * body: JSON
 */
export async function saveBuyerTrustProfile(buyerId, payload, { token } = {}) {
  if (buyerId == null) throw new Error("buyerId가 필요합니다.");
  const url = `${API_BASE}/buyer-trustProfile-save/${encodeURIComponent(buyerId)}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[POST trustProfile] ${res.status} ${res.statusText} ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text || null; }
}
