// src/components/Setting/SettingContent/FarmlandMatchingSetting/MyRegisteredLand.jsx
import { useState, useEffect, useRef } from "react";
import "./MyRegisteredLand.css";
import FloatingEmojis from "../../../pages/Effect/FloatingEmojis";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE from "../../../config/apiBase"; // 공통 API_BASE
/* =======================
   🔎 디버깅 유틸
======================= */
const DEBUG = true; // 필요시 false
function dlog(...args) {
  if (!DEBUG) return;
  // eslint-disable-next-line no-console
  console.log("[MyRegisteredLand]", ...args);
}
function dgroup(title, fn) {
  if (!DEBUG) return fn?.();
  // eslint-disable-next-line no-console
  console.groupCollapsed(`📦 ${title}`);
  try {
    fn?.();
  } finally {
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
}
function dtime(label, start = true) {
  if (!DEBUG) return;
  if (start) console.time(label);
  else console.timeEnd(label);
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { __nonJSON: true, raw: text };
  }
}

async function debugFetch(url, options = {}, note = "") {
  const id = `${note || "fetch"} ${url}`;
  dgroup(`FETCH → ${id}`, () => {
    dlog("URL:", url);
    dlog("Options:", options);
  });
  dtime(id, true);
  try {
    const res = await fetch(url, options);
    dtime(id, false);
    dgroup(`RES ← ${id}`, () => {
      dlog("ok/status:", res.ok, res.status, res.statusText);
      dlog("headers:", Object.fromEntries(res.headers.entries()));
    });
    return res;
  } catch (err) {
    dtime(id, false);
    dgroup(`ERR ← ${id}`, () => {
      dlog("Network error:", err?.message || err);
    });
    throw err;
  }
}

/* =======================
   🏷️ 매칭 상태 유틸 (백엔드 enum과 동기)
======================= */
const MATCH = {
  WAITING: "WAITING",
  IN_PROGRESS: "IN_PROGRESS",
  REJECTED: "REJECTED",
};
const MATCH_LABEL = {
  [MATCH.WAITING]: "매칭 대기중",
  [MATCH.IN_PROGRESS]: "매칭 수락됨",
  [MATCH.REJECTED]: "매칭 거절됨",
};
function labelForMatchStatus(s) {
  return MATCH_LABEL[s] || s || "상태 미정";
}

// Boolean 값 → UI 문자열 매핑
function labelForBoolean(field, value) {
  if (value === null || value === undefined) return "미입력";

  switch (field) {
    case "landElec":
    case "landStorage":
    case "landHouse":
    case "landFence":
    case "landWellRoad": // 포장도로
      return value ? "있음" : "없음";

    case "landMachine":
    case "landCar":
      return value ? "가능" : "불가";

    case "landRoad":
    case "landBus":
      return value ? "인접" : "비인접";

    case "landWater":
      return value ? "있음" : "없음";

    default:
      return String(value);
  }
}

function classForMatchStatus(s) {
  // CSS에서 .ApplicantBadge.WAITING / .IN_PROGRESS / .REJECTED 를 정의해두면 색이 바뀝니다.
  return `ApplicantBadge ${s || MATCH.WAITING}`;
}

/* =======================
   🔧 서버 업데이트/삭제 헬퍼
======================= */
// ⚠️ 서버가 PUT/DELETE 미지원이면 method를 "POST"로 바꾸세요.
async function updateLandOnServer({ baseHeaders, sellerId, landId, payload }) {
  const url = `${API_BASE}/${sellerId}/farmland-update/${landId}`;
  const res = await debugFetch(
    url,
    {
      method: "PUT", // 필요 시 "POST"로 변경
      headers: { "Content-Type": "application/json", ...baseHeaders },
      body: JSON.stringify(payload),
    },
    "LAND_UPDATE"
  );
  const data = await safeJson(res);
  dgroup("🧾 업데이트 응답 JSON", () => dlog(data));
  if (!res.ok) {
    throw new Error(
      `업데이트 실패 status=${res.status} body=${JSON.stringify(data).slice(
        0,
        500
      )}`
    );
  }
  return data;
}

async function deleteLandOnServer({ baseHeaders, sellerId, landId }) {
  const url = `${API_BASE}/${sellerId}/farmland-delete/${landId}`;
  const res = await debugFetch(
    url,
    {
      method: "DELETE", // 필요 시 "POST"로 변경
      headers: { ...baseHeaders },
    },
    "LAND_DELETE"
  );
  const data = await safeJson(res);
  dgroup("🧾 삭제 응답 JSON", () => dlog(data));
  if (!res.ok) {
    throw new Error(
      `삭제 실패 status=${res.status} body=${JSON.stringify(data).slice(
        0,
        500
      )}`
    );
  }
  return data;
}

/* =======================
   🔧 매핑 함수
======================= */
function mapListItem(item, idx) {
  const landId =
    item?.landId ?? item?.id ?? item?.farmlandId ?? `unknown-${idx}`;
  const mapped = {
    id: landId,
    name: item?.landName ?? item?.name ?? "이름 미정",
    location:
      item?.landAddress ??
      item?.landLoadAddress ??
      item?.ownerAddress ??
      "주소 미입력",
    crop: item?.landCrop ?? item?.crop ?? "작물 미입력",
    area: item?.landArea ?? item?.areaSquare ?? item?.area ?? "?",
    areaHa: item?.landAreaha ?? "?", // ✅ 추가 (ha)
    registerDate: item?.landRegisterDate ?? "-", // ✅ 추가 (등록일)
    status: item?.status ?? "등록 완료",
  };
  dgroup(`🧭 mapListItem(${idx})`, () => {
    dlog("input:", item);
    dlog("output:", mapped);
  });
  return mapped;
}

function mapDetailItem(item) {
  const landId = item?.landId ?? item?.id ?? item?.farmlandId;
  const mapped = {
    id: landId,
    name: item?.landName ?? item?.name ?? "이름 미정",
    location:
      item?.landAddress ??
      item?.landLoadAddress ??
      item?.ownerAddress ??
      "주소 미입력",
    crop: item?.landCrop ?? item?.crop ?? "작물 미입력",
    area: item?.landArea ?? item?.areaSquare ?? item?.area ?? "?",
    areaHa: item?.landAreaha ?? "?", // ✅ 추가 (ha)
    registerDate: item?.landRegisterDate ?? "-", // ✅ 추가 (등록일)
    status: item?.status ?? "등록 완료",
    raw: { ...item },
  };
  dgroup("🧭 mapDetailItem", () => {
    dlog("input:", item);
    dlog("output:", mapped);
  });
  return mapped;
}

/* =======================
   🧩 프레젠터 조각
======================= */
function LabeledRow({ label, value }) {
  return (
    <div className="MyRegisteredLand-Row">
      <span className="MyRegisteredLand-Label">{label}</span>
      <span className="MyRegisteredLand-Value">
        {value ?? value === 0 ? String(value) : "미입력"}
      </span>
    </div>
  );
}

function FileLinkOrText({ url, label }) {
  if (!url) return <LabeledRow label={label} value={null} />;
  const isImage =
    typeof url === "string" &&
    (url.endsWith(".png") ||
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".webp"));
  return (
    <div className="MyRegisteredLand-Row">
      <span className="MyRegisteredLand-Label">{label}</span>
      <span className="MyRegisteredLand-Value">
        {isImage ? (
          <img
            src={url}
            alt={label}
            className="MyRegisteredLand-PreviewImage"
          />
        ) : (
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        )}
      </span>
    </div>
  );
}

// 따옴표가 이중으로 들어온 문자열 처리: "\"박성진\"" -> "박성진"
function stripWrapQuotes(v) {
  if (typeof v !== "string") return v;
  const s = v.trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1);
  }
  return v;
}

// 서버 JSON(신청자 상세) -> 우리 화면 상태로 정규화
function normalizeApplicantDetail(raw) {
  if (!raw || typeof raw !== "object") return null;

  const buyerName = stripWrapQuotes(raw.buyerName);
  const buyerNumber = stripWrapQuotes(raw.buyerNumber);

  const arr = (v) => (Array.isArray(v) ? v : []);
  const join = (v) => arr(v).filter(Boolean).join(", ");

  return {
    // 공통 식별/표시 필드
    id: raw.buyerId ?? null,
    name: buyerName ?? "",
    callNumber: buyerNumber ?? "",

    // 오른쪽 상세 패널에서 그대로 문자열로 출력되는 필드들:
    presentation: raw.oneIntroduction ?? "", // 🧾
    interest: join(raw.interestCrop), // 🌱
    suggest: join(raw.suggests), // 🤝 (현재 []면 빈 문자열)
    video: raw.videoURL ?? "", // 🎬
    experience: raw.experience ?? "", // 🧑‍🌾
    expereince: raw.experience ?? "", // (오타 키 하위호환)
    skill: join(raw.equipment), // 🛠️
    want: join(raw.wantTrade), // 💼

    // 필요시 참고용
    licenses: arr(raw.licenses).filter(Boolean),
    trustScore: raw.trustScore ?? null,
    matchStatus: raw.matchStatus ?? MATCH.WAITING,

    // 원본 전체
    detail: raw,
  };
}
/* =======================
   🏗 컴포넌트
======================= */
// 개별 신청자 상세 프리로드(배치 로딩) 유틸
async function fetchApplicantDetail({
  baseHeaders,
  sellerId,
  landId,
  buyerId,
}) {
  const url = `${API_BASE}/${sellerId}/farmland/${landId}/applicants/${buyerId}`;
  const res = await debugFetch(
    url,
    { headers: { ...baseHeaders } },
    "APPLICANT_DETAIL[preload]"
  );
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(
      `프리로드 실패 buyerId=${buyerId} status=${
        res.status
      } body=${JSON.stringify(data).slice(0, 300)}`
    );
  }
  return data;
}

async function preloadApplicantsDetail({
  baseHeaders,
  sellerId,
  landId,
  list,
  onMerge,
}) {
  // 병렬 로딩 (느린 서버면 동시성 제한 걸어도 됨)
  const tasks = list.map((a) =>
    fetchApplicantDetail({ baseHeaders, sellerId, landId, buyerId: a.id })
      .then((raw) => ({
        ok: true,
        buyerId: a.id,
        norm: normalizeApplicantDetail(raw),
      }))
      .catch((e) => ({
        ok: false,
        buyerId: a.id,
        error: e?.message || String(e),
      }))
  );
  const results = await Promise.allSettled(tasks);
  const okItems = results
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter(Boolean)
    .filter((r) => r.ok && r.norm);

  if (okItems.length) {
    // 상위 상태에 머지
    onMerge?.((prev) =>
      prev.map((a) => {
        const hit = okItems.find((x) => x.buyerId === a.id);
        if (!hit) return a;
        const n = hit.norm;
        return {
          ...a,
          name: n.name || a.name,
          callNumber: n.callNumber || a.callNumber,
          presentation: n.presentation ?? a.presentation,
          interest: n.interest ?? a.interest,
          suggest: n.suggest ?? a.suggest,
          video: n.video ?? a.video,
          experience: n.experience ?? a.experience,
          expereince: n.expereince ?? n.experience ?? a.expereince,
          skill: n.skill ?? a.skill,
          want: n.want ?? a.want,
          licenses: n.licenses ?? a.licenses,
          matchStatus: n.matchStatus ?? a.matchStatus,
          detail: n.detail ?? a.detail,
        };
      })
    );
  }
}

function MyRegisteredLand({ sellerId: sellerIdProp }) {
  const navigate = useNavigate();
  const params = useParams();
  const sellerId = sellerIdProp ?? params.sellerId ?? 1;

  const [lands, setLands] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedLand, setSelectedLand] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 신청자
  const [applicants, setApplicants] = useState([]); // [{ buyerId, name, ... , matchStatus }]
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loadingApplicantDetail, setLoadingApplicantDetail] = useState(false);

  // 수정/슬라이더
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(0);

  const mountedRef = useRef(false);

  // (선택) 인증 토큰이 있다면 여기에
  const token = localStorage.getItem("accessToken") || null;
  const baseHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  /* ========== 1) 목록 로드: GET /${sellerId}/farmland ========== */
  useEffect(() => {
    mountedRef.current = true;
    dgroup("🔔 useEffect[mount]", () => dlog("sellerId =", sellerId));

    (async () => {
      dlog("📥 목록 불러오기 시작");
      setLoadingList(true);
      const url = `${API_BASE}/${sellerId}/farmland`;
      try {
        const res = await debugFetch(
          url,
          { headers: { ...baseHeaders } },
          "LIST"
        );
        const data = await safeJson(res);
        dgroup("🧾 목록 JSON", () => dlog(data));
        if (!res.ok) {
          throw new Error(
            `목록 오류 status=${res.status} body=${JSON.stringify(data).slice(
              0,
              500
            )}`
          );
        }
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : [];
        if (!Array.isArray(arr)) {
          dlog("⚠️ 예상치 못한 목록 응답 형태:", data);
        }
        const mapped = arr.map((it, i) => mapListItem(it, i));
        setLands(mapped);
        dgroup("📋 목록 테이블", () => console.table?.(mapped));
      } catch (e) {
        dgroup("❌ 목록 로드 실패", () => dlog(e?.message || e));
        setLands([]);
      } finally {
        setLoadingList(false);
        dlog("📥 목록 불러오기 종료");
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [sellerId]); // eslint-disable-line

  /* ========== 2) 상세 로드(+신청자 목록 포함): GET /${sellerId}/farmland/{landId} ========== */
  const openDetail = async (landSummary) => {
    const landId = landSummary?.id;
    dgroup("🖱 카드 클릭", () => {
      dlog("sellerId:", sellerId, "landId:", landId);
      dlog("summary:", landSummary);
    });
    if (!landId && landId !== 0) {
      alert("landId가 없습니다.");
      return;
    }

    setLoadingDetail(true);
    setSelectedLand(null);
    setEditMode(false);
    setApplicants([]);
    setSelectedApplicant(null);
    setSectionIndex(0);

    const url = `${API_BASE}/${sellerId}/farmland/${landId}`;
    try {
      const res = await debugFetch(
        url,
        { headers: { ...baseHeaders } },
        "DETAIL"
      );
      const data = await safeJson(res);
      dgroup("🧾 상세 JSON", () => dlog(data));
      if (!res.ok) {
        throw new Error(
          `상세 오류 status=${res.status} body=${JSON.stringify(data).slice(
            0,
            500
          )}`
        );
      }
      // 상세 본문
      const mappedDetail = mapDetailItem(data);
      setSelectedLand(mappedDetail);

      // ✅ 신청자 목록 포함되는 형식 가정: data.applicants 또는 data.buyers 등
      const listFromDetail = Array.isArray(data?.applicants)
        ? data.applicants
        : Array.isArray(data?.buyers)
        ? data.buyers
        : [];

      // 서버에서 주는 키 이름을 보정(buyerId/name/matchStatus 등)
      const normalizedApplicants = listFromDetail.map((a, i) => {
        const buyerId = a?.buyerId ?? a?.id ?? a?.applicantId ?? i;
        const matchStatus = a?.matchStatus ?? a?.status ?? MATCH.WAITING;
        return {
          buyerId,
          id: buyerId,
          name: a?.name ?? a?.buyerName ?? `신청자#${buyerId}`,
          age: a?.age ?? a?.buyerAge ?? "-",
          sex: a?.sex ?? a?.gender ?? "-",
          address: a?.address ?? a?.buyerAddress ?? "-",
          callNumber: a?.phone ?? a?.callNumber ?? "-",
          presentation: a?.presentation ?? "",
          interest: a?.interest ?? "",
          suggest: a?.suggest ?? "",
          video: a?.video ?? "",
          expereince: a?.expereince ?? a?.experience ?? "",
          skill: a?.skill ?? "",
          want: a?.want ?? "",
          detail: a?.detail ?? { yellow: {}, green: {}, grey: {} },
          matchStatus,
        };
      });

      setApplicants(normalizedApplicants);
      dgroup("👥 신청자 목록(상세 포함)", () =>
        console.table?.(normalizedApplicants)
      );

      // ✅✅ 들어오자마자 각 신청자의 matchStatus를 최신화: 병렬 프리로드
      preloadApplicantsDetail({
        baseHeaders,
        sellerId,
        landId,
        list: normalizedApplicants,
        onMerge: setApplicants,
      }).catch((e) => dlog("프리로드 오류:", e?.message || e));
      dgroup("👥 신청자 목록(상세 포함)", () =>
        console.table?.(normalizedApplicants)
      );
    } catch (e) {
      dgroup("❌ 상세 로드 실패", () => dlog(e?.message || e));
      alert("상세 정보를 불러오지 못했습니다. (콘솔 로그 참고)");
    } finally {
      setLoadingDetail(false);
      dlog("📥 상세 불러오기 종료");
    }
  };

  /* ========== 3) 신청자 상세: GET /${sellerId}/farmland/{landId}/applicants/{buyerId} ========== */
  const loadApplicantDetail = async (buyerId) => {
    if (!selectedLand?.id) return;
    const landId = selectedLand.id;
    const url = `${API_BASE}/${sellerId}/farmland/${landId}/applicants/${buyerId}`;
    try {
      setLoadingApplicantDetail(true);
      const res = await debugFetch(
        url,
        { headers: { ...baseHeaders } },
        "APPLICANT_DETAIL"
      );
      const data = await safeJson(res);
      dgroup("🧾 신청자 상세 JSON", () => dlog(data));
      if (!res.ok) {
        throw new Error(
          `신청자 상세 오류 status=${res.status} body=${JSON.stringify(
            data
          ).slice(0, 500)}`
        );
      }

      // ✅ 서버 스키마 → 화면 스키마 정규화
      const norm = normalizeApplicantDetail(data);
      if (!norm)
        throw new Error("정규화 실패: 서버 응답 형식이 올바르지 않습니다.");

      // 리스트의 해당 신청자 갱신
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === buyerId
            ? {
                ...a,
                // 이름/연락처 업데이트(겹따옴표 제거된 값)
                name: norm.name || a.name,
                callNumber: norm.callNumber || a.callNumber,

                // 오른쪽 패널에서 쓰는 문자열 필드들
                presentation: norm.presentation ?? a.presentation,
                interest: norm.interest ?? a.interest,
                suggest: norm.suggest ?? a.suggest,
                video: norm.video ?? a.video,
                experience: norm.experience ?? a.experience,
                expereince: norm.expereince ?? norm.experience ?? a.expereince, // 하위호환
                skill: norm.skill ?? a.skill,
                want: norm.want ?? a.want,

                // 참고 필드
                licenses: norm.licenses ?? a.licenses,
                matchStatus: norm.matchStatus ?? a.matchStatus,
                detail: norm.detail ?? a.detail,
              }
            : a
        )
      );

      // 선택된 신청자 갱신(같은 규칙)
      setSelectedApplicant((prev) =>
        prev && prev.id === buyerId
          ? {
              ...prev,
              name: norm.name || prev.name,
              callNumber: norm.callNumber || prev.callNumber,

              presentation: norm.presentation ?? prev.presentation,
              interest: norm.interest ?? prev.interest,
              suggest: norm.suggest ?? prev.suggest,
              video: norm.video ?? prev.video,
              experience: norm.experience ?? prev.experience,
              expereince: norm.expereince ?? norm.experience ?? prev.expereince,
              skill: norm.skill ?? prev.skill,
              want: norm.want ?? prev.want,

              licenses: norm.licenses ?? prev.licenses,
              matchStatus: norm.matchStatus ?? prev.matchStatus,
              trustScore: norm.trustScore ?? prev.trustScore,
              detail: norm.detail ?? prev.detail,
            }
          : prev
      );
    } catch (e) {
      dgroup("❌ 신청자 상세 실패", () => dlog(e?.message || e));
      alert("신청자 상세 정보를 불러오지 못했습니다. (콘솔 로그 참고)");
    } finally {
      setLoadingApplicantDetail(false);
    }
  };

  /* ========== 4) 신청 수락/거절 ========== */
  // POST /${sellerId}/farmland/{landId}/applicants/{buyerId}/accept
  // POST /${sellerId}/farmland/{landId}/applicants/{buyerId}/reject
  const acceptApplicant = async (buyerId) => {
    if (!selectedLand?.id) return;
    const landId = selectedLand.id;
    const url = `${API_BASE}/${sellerId}/farmland/${landId}/applicants/${buyerId}/accept`;

    // ✅ 낙관적 업데이트: 수락 → 진행중(IN_PROGRESS)로 표시
    const prevApplicants = applicants;
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === buyerId ? { ...a, matchStatus: MATCH.IN_PROGRESS } : a
      )
    );
    if (selectedApplicant?.id === buyerId) {
      setSelectedApplicant({
        ...selectedApplicant,
        matchStatus: MATCH.IN_PROGRESS,
      });
    }

    try {
      const res = await debugFetch(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...baseHeaders },
        },
        "APPLICANT_ACCEPT"
      );
      const data = await safeJson(res);
      dgroup("🧾 수락 응답 JSON", () => dlog(data));
      if (!res.ok) {
        throw new Error(
          `수락 실패 status=${res.status} body=${JSON.stringify(data).slice(
            0,
            500
          )}`
        );
      }
      // 필요 시: 상세 재조회하여 상태 일치화
      // await openDetail({ id: landId });
    } catch (e) {
      // 롤백
      setApplicants(prevApplicants);
      if (selectedApplicant?.id === buyerId) {
        setSelectedApplicant(
          prevApplicants.find((a) => a.id === buyerId) || null
        );
      }
      dgroup("❌ 수락 실패 → 롤백", () => dlog(e?.message || e));
      alert("수락 처리에 실패했습니다. (콘솔 로그 참고)");
    }
  };

  const rejectApplicant = async (buyerId) => {
    if (!selectedLand?.id) return;
    const landId = selectedLand.id;
    const url = `${API_BASE}/${sellerId}/farmland/${landId}/applicants/${buyerId}/reject`;

    // ✅ 낙관적 업데이트: 거절 → REJECTED
    const prevApplicants = applicants;
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === buyerId ? { ...a, matchStatus: MATCH.REJECTED } : a
      )
    );
    if (selectedApplicant?.id === buyerId) {
      setSelectedApplicant({
        ...selectedApplicant,
        matchStatus: MATCH.REJECTED,
      });
    }

    try {
      const res = await debugFetch(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...baseHeaders },
        },
        "APPLICANT_REJECT"
      );
      const data = await safeJson(res);
      dgroup("🧾 거절 응답 JSON", () => dlog(data));
      if (!res.ok) {
        throw new Error(
          `거절 실패 status=${res.status} body=${JSON.stringify(data).slice(
            0,
            500
          )}`
        );
      }
      // 필요 시: 상세 재조회하여 상태 일치화
      // await openDetail({ id: landId });
    } catch (e) {
      setApplicants(prevApplicants);
      if (selectedApplicant?.id === buyerId) {
        setSelectedApplicant(
          prevApplicants.find((a) => a.id === buyerId) || null
        );
      }
      dgroup("❌ 거절 실패 → 롤백", () => dlog(e?.message || e));
      alert("거절 처리에 실패했습니다. (콘솔 로그 참고)");
    }
  };

  /* ========== 삭제/수정 (서버 연동) ========== */
  const handleDelete = async (id) => {
    dgroup("🗑 삭제 클릭", () => dlog("target landId:", id));
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    // 낙관적 업데이트 준비
    const prevLands = lands;
    const prevSelected = selectedLand;

    // 낙관적 삭제
    setLands((prev) => prev.filter((land) => land.id !== id));
    setSelectedLand((prev) => (prev?.id === id ? null : prev));
    setEditMode(false);
    setApplicants([]);
    setSelectedApplicant(null);

    try {
      await deleteLandOnServer({ baseHeaders, sellerId, landId: id });
      // 성공 시 끝
    } catch (e) {
      // 롤백
      dgroup("❌ 삭제 실패 → 롤백", () => dlog(e?.message || e));
      setLands(prevLands);
      setSelectedLand(prevSelected);
      alert("삭제에 실패했습니다. (콘솔 로그 참고)");
    }
  };

  const handleEditStart = (land) => {
    dgroup("✏️ 수정 시작", () => dlog("land:", land));
    setEditMode(true);
    setEditForm({
      id: land.id,
      name: land.name,
      location: land.location,
      crop: land.crop,
      area: land.area,
      status: land.status,
    });
  };

  const handleEditChange = (key, value) =>
    setEditForm((prev) => ({ ...prev, [key]: value }));

  const handleEditSave = async () => {
    dgroup("💾 수정 저장", () => dlog("editForm:", editForm));
    if (!editForm) return;

    const landId = editForm.id;
    // 서버가 기대하는 키에 맞춰 페이로드 구성
    const payload = {
      landName: editForm.name,
      landAddress: editForm.location,
      landCrop: editForm.crop,
      landArea: Number(editForm.area ?? 0),
      status: editForm.status,
    };

    // 낙관적 업데이트 준비
    const next = {
      ...editForm,
      area:
        editForm.area === "" || editForm.area === null
          ? 0
          : Number(editForm.area),
    };
    const prevLands = lands;
    const prevSelected = selectedLand;

    // 낙관적 적용
    setLands((prev) =>
      prev.map((l) => (l.id === next.id ? { ...l, ...next } : l))
    );
    setSelectedLand((prev) => (prev ? { ...prev, ...next } : prev));
    setEditMode(false);

    try {
      const server = await updateLandOnServer({
        baseHeaders,
        sellerId,
        landId,
        payload,
      });
      // 서버에서 최신 레코드가 오면 그걸로 동기화
      if (server) {
        const mappedListItem = mapListItem(server, 0);
        const mappedDetailItem = mapDetailItem(server);
        setLands((prev) =>
          prev.map((l) => (l.id === landId ? { ...l, ...mappedListItem } : l))
        );
        setSelectedLand((prev) =>
          prev ? { ...prev, ...mappedDetailItem } : prev
        );
      }
    } catch (e) {
      // 롤백
      dgroup("❌ 수정 실패 → 롤백", () => dlog(e?.message || e));
      setLands(prevLands);
      setSelectedLand(prevSelected);
      alert("수정에 실패했습니다. (콘솔 로그 참고)");
    }
  };

  /* ========== 섹션/네비 ========== */
  const goPrev = () => {
    dlog("⬅ 섹션 이전:", sectionIndex - 1);
    setSectionIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    dlog("➡ 섹션 다음:", sectionIndex + 1);
    setSectionIndex((i) => (i < sections.length - 1 ? i + 1 : 0));
  };

  const r = selectedLand?.raw ?? {};

  const sections = [
    {
      title: "기본 정보",
      content: (
        <>
          <LabeledRow label="농지명" value={r.landName} />
          <LabeledRow label="행정주소" value={r.landAddress} />
          <LabeledRow label="도로명 주소" value={r.landLoadAddress} />
          <LabeledRow label="지번" value={r.landNumber} />
          <LabeledRow label="위도" value={r.landLat} />
          <LabeledRow label="경도" value={r.landLng} />
          <LabeledRow label="작물" value={r.landCrop} />
          {/* ✅ 면적 분리 출력: ㎡ / ha */}
          <LabeledRow
            label="면적(㎡)"
            value={r.landArea ?? selectedLand?.area}
          />
          <LabeledRow
            label="면적(ha)"
            value={r.landAreaha ?? selectedLand?.areaHa}
          />
          <LabeledRow label="토양" value={r.soiltype} />
          <LabeledRow label="용수" value={r.waterSource} />
          {/* ✅ 등록일 */}
          <LabeledRow
            label="등록일"
            value={r.landRegisterDate ?? selectedLand?.registerDate}
          />
        </>
      ),
    },
    {
      title: "소유자 정보",
      content: (
        <>
          <LabeledRow label="소유자" value={r.ownerName} />
          <LabeledRow label="소유자 나이" value={r.ownerAge} />
          <LabeledRow label="거주지" value={r.ownerAddress} />
        </>
      ),
    },
    {
      title: "시설/설비 상태",
      content: (
        <>
          <LabeledRow
            label="농업용수"
            value={labelForBoolean("landWater", r.landWater)}
          />
          <LabeledRow
            label="전기"
            value={labelForBoolean("landElec", r.landElec)}
          />
          <LabeledRow
            label="농기계 접근"
            value={labelForBoolean("landMachine", r.landMachine)}
          />
          <LabeledRow
            label="창고"
            value={labelForBoolean("landStorage", r.landStorage)}
          />
          <LabeledRow
            label="비닐하우스"
            value={labelForBoolean("landHouse", r.landHouse)}
          />
          <LabeledRow
            label="울타리"
            value={labelForBoolean("landFence", r.landFence)}
          />
        </>
      ),
    },
    {
      title: "접근성/교통",
      content: (
        <>
          <LabeledRow
            label="도로 인접"
            value={labelForBoolean("landRoad", r.landRoad)}
          />
          <LabeledRow
            label="포장도로"
            value={labelForBoolean("landWellRoad", r.landWellRoad)}
          />
          <LabeledRow
            label="대중교통"
            value={labelForBoolean("landBus", r.landBus)}
          />
          <LabeledRow
            label="차량 진입"
            value={labelForBoolean("landCar", r.landCar)}
          />
        </>
      ),
    },

    {
      title: "거래 정보",
      content: (
        <>
          <LabeledRow label="거래 형태" value={r.landTrade} />
          <LabeledRow label="우선 매칭" value={r.landMatch} />
          <LabeledRow label="희망 금액" value={r.landPrice} />
          <LabeledRow label="매도 희망 시기" value={r.landWhen} />
        </>
      ),
    },
    {
      title: "메모/기타",
      content: (
        <>
          <LabeledRow label="등록 사유" value={r.landWhy} />
          <LabeledRow label="어르신 한마디" value={r.landComent} />
        </>
      ),
    },
    {
      title: "이미지/서류",
      content: (
        <>
          <FileLinkOrText label="대표 이미지" url={r.landImage} />
          <FileLinkOrText label="등기부등본" url={r.landRegister} />
          <FileLinkOrText label="토지대장" url={r.landCadastre} />
          <FileLinkOrText label="농지원부/경영체" url={r.landCertification} />
        </>
      ),
    },
  ];

  return (
    <div className="MyRegisteredLand-Wrapper">
      <FloatingEmojis />

      <button
        className="SeniorProfile-BackButton"
        onClick={() => navigate("/SeniorMain")}
        type="button"
      >
        ⬅ 홈으로
      </button>

      {/* 좌측: 목록 */}
      <section className="MyRegisteredLand-LeftPanel">
        <h2>📋 내가 등록한 농지 목록</h2>
        {loadingList ? (
          <p>불러오는 중...</p>
        ) : lands.length === 0 ? (
          <p>아직 등록된 농지가 없습니다.</p>
        ) : (
          lands.map((land) => (
            <div key={land.id} className="MyRegisteredLand-LandCard">
              <div className="MyRegisteredLand-LandTitle">{land.name}</div>
              <div className="MyRegisteredLand-LandDetails">
                {/* 📐 ㎡ / ha 동시 표시 (ha 값이 유효할 때만 뒤에 붙임) */}
                📍 {land.location} | 🌱 {land.crop} | 📐 {land.area}㎡
                {land.areaHa !== "?" &&
                land.areaHa !== "" &&
                land.areaHa !== null &&
                land.areaHa !== undefined
                  ? ` / ${land.areaHa}ha`
                  : ""}
              </div>
              <div className="MyRegisteredLand-LandStatus">
                상태: {land.status}
              </div>
              <div className="MyRegisteredLand-ButtonGroup">
                <div
                  className="MyRegisteredLand-Button"
                  onClick={() => openDetail(land)}
                >
                  자세히 보기
                </div>
                <div
                  className="MyRegisteredLand-Button danger"
                  onClick={() => handleDelete(land.id)}
                >
                  삭제
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* 우측: 상세 + 신청자 */}
      <aside className="MyRegisteredLand-DetailPanel">
        {loadingDetail ? (
          <p className="MyRegisteredLand-EmptyDetail">상세 불러오는 중...</p>
        ) : selectedLand ? (
          <>
            <h3 className="MyRegisteredLand-RightTitle">
              👨‍🌾{selectedLand?.name ?? "선택한 농지"}
            </h3>

            {editMode ? (
              <>
                <label>농지 이름</label>
                <input
                  className="MyRegisteredLand-Input"
                  value={editForm?.name ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                />

                <label>위치</label>
                <input
                  className="MyRegisteredLand-Input"
                  value={editForm?.location ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, location: e.target.value }))
                  }
                />

                <label>작물</label>
                <input
                  className="MyRegisteredLand-Input"
                  value={editForm?.crop ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, crop: e.target.value }))
                  }
                />

                <label>면적(㎡)</label>
                <input
                  className="MyRegisteredLand-Input"
                  type="number"
                  value={editForm?.area ?? 0}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, area: e.target.value }))
                  }
                />

                <label>상태</label>
                <input
                  className="MyRegisteredLand-Input"
                  value={editForm?.status ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, status: e.target.value }))
                  }
                />

                <div className="MyRegisteredLand-ButtonGroup">
                  <div
                    className="MyRegisteredLand-Button"
                    onClick={handleEditSave}
                  >
                    💾 저장
                  </div>
                  <div
                    className="MyRegisteredLand-Button gray"
                    onClick={() => setEditMode(false)}
                  >
                    ❌ 취소
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 섹션 슬라이더 */}
                <div className="SectionSlider">
                  <div className="SectionSlider-Header">
                    <button
                      className="NavBtn"
                      onClick={goPrev}
                      disabled={sectionIndex === 0}
                      title="이전 섹션"
                    >
                      ⬅
                    </button>
                    <div className="SectionTitle">
                      {sections[sectionIndex].title}
                    </div>
                    <button
                      className="NavBtn"
                      onClick={goNext}
                      title="다음 섹션"
                    >
                      ➡
                    </button>
                  </div>

                  <div
                    key={sectionIndex}
                    className="SectionSlider-Body fade-slide"
                  >
                    {sections[sectionIndex].content}
                  </div>

                  <div className="SectionSlider-Progress">
                    {sections.map((_, i) => (
                      <span
                        key={i}
                        className={`dot ${i === sectionIndex ? "active" : ""}`}
                        onClick={() => {
                          dlog("• 섹션 점 클릭:", i);
                          setSectionIndex(i);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="MyRegisteredLand-ButtonGroup">
                  <div
                    className="MyRegisteredLand-Button"
                    onClick={() => {
                      dgroup("✏️ 수정 시작", () => dlog("land:", selectedLand));
                      setEditMode(true);
                      setEditForm({
                        id: selectedLand.id,
                        name: selectedLand.name,
                        location: selectedLand.location,
                        crop: selectedLand.crop,
                        area: selectedLand.area,
                        status: selectedLand.status,
                      });
                    }}
                  >
                    ✏️ 수정
                  </div>
                  <div
                    className="MyRegisteredLand-Button gray"
                    onClick={() => setSelectedLand(null)}
                  >
                    닫기
                  </div>
                </div>
              </>
            )}

            {/* 신청자 */}
            <div className="MyRegisteredLand-Applicants">
              <h4>👥 신청자 목록</h4>

              {applicants.length === 0 ? (
                <p className="MyRegisteredLand-EmptyApplicants">
                  신청자가 없습니다.
                </p>
              ) : (
                <div className="MyRegisteredLand-ApplicantsLayout">
                  {/* 왼쪽 리스트 */}
                  <div className="MyRegisteredLand-ApplicantsList">
                    {applicants.map((a) => (
                      <div
                        key={a.id}
                        className={`ApplicantItem ${
                          selectedApplicant?.id === a.id ? "active" : ""
                        }`}
                        onClick={() => {
                          dlog("👤 신청자 클릭:", a?.id, a?.name);
                          setSelectedApplicant(a);
                          // 상세 정보 추가 로드
                          loadApplicantDetail(a.id);
                        }}
                      >
                        <div className="ApplicantNameRow">
                          <span className="ApplicantName">{a.name}</span>
                          <span className={classForMatchStatus(a.matchStatus)}>
                            {labelForMatchStatus(a.matchStatus)}
                          </span>
                        </div>
                        <div className="ApplicantMeta">
                          {a.age}세 · {a.sex} · {a.address}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 우측 상세 */}
                  <div className="MyRegisteredLand-ApplicantDetail">
                    {selectedApplicant ? (
                      <>
                        <div className="ApplicantDetail-Header">
                          <div className="ApplicantDetail-Name">
                            {selectedApplicant.name}
                            {loadingApplicantDetail ? " (불러오는 중…)" : ""}
                          </div>
                          <div
                            className={classForMatchStatus(
                              selectedApplicant.matchStatus
                            )}
                          >
                            {labelForMatchStatus(selectedApplicant.matchStatus)}
                          </div>
                        </div>

                        <div className="ApplicantDetail-Body">
                          <div className="mrl-detail-row">
                            <span>📞 전화번호</span>
                            <span>{selectedApplicant.callNumber}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>🧾 자기소개</span>
                            <span>{selectedApplicant.presentation}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>🌱 관심작물</span>
                            <span>{selectedApplicant.interest}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>🤝 추천인</span>
                            <span>{selectedApplicant.suggest}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>📹 소개 영상</span>
                            <span>{selectedApplicant.video}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>👨‍🌾 경력</span>
                            <span>{selectedApplicant.experience}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>🛠️ 보유 장비</span>
                            <span>{selectedApplicant.skill}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>💡 희망 거래</span>
                            <span>{selectedApplicant.want}</span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>⭐ 신뢰 점수</span>
                            <span>
                              {selectedApplicant.trustScore ?? "미산정"}
                            </span>
                          </div>
                          <div className="mrl-detail-row">
                            <span>📑 자격증</span>
                            <span>
                              {Array.isArray(selectedApplicant.licenses)
                                ? selectedApplicant.licenses
                                    .filter(Boolean)
                                    .join(", ")
                                : ""}
                            </span>
                          </div>{" "}
                          <div className="ApplicantDetail-Tags">
                            {Object.values(
                              selectedApplicant.detail?.yellow || {}
                            ).map((t, i) => (
                              <span key={`y-${i}`} className="Tag yellow">
                                {t}
                              </span>
                            ))}
                            {Object.values(
                              selectedApplicant.detail?.green || {}
                            ).map((t, i) => (
                              <span key={`g-${i}`} className="Tag green">
                                {t}
                              </span>
                            ))}
                            {Object.values(
                              selectedApplicant.detail?.grey || {}
                            ).map((t, i) => (
                              <span key={`gr-${i}`} className="Tag grey">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="MyRegisteredLand-ButtonGroup">
                          <div
                            className="MyRegisteredLand-Button accept"
                            onClick={() =>
                              acceptApplicant(selectedApplicant.id)
                            }
                          >
                            ✅ 신청 수락
                          </div>
                          <div
                            className="MyRegisteredLand-Button reject"
                            onClick={() =>
                              rejectApplicant(selectedApplicant.id)
                            }
                          >
                            🚫 신청 거절
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="MyRegisteredLand-EmptyDetail">
                        좌측에서 신청자를 선택하세요.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="MyRegisteredLand-EmptyDetail">농지를 선택해주세요.</p>
        )}
      </aside>
    </div>
  );
}

export default MyRegisteredLand;
