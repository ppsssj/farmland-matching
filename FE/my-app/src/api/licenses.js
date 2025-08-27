// src/api/licenses.js
import API_BASE from "../config/apiBase";
// 따옴표 정리 유틸: '"정보"' → '정보'
export function sanitizeName(raw) {
  if (raw == null) return "";
  let s = String(raw).trim();
  // 양끝 " 또는 ' 제거
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  // 연속 따옴표 방어
  s = s.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");
  return s.trim();
}

/** GET /{buyerId}/licenses (유연 파싱 + 캐시 무효화) */
export async function getBuyerLicenses({ buyerId = 1, token } = {}) {
  const url = `${API_BASE}/${encodeURIComponent(buyerId)}/licenses`;
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  console.group(`[licenses.js][GET] ${url}`);
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
  const raw = await res.text().catch(() => "");
  console.info("status:", res.status);
  console.info("raw:", raw.slice(0, 800));
  console.groupEnd();

  if (res.status === 204) return [];
  if (!res.ok) throw new Error(`GET /licenses 실패 (${res.status}) ${raw}`);

  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }

  const list =
    Array.isArray(data) ? data
    : Array.isArray(data?.licenses) ? data.licenses
    : Array.isArray(data?.data) ? data.data
    : Array.isArray(data?.result) ? data.result
    : [];

  const normalized = list.map((it) => ({
    id: it.id ?? it.licenseId ?? it.seq ?? null,  // id 없을 수도 있음
    licenseName: sanitizeName(it.licenseName ?? it.name ?? it.title ?? ""),
    fileUrl: it.licenseFile ?? it.fileUrl ?? it.filePath ?? it.url ?? "",
  }));

  console.table(normalized.map(({ id, licenseName, fileUrl }) => ({ id, licenseName, fileUrl })));
  return normalized;
}

/** POST /{buyerId}/license-save */
export async function saveBuyerLicenses({
  buyerId = 1,
  items = [], // [{id, name, file}]
  token,
} = {}) {
  const url = `${API_BASE}/${encodeURIComponent(buyerId)}/license-save`;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const fd = new FormData();

  items.forEach((it, i) => {
    const id   = it.id != null ? String(it.id) : "";
    const name = it.name || "";
    const file = it.file || null;

    fd.append(`licenseList[${i}].licenseId`, id);
    fd.append(`licenseList[${i}].licenseName`, name);

    // 파일이 실제로 선택된 경우에만 전송 (미선택 시 생략 → 서버가 기존 파일 유지)
    if (file instanceof File) {
      fd.append(`licenseList[${i}].licenseFile`, file, file.name);
    }
  });

  console.group(`[licenses.js] POST ${url}`);
  for (const [k, v] of fd.entries()) {
    console.log("FormData >", k, v instanceof File ? v.name : v);
  }
  console.groupEnd();

  const res = await fetch(url, { method: "POST", headers, body: fd });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`POST /license-save 실패 (${res.status}) ${text}`);
  return { ok: true };
}
