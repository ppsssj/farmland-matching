// src/api/applications.js
import API_BASE from "../config/apiBase";

/**
 * farmland/{landId}/{buyerId}/apply 로 신청
 * @param {object} p
 * @param {number|string} p.landId - 필수
 * @param {number|string} [p.buyerId=1] - 기본값 1
 * @param {string} [p.token] - 선택: Authorization 토큰
 * @returns {Promise<any>} 서버 응답(JSON이면 객체, 아니면 문자열)
 */
export async function applyForFarmland({ landId, buyerId = 1, token } = {}) {
  if (!landId && landId !== 0) throw new Error("landId가 필요합니다.");

  const url = `${API_BASE}/farmland/${encodeURIComponent(
    landId
  )}/${encodeURIComponent(buyerId)}/apply`;

  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { method: "POST", headers });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`신청 실패(${res.status}) ${res.statusText} ${msg?.slice?.(0, 300) || ""}`);
  }
  return body ?? { ok: true };
}
