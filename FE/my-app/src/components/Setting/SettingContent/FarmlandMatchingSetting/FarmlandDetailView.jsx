// src/components/Setting/SettingContent/FarmlandMatchingSetting/FarmlandDetailView.jsx
import React, { useEffect, useState } from "react";
import "./FarmlandDetailView.css";
import API_BASE from "../../../../config/apiBase";

// Panel과 동일한 Boolean → 라벨 변환
function labelForBoolean(field, value) {
  if (value === null || value === undefined) return "미입력";
  if (typeof value === "string") return value;
  switch (field) {
    case "landWater":
    case "landElec":
    case "landStorage":
    case "landHouse":
    case "landFence":
    case "landWellRoad":
      return value ? "있음" : "없음";
    case "landMachine":
    case "landCar":
      return value ? "가능" : "불가";
    case "landRoad":
    case "landBus":
      return value ? "인접" : "비인접";
    default:
      return String(value);
  }
}

function formatArea(area) {
  if (area == null || isNaN(area)) return "-";
  const ha = (area / 10000).toFixed(2);
  return `${Number(area).toLocaleString()} ㎡ (${ha} ha)`;
}
function formatCoord(x) {
  if (x == null || isNaN(x)) return "-";
  return String(Number(x).toFixed(6));
}

export default function FarmlandDetailView({
  landId,                         // ✅ Sell.jsx에서 전달
  apiBase = `${API_BASE}/farmland-detail`, // ✅ 기본값을 공용 API_BASE로
  prefetched = null,              // ✅ 선택: 카드의 선행 데이터
  onClose,
}) {
  const [raw, setRaw] = useState(prefetched);
  const [loading, setLoading] = useState(!prefetched);
  const [error, setError] = useState(null);

  // ESC 닫기
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // landId로 상세 조회
  useEffect(() => {
    if (!landId) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/${encodeURIComponent(landId)}`, {
          headers: { Accept: "application/json" },
        });

        // ✅ 204 No Content 대응 (AI 미추천 등)
        if (res.status === 204) {
          if (alive) setRaw(null);
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setRaw(json);
      } catch (e) {
        if (alive) setError(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [landId, apiBase]);

  // Panel과 동일한 우선순위 매핑(원시 → 그룹) 적용
  const landInfo   = raw?.landInfo || {};
  const facilities = raw?.facilities || {};
  const access     = raw?.access || {};
  const trade      = raw?.trade || {};

  const be = {
    landId: raw?.landId ?? landInfo.landId,
    landName: raw?.landName ?? raw?.name,
    landAddress: raw?.landAddress,
    landRoadAddress: raw?.landRoadAddress ?? landInfo.location,
    landNumber: raw?.landNumber ?? landInfo.landNumber,
    landLat: raw?.landLat ?? landInfo.lat,
    landLng: raw?.landLng ?? landInfo.lng,
    landCrop: raw?.landCrop ?? landInfo.crop,
    landArea: raw?.landArea,
    soiltype: raw?.soiltype ?? landInfo.soilType,
    waterSource: raw?.waterSource ?? landInfo.waterSource,

    ownerName: raw?.ownerName,
    ownerAge: raw?.ownerAge,
    ownerAddress: raw?.ownerAddress,

    landWater: raw?.landWater ?? facilities.water,
    landElec: raw?.landElec ?? facilities.elec,
    landMachine: raw?.landMachine ?? facilities.machine,
    landStorage: raw?.landStorage ?? facilities.storage,
    landHouse: raw?.landHouse ?? facilities.house,
    landFence: raw?.landFence ?? facilities.fence,

    landRoad: raw?.landRoad ?? access.road,
    landWellRoad: raw?.landWellRoad ?? access.wellRoad,
    landBus: raw?.landBus ?? access.bus,
    landCar: raw?.landCar ?? access.car,

    landTrade: raw?.landTrade ?? trade.type,
    landMatch: raw?.landMatch ?? trade.match,
    landPrice: raw?.landPrice ?? trade.price,
    landWhen: raw?.landWhen ?? trade.when,
    landWhy: raw?.landWhy ?? trade.why,

    landComent: raw?.landComent ?? raw?.sellerComment,
    landImage: raw?.landImage ?? raw?.image,
  };

  const InfoRow = ({ label, value }) => (
    <div className="FDV-info-row">
      <div className="FDV-info-label">{label}</div>
      <div className="FDV-info-value">{value ?? "-"}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="FarmlandDetailView-container" aria-busy>
        <div className="FarmlandDetailView-topbar">
          <button className="FDV-close" onClick={onClose}>닫기 ✕</button>
        </div>
        <div className="FDV-note">불러오는 중…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="FarmlandDetailView-container" aria-live="assertive">
        <div className="FarmlandDetailView-topbar">
          <button className="FDV-close" onClick={onClose}>닫기 ✕</button>
        </div>
        <div className="FDV-note">오류: {error}</div>
      </div>
    );
  }
  if (!raw) {
    return (
      <div className="FarmlandDetailView-container" aria-readonly>
        <div className="FarmlandDetailView-topbar">
          <button className="FDV-back" onClick={onClose}>← 목록으로</button>
          <div className="FDV-title">상세 정보</div>
          <button className="FDV-close" onClick={onClose}>닫기 ✕</button>
        </div>
        <div className="FDV-note">표시할 상세 정보가 없습니다. (AI 미추천 또는 데이터 없음)</div>
      </div>
    );
  }

  return (
    <div className="FarmlandDetailView-container" aria-readonly>
      <div className="FarmlandDetailView-topbar">
        <button className="FDV-back" onClick={onClose}>← 목록으로</button>
        <div className="FDV-title">
          {be.landName} <span className="FDV-sub">({be.landRoadAddress || be.landAddress || "-"})</span>
        </div>
        <button className="FDV-close" onClick={onClose}>닫기 ✕</button>
      </div>

      <div className="FarmlandDetailView-grid">
        {/* 기본 정보 */}
        <section className="FarmlandDetailView-section">
          <h3>기본 정보</h3>
          <InfoRow label="농지명" value={be.landName} />
          <InfoRow label="도로명 주소" value={be.landRoadAddress} />
          <InfoRow label="지번 주소" value={be.landAddress} />
          <InfoRow label="지번" value={be.landNumber} />
          <InfoRow label="작물" value={be.landCrop} />
          <InfoRow label="면적" value={be.landArea != null ? formatArea(be.landArea) : landInfo.areaHectare} />
          <InfoRow label="토양" value={be.soiltype} />
          <InfoRow label="수자원" value={be.waterSource} />
          <InfoRow label="위도" value={formatCoord(be.landLat)} />
          <InfoRow label="경도" value={formatCoord(be.landLng)} />
        </section>

        {/* 소유자 */}
        <section className="FarmlandDetailView-section">
          <h3>소유자 정보</h3>
          <InfoRow label="성명" value={be.ownerName} />
          <InfoRow label="나이" value={be.ownerAge} />
          <InfoRow label="주소" value={be.ownerAddress} />
          {landInfo.owner && <InfoRow label="표시명" value={landInfo.owner} />}
        </section>

        {/* 설비 */}
        <section className="FarmlandDetailView-section">
          <h3>기반 설비</h3>
          <InfoRow label="용수" value={labelForBoolean("landWater", be.landWater)} />
          <InfoRow label="전기" value={labelForBoolean("landElec", be.landElec)} />
          <InfoRow label="농기계" value={labelForBoolean("landMachine", be.landMachine)} />
          <InfoRow label="창고" value={labelForBoolean("landStorage", be.landStorage)} />
          <InfoRow label="주택" value={labelForBoolean("landHouse", be.landHouse)} />
          <InfoRow label="울타리" value={labelForBoolean("landFence", be.landFence)} />
        </section>

        {/* 접근성 */}
        <section className="FarmlandDetailView-section">
          <h3>접근성</h3>
          <InfoRow label="도로 접함" value={labelForBoolean("landRoad", be.landRoad)} />
          <InfoRow label="진입로 상태" value={labelForBoolean("landWellRoad", be.landWellRoad)} />
          <InfoRow label="대중교통" value={labelForBoolean("landBus", be.landBus)} />
          <InfoRow label="차량 접근" value={labelForBoolean("landCar", be.landCar)} />
        </section>

        {/* 거래 */}
        <section className="FarmlandDetailView-section">
          <h3>거래 정보</h3>
          <InfoRow label="거래 형태" value={be.landTrade} />
          <InfoRow label="매칭 상태" value={be.landMatch} />
          <InfoRow label="가격" value={be.landPrice != null ? `${be.landPrice.toLocaleString()} 원` : "-"} />
          <InfoRow label="가능 시기" value={be.landWhen} />
          <InfoRow label="양도/거래 사유" value={be.landWhy} />
        </section>

        {/* 판매자 멘트 */}
        <section className="FarmlandDetailView-section">
          <h3>판매자 멘트</h3>
          <div className="FDV-note">“{be.landComent || raw?.sellerComment || "판매자 멘트가 없습니다."}”</div>
        </section>
      </div>
    </div>
  );
}
