// src/components/Setting/SettingContent/FarmlandMatchingSetting/SeniorFlow.jsx
import { useEffect, useState, useRef } from "react";
import Step1_Location from "./Step1_Location";
import Step2_Crop from "./Step2_Crop";
import Step3_LandDetail from "./Step3_LandDetail";
import Step4_Facility from "./Step4_Facility";
import Step5_Access from "./Step5_Access";
import Step6_Review from "./Step6_Review";
import Step7_TradeDocs from "./Step7_TradeDocs";
import FloatingEmojis from "../../../pages/Effect/FloatingEmojis";
import "./SeniorFlow.css";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE from "../../../config/apiBase";
/* =======================
   🔎 디버깅 토글/유틸
======================== */
const DEBUG = true;
function dlog(...args) {
  if (DEBUG) console.log("[SeniorFlow]", ...args);
}
function dwarn(...args) {
  if (DEBUG) console.warn("[SeniorFlow]", ...args);
}
function derr(...args) {
  if (DEBUG) console.error("[SeniorFlow]", ...args);
}

const MAX_FILE_SIZE_MB = 25; // 서버 제한과 맞추기
const ALLOWED_MIMES = ["image/jpeg", "image/png", "application/pdf"];

function SeniorFlow({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const firstRender = useRef(true);

  // sellerId가 URL 파라미터로 오는 경우를 대비 (없으면 1 사용)
  const { sellerId: sellerIdParam } = useParams();
  const sellerId = sellerIdParam || "1";

  const [formData, setFormData] = useState({
    landName: "",
    address: "",
    roadAddress: "",
    landNumber: "",
    lat: "",
    lng: "",

    crop: "",
    areaSquare: "", // ㎡
    areaHectare: "", // ha

    soilType: "",
    waterSource: "",
    owner: "",
    ownerAge: "",
    home: "",

    hasWater: "",
    hasElectricity: "",
    machineAccess: "",
    facilities: [],

    hasWarehouse: "",
    hasGreenhouse: "",
    hasFence: "",

    nearRoad: "",
    pavedRoad: "",
    publicTransit: "",
    carAccess: "",

    tradeType: "",
    preferMatch: "",
    wishPrice: "",
    wishWhen: "",

    photos: [],
    reason: "",
    docDeung: null,
    docToji: null,
    docNong: null,
    comment: "",
  });

  /* 초기 마운트 로깅 */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      dlog("✅ SeniorFlow mounted. sellerId =", sellerId);
    }
  }, [sellerId]);

  /* 단계 이동 로깅 */
  const next = () => {
    setStep((s) => {
      const ns = Math.min(7, s + 1);
      dlog(`➡️ Step ${s} -> ${ns}`);
      return ns;
    });
  };
  const back = () => {
    setStep((s) => {
      const ns = Math.max(1, s - 1);
      dlog(`⬅️ Step ${s} -> ${ns}`);
      return ns;
    });
  };

  const updateData = (key, value) => {
    setFormData((prev) => {
      const old = prev[key];
      if (old !== value) {
        dlog(`✏️ updateData: ${key}`, "from:", old, "to:", value);
      }
      return { ...prev, [key]: value };
    });
  };

  const updateArray = (key, value, checked) => {
    setFormData((prev) => {
      const set = new Set(prev[key] || []);
      if (checked) set.add(value);
      else set.delete(value);
      const arr = Array.from(set);
      dlog(`🔧 updateArray: ${key}`, checked ? "ADD" : "DEL", value, "=>", arr);
      return { ...prev, [key]: arr };
    });
  };

  /* --------------------
     입력값 검증 도우미
  ---------------------*/
  const keyMap = {
    landName: "landName",
    address: "landAddress",
    roadAddress: "landLoadAddress", // 서버 getter 기준
    landNumber: "landNumber",
    crop: "landCrop",
    soilType: "soiltype",
    waterSource: "waterSource",
    owner: "ownerName",
    ownerAge: "ownerAge",
    home: "ownerAddress",
    hasWater: "landWater",
    hasElectricity: "landElec",
    machineAccess: "landMachine",
    hasWarehouse: "landStorage",
    hasGreenhouse: "landHouse",
    hasFence: "landFence",
    nearRoad: "landRoad",
    pavedRoad: "landWellRoad",
    publicTransit: "landBus",
    carAccess: "landCar",
    tradeType: "landTrade",
    preferMatch: "landMatch",
    wishPrice: "landPrice",
    wishWhen: "landWhen",
    reason: "landWhy",
    comment: "landComent",
    lat: "landLat",
    lng: "landLng",
  };

  const REQUIRED_FIELDS = ["landName", "address", "landNumber", "crop"];

  function normalizeValueForServer(k, v) {
    // 불린 처리 대상
    const booleanKeys = {
      hasElectricity: { trueValues: ["있음"], falseValues: ["없음"] },
      hasWater: { trueValues: ["있음"], falseValues: ["없음"] },
      machineAccess: { trueValues: ["가능"], falseValues: ["불가"] },
      hasWarehouse: { trueValues: ["있음"], falseValues: ["없음"] },
      hasGreenhouse: { trueValues: ["있음"], falseValues: ["없음"] },
      hasFence: { trueValues: ["있음"], falseValues: ["없음"] },
      nearRoad: { trueValues: ["인접"], falseValues: ["비인접"] },
      pavedRoad: { trueValues: ["있음"], falseValues: ["없음"] },
      publicTransit: { trueValues: ["인접"], falseValues: ["비인접"] },
      carAccess: { trueValues: ["가능"], falseValues: ["불가"] },
    };

    if (booleanKeys[k]) {
      if (booleanKeys[k].trueValues.includes(v)) return "true";
      if (booleanKeys[k].falseValues.includes(v)) return "false";
      return ""; // 선택 안된 경우
    }

    // 숫자 필드 처리
    if (
      [
        "ownerAge",
        "wishPrice",
        "areaSquare",
        "areaHectare",
        "lat",
        "lng",
      ].includes(k)
    ) {
      const num = String(v ?? "").trim();
      if (num && !isNaN(Number(num))) return String(Number(num));
      return "";
    }

    return String(v ?? "");
  }

  function validateBeforeUpload(data) {
    const missing = [];
    REQUIRED_FIELDS.forEach((f) => {
      const v = data[f];
      if (v === undefined || v === null || String(v).trim().length === 0) {
        missing.push(f);
      }
    });

    console.group("🧪 사전 검증(필수/타입/좌표)");
    if (missing.length) {
      console.table(
        missing.map((f) => ({
          field: f,
          value: String(data[f] ?? ""),
          status: "MISSING",
        }))
      );
      dwarn("⚠️ 필수 입력값 누락:", missing);
    } else {
      dlog("✅ 필수 입력값 OK");
    }

    const latOk =
      String(data.lat ?? "") === "" ||
      (Number(data.lat) >= -90 && Number(data.lat) <= 90);
    const lngOk =
      String(data.lng ?? "") === "" ||
      (Number(data.lng) >= -180 && Number(data.lng) <= 180);
    if (!latOk || !lngOk) {
      dwarn("🗺️ 좌표 값 의심:", { lat: data.lat, lng: data.lng });
    } else {
      dlog("🗺️ 좌표 값 OK");
    }

    // DTO 매핑 확인(면적 키는 예외 처리)
    const notMapped = Object.keys(data).filter(
      (k) =>
        ![
          "photos",
          "docDeung",
          "docToji",
          "docNong",
          "facilities",
          "areaSquare",
          "areaHectare",
        ].includes(k) && !keyMap[k]
    );
    if (notMapped.length) {
      dwarn("🧩 서버 DTO에 매핑되지 않는 키(전송 누락 예상):", notMapped);
    } else {
      dlog("🧩 DTO 키 매핑 OK");
    }
    console.groupEnd();

    return { ok: missing.length === 0, missing };
  }

  function checkFiles(data) {
    const problems = [];
    const pushIfBad = (label, f) => {
      if (!f) return;
      if (!(f instanceof File || f instanceof Blob)) {
        problems.push(`${label}: File/Blob 아님 (${typeof f})`);
        return;
      }
      const sizeMB = (f.size || 0) / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB)
        problems.push(`${label}: 용량 초과 ${sizeMB.toFixed(2)}MB`);
      if (f.type && !ALLOWED_MIMES.includes(f.type))
        problems.push(`${label}: MIME ${f.type} 허용 안됨`);
    };

    pushIfBad("등기부등본", data.docDeung);
    pushIfBad("토지대장", data.docToji);
    pushIfBad("농지원부", data.docNong);

    if (Array.isArray(data.photos)) {
      const first = data.photos.find(
        (x) => x instanceof File || x instanceof Blob
      );
      pushIfBad("대표이미지(photos[0])", first);
    }

    if (problems.length) {
      console.group("🖼️ 파일 점검");
      problems.forEach((p) => dwarn(p));
      console.groupEnd();
    } else {
      dlog("🖼️ 파일 점검 OK");
    }
  }

  /* --------------------
     FormData 생성
  ---------------------*/
  function buildMultipart(data) {
    const fd = new FormData();

    // 로그: 원본 데이터 스냅샷
    console.group("📄 전송 원본 formData 스냅샷");
    console.table(
      Object.entries(data).map(([k, v]) => ({
        key: k,
        type: v instanceof File ? `File(${v.type || "?"})` : typeof v,
        value:
          v instanceof File
            ? `${v.name || "(no-name)"} ${Math.round((v.size || 0) / 1024)}KB`
            : JSON.stringify(v)?.slice(0, 120),
      }))
    );
    console.groupEnd();

    // 1) 일반 필드 매핑
    Object.entries(keyMap).forEach(([from, to]) => {
      const v = data[from];
      if (v !== undefined && v !== null && String(v).length > 0) {
        const norm = normalizeValueForServer(from, v);
        fd.append(to, norm);
      }
    });

    // 2) ✅ 면적 필드 개별 전송(㎡ ↔ landArea, ha ↔ landAreaha)
    if (String(data.areaSquare || "").trim().length > 0) {
      fd.append(
        "landArea",
        normalizeValueForServer("landArea", data.areaSquare)
      );
    }
    if (String(data.areaHectare || "").trim().length > 0) {
      fd.append(
        "landAreaha",
        normalizeValueForServer("landAreaha", data.areaHectare)
      );
    }

    // 3) 파일
    if (data.docDeung instanceof File || data.docDeung instanceof Blob) {
      fd.append(
        "landRegister",
        data.docDeung,
        data.docDeung.name ?? "landRegister"
      );
    }
    if (data.docToji instanceof File || data.docToji instanceof Blob) {
      fd.append(
        "landCadastre",
        data.docToji,
        data.docToji.name ?? "landCadastre"
      );
    }
    if (data.docNong instanceof File || data.docNong instanceof Blob) {
      fd.append(
        "landCertification",
        data.docNong,
        data.docNong.name ?? "landCertification"
      );
    }
    if (Array.isArray(data.photos)) {
      const first = data.photos.find(
        (f) => f instanceof File || f instanceof Blob
      );
      if (first) {
        fd.append("landImage", first, first.name ?? "landImage");
      }
    }

    // 디버그: FormData entries
    console.group("📦 업로드 FormData entries");
    for (let [key, value] of fd.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: [File] name=${value.name}, type=${value.type}, size=${value.size}B`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.groupEnd();

    return fd;
  }

  /* --------------------
     업로드 호출부
  ---------------------*/
  async function uploadToServer(data) {
    // 0) 사전 검증
    const { ok, missing } = validateBeforeUpload(data);
    checkFiles(data);
    if (!ok) {
      throw new Error(`필수 입력 누락: ${missing.join(", ")}`);
    }

    const fd = buildMultipart(data);
    const uploadUrl = `${API_BASE}/${sellerId}/farmland-upload`;
    const token = localStorage.getItem("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    console.group("🌐 업로드 요청 정보");
    dlog("URL:", uploadUrl);
    dlog("Method: POST (multipart/form-data)");
    dlog("Auth token 존재?", Boolean(token));
    if (!token)
      dwarn(
        "⚠️ Authorization 헤더 없음. 인증 필요한 엔드포인트면 401/403 발생 가능."
      );
    dlog(
      "CORS 주의: 백엔드에서 Access-Control-Allow-Origin 설정 필요(프론트 도메인/포트)"
    );
    console.groupEnd();

    // 1) 타임아웃/중단 컨트롤러
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort("요청 타임아웃(15s)");
    }, 15000);

    try {
      const started = performance.now();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: fd,
        signal: controller.signal,
      });
      const elapsed = (performance.now() - started).toFixed(0);
      dlog(`⏱️ fetch 완료 in ${elapsed}ms, status=${res.status}`);

      // 2) 상태/헤더 로그
      console.group("📬 응답 헤더");
      console.table(Object.fromEntries(res.headers.entries()));
      console.groupEnd();

      // 3) 실패시 상세 바디 로그
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        derr("🔎 서버 에러 바디:", text?.slice(0, 500));
        throw new Error(`업로드 실패(${res.status}) ${res.statusText} ${text}`);
      }

      // 4) JSON/Passthru
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json().catch((e) => {
          dwarn("JSON 파싱 실패, text로 대체:", e);
          return null;
        });
        dlog("✅ 서버 응답(JSON):", json);
        return json ?? {};
      } else {
        const text = await res.text().catch(() => "");
        dwarn(
          "서버가 JSON이 아닌 응답을 반환:",
          contentType,
          text?.slice(0, 200)
        );
        return { raw: text };
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  /* --------------------
     제출 핸들러
  ---------------------*/
  const handleSubmit = async () => {
    if (isSubmitting) return;
    console.group("📝 제출 시작");
    console.log("현재 step:", step);
    console.log("현재 formData:", formData);
    console.groupEnd();

    try {
      setIsSubmitting(true);
      if (onSubmit) onSubmit(formData);

      const resp = await uploadToServer(formData);
      dlog("🎯 업로드 최종 결과:", resp);

      alert("등록이 완료되었습니다!");
      navigate("/SeniorMain");
    } catch (err) {
      derr("❌ 업로드 중 오류:", err);
      if (String(err?.message || "").includes("CORS")) {
        dwarn(
          "CORS 관련 오류처럼 보이면 백엔드의 CORS 설정(Origin/Methods/Headers) 확인 필요."
        );
      }
      alert(err?.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 전역 미처리 에러/리젝션 로그(디버그에 도움)
  useEffect(() => {
    const onRejection = (e) =>
      dwarn("💥 Unhandled promise rejection:", e.reason || e);
    const onError = (e) => dwarn("💥 Window error:", e.message || e);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return (
    <div className="FarmlandRegistration-Wrapper">
      <FloatingEmojis />
      <button
        className="SeniorProfile-BackButton"
        onClick={() => navigate("/SeniorMain")}
        disabled={isSubmitting}
      >
        ⬅ 홈으로
      </button>

      <main className="FarmlandRegistration-FlowContainer">
        <div className="FarmlandRegistration-Progress">Step {step} / 7</div>

        {step === 1 && (
          <Step1_Location
            data={formData}
            updateData={updateData}
            onNext={next}
          />
        )}
        {step === 2 && (
          <Step2_Crop
            data={formData}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <Step3_LandDetail
            data={formData}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <Step4_Facility
            data={formData}
            updateData={updateData}
            updateArray={updateArray}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 5 && (
          <Step5_Access
            data={formData}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 6 && (
          <Step6_Review
            data={formData}
            onNext={() => setStep(7)}
            onBack={back}
          />
        )}
        {step === 7 && (
          <Step7_TradeDocs
            data={formData}
            updateData={updateData}
            onBack={() => setStep(6)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </main>

      <aside className="FarmlandRegistration-Summary">
        <div className="FarmlandRegistration-inputSumTitle">입력 정보 요약</div>

        <div className="FarmlandRegistration-SummaryGrid">
          <div>🌾 농지명: {formData.landName || "미입력"}</div>
          <div>📍 행정주소: {formData.address || "미입력"}</div>
          <div>🚏 도로명 주소: {formData.roadAddress || "미입력"}</div>
          <div>🏷️ 지번: {formData.landNumber || "미입력"}</div>
          <div>
            📍 위도/경도: {formData.lat || "?"}, {formData.lng || "?"}
          </div>

          <div className="divider"></div>

          <div>🌾 작물: {formData.crop || "미입력"}</div>
          <div>
            📐 면적: {formData.areaSquare || "?"}㎡ /{" "}
            {formData.areaHectare || "?"}ha
          </div>

          <div className="divider"></div>

          <div>🧱 토양: {formData.soilType || "미입력"}</div>
          <div>💧 용수: {formData.waterSource || "미입력"}</div>
          <div>
            👤 소유자: {formData.owner || "미입력"} ({formData.ownerAge || "?"}
            세)
          </div>
          <div>🏠 거주지: {formData.home || "미입력"}</div>

          <div className="divider"></div>

          <div>🚿 농업용수: {formData.hasWater || "미입력"}</div>
          <div>⚡ 전기: {formData.hasElectricity || "미입력"}</div>
          <div>🚜 농기계 접근: {formData.machineAccess || "미입력"}</div>
          <div>🏚️ 창고: {formData.hasWarehouse || "미입력"}</div>
          <div>🌿 비닐하우스: {formData.hasGreenhouse || "미입력"}</div>
          <div>🚧 울타리: {formData.hasFence || "미입력"}</div>

          <div className="divider"></div>

          <div>🛣️ 도로 인접: {formData.nearRoad || "미입력"}</div>
          <div>🧱 포장도로: {formData.pavedRoad || "미입력"}</div>
          <div>🚌 대중교통: {formData.publicTransit || "미입력"}</div>
          <div>🚗 차량 진입: {formData.carAccess || "미입력"}</div>

          <div className="divider"></div>

          <div>📄 거래 형태: {formData.tradeType || "미입력"}</div>
          <div>🔍 우선 매칭: {formData.preferMatch || "미입력"}</div>
          <div>💰 희망 금액: {formData.wishPrice || "미입력"}</div>
          <div>📅 매도 희망 시기: {formData.wishWhen || "미입력"}</div>
          <div>📝 등록 사유: {formData.reason || "미입력"}</div>
          <div>💬 어르신 한마디: {formData.comment || "미입력"}</div>
        </div>
      </aside>
    </div>
  );
}

export default SeniorFlow;
