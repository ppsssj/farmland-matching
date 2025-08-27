// src/components/Pannel/RightPanel.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import "./RightPanel.css";
import FarmlandDetailPanel from "./FarmlandDetailPanel";
import { applyForFarmland } from "../../api/applications";
import API_BASE from "../../config/apiBase";

const BUYER_ID = 1; // TODO: 로그인 사용자 ID로 교체

function RightPanel({ selected, onClose, onApply, onToggleFavorite, onOpenChat }) {
  // -----------------------------
  // State
  // -----------------------------
  const [pageIndex, setPageIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  const [applying, setApplying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // 상세 데이터
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // 신청 현황
  const [appliedList, setAppliedList] = useState([]); // [{ landId, matchStatus }, ...]
  const [loadingApplied, setLoadingApplied] = useState(false);
  const [appliedError, setAppliedError] = useState(null);

  // ✅ AI 매칭 점수 (BE 연동)
  const [aiAvailable, setAiAvailable] = useState(null);      // true | false | null(로딩 전)
  const [aiMatchScore, setAiMatchScore] = useState(null);    // number
  const [aiScoreDetail, setAiScoreDetail] = useState(null);  // { area, crop, distance, facility } | null
  const [aiError, setAiError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // landId는 selected가 없을 수도 있으니 안전하게 계산
  const landId =
    selected?.id ??
    selected?.landId ??
    selected?.raw?.landId ??
    selected?.detail?.landInfo?.landId;

  // -----------------------------
  // API: 신청 목록 불러오기
  // -----------------------------
  const loadApplied = useCallback(async () => {
    try {
      setLoadingApplied(true);
      setAppliedError(null);

      const url = `${API_BASE}/applied-farmland/${BUYER_ID}`;
      console.log("[RightPanel] loadApplied →", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "(no body)");
        console.error("[RightPanel] loadApplied !ok", res.status, text.slice(0, 300));
        throw new Error(`GET /applied-farmland/${BUYER_ID} -> ${res.status}`);
      }

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("application/json")) {
        const text = await res.text().catch(() => "(no body)");
        console.error("[RightPanel] loadApplied invalid content-type:", ct, text.slice(0, 300));
        throw new Error("Response is not valid JSON");
      }

      const data = await res.json();
      setAppliedList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("[RightPanel] loadApplied error:", e);
      setAppliedError(e?.message || "신청 현황을 불러오지 못했습니다.");
      setAppliedList([]);
    } finally {
      setLoadingApplied(false);
    }
  }, []);

  // 선택 변경 시 신청목록 갱신
  useEffect(() => {
    loadApplied();
  }, [loadApplied, landId]);

  // 현재 선택 농지의 신청/매칭 상태
  const currentApplied = appliedList.find((x) => String(x.landId) === String(landId));
  const currentStatus = currentApplied?.matchStatus; // WAITING | IN_PROGRESS | REJECTED | undefined
  const isApplied = !!currentStatus;

  const statusLabelMap = {
    WAITING: "신청 중..",
    IN_PROGRESS: "매칭 성공",
    REJECTED: "매칭 실패",
  };
  const primaryLabel = isApplied ? statusLabelMap[currentStatus] || "신청 상태" : "신청하기";
  const primaryDisabled = isApplied || applying || !landId;
  const statusClass = currentStatus ? `status-${currentStatus.toLowerCase()}` : "";

  // -----------------------------
  // 선택 변경 시 초기화
  // -----------------------------
  useEffect(() => {
    setPageIndex(0);
    setShowDetail(false);
    setIsFavorite(false);

    // ✅ AI 점수 상태 초기화
    setAiAvailable(null);
    setAiMatchScore(null);
    setAiScoreDetail(null);
    setAiError(null);
    setAiLoading(false);
  }, [selected]);

  // -----------------------------
  // 상세 조회 (landId 없는 경우 내부에서 안전 처리)
  // -----------------------------
  useEffect(() => {
    let aborted = false;

    (async () => {
      if (!landId) {
        setDetail(null);
        return;
      }

      setDetailLoading(true);
      setDetailError(null);
      try {
        const url = `${API_BASE}/farmland-detail/${encodeURIComponent(landId)}`;
        console.log("[RightPanel] detail GET:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "(no body)");
          console.error("[RightPanel] detail !ok", res.status, text.slice(0, 300));
          throw new Error(`GET /farmland-detail/${landId} -> ${res.status}`);
        }

        const ct = (res.headers.get("content-type") || "").toLowerCase();
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "(no body)");
          console.error("[RightPanel] detail invalid content-type:", ct, text.slice(0, 300));
          throw new Error("Response is not valid JSON");
        }

        const data = await res.json();
        if (aborted) return;

        // 면적 표기(예: 1200 ㎡ + 0.12 ha)
        const areaSqm = typeof data.landArea === "number" ? data.landArea : null;
        const areaHa = areaSqm != null ? (areaSqm / 10000).toFixed(2) : null;
        const areaHectareStr =
          areaSqm != null ? `${areaSqm.toLocaleString()} ㎡ (${areaHa} ha)` : undefined;

        const mapped = {
          name: data.landName ?? selected?.name,
          address: data.landRoadAddress || data.landAddress || selected?.address,
          emoji: selected?.emoji,

          landId: data.landId,
          landName: data.landName,
          landAddress: data.landAddress,
          landRoadAddress: data.landRoadAddress,
          landNumber: data.landNumber,
          landLat: data.landLat,
          landLng: data.landLng,
          landCrop: data.landCrop,
          landArea: data.landArea,
          soiltype: data.soiltype,
          waterSource: data.waterSource,

          ownerName: data.ownerName,
          ownerAge: data.ownerAge,
          ownerAddress: data.ownerAddress,

          sellerComment: data.landComent,
          image: data.landImage,

          landInfo: {
            landId: data.landId,
            crop: data.landCrop ?? selected?.detail?.landInfo?.crop,
            areaHectare: areaHectareStr ?? selected?.detail?.landInfo?.areaHectare,
            location:
              data.landRoadAddress ||
              data.landAddress ||
              selected?.detail?.landInfo?.location,
            landNumber: data.landNumber ?? selected?.detail?.landInfo?.landNumber,
            soilType: data.soiltype ?? selected?.detail?.landInfo?.soilType,
            waterSource: data.waterSource ?? selected?.detail?.landInfo?.waterSource,
            owner: data.ownerName
              ? `${data.ownerName}${data.ownerAge != null ? ` (${data.ownerAge})` : ""}`
              : selected?.detail?.landInfo?.owner,
            lat: data.landLat,
            lng: data.landLng,
          },
          facilities: {
            water: data.landWater,
            elec: data.landElec,
            machine: data.landMachine,
            storage: data.landStorage,
            house: data.landHouse,
            fence: data.landFence,
          },
          access: {
            road: data.landRoad,
            wellRoad: data.landWellRoad,
            bus: data.landBus,
            car: data.landCar,
          },
          trade: {
            type: data.landTrade,
            match: data.landMatch,
            price: data.landPrice,
            when: data.landWhen,
            why: data.landWhy,
          },
        };

        setDetail(mapped);
      } catch (err) {
        if (!aborted) {
          console.error("[RightPanel] Fetch detail error:", err);
          setDetailError(err.message || "상세 불러오기 실패");
        }
      } finally {
        if (!aborted) setDetailLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [landId, selected]);

  // -----------------------------
  // ✅ AI 매칭 점수 불러오기
  // -----------------------------
  useEffect(() => {
    let aborted = false;
    (async () => {
      if (!landId) return;

      setAiLoading(true);
      setAiError(null);
      try {
        const url = `${API_BASE}/farmland-detail-matchScore/${encodeURIComponent(
          BUYER_ID
        )}/${encodeURIComponent(landId)}`;
        console.log("[AI SCORE] GET:", url);

        const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });

        // 204: 추천 없음 → pageIndex(1) 제거
        if (res.status === 204) {
          if (!aborted) {
            console.log("[AI SCORE] 204 No Content (추천 없음)");
            setAiAvailable(false);
            setAiMatchScore(null);
            setAiScoreDetail(null);
          }
          return;
        }

        if (!res.ok) throw new Error(`GET matchScore -> ${res.status}`);

        const text = await res.text();
        if (aborted) return;

        // body가 "1"인 경우 추천 없음 처리
        if (text.trim() === "1") {
          console.log("[AI SCORE] body=1 (추천 없음)");
          setAiAvailable(false);
          setAiMatchScore(null);
          setAiScoreDetail(null);
          return;
        }

        // 정상 JSON 응답 파싱
        const data = JSON.parse(text);

        const score = data?.aiMatchScore ?? null;

        let detailObj = null;
        const rawDetail = data?.aiScoreDetail;
        if (rawDetail != null) {
          if (typeof rawDetail === "string") {
            try {
              detailObj = JSON.parse(rawDetail);
            } catch (e) {
              console.warn("[AI SCORE] aiScoreDetail JSON.parse 실패:", rawDetail);
            }
          } else if (typeof rawDetail === "object") {
            detailObj = rawDetail;
          }
        }

        setAiAvailable(true);
        setAiMatchScore(score);
        setAiScoreDetail(detailObj);
      } catch (e) {
        console.error("[AI SCORE] error:", e);
        setAiError(e?.message || "AI 점수를 불러오지 못했습니다.");
        setAiAvailable(false);
        setAiMatchScore(null);
        setAiScoreDetail(null);
      } finally {
        setAiLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [landId]);

  // -----------------------------
  // 채팅 열기 (오버레이)
  // -----------------------------
  const canChat = currentStatus === "IN_PROGRESS" && !!landId;

  const handleOpenChat = () => {
    if (!detail) return;
    const ownerNameRaw =
      detail.ownerName ||
      detail?.landInfo?.owner?.replace(/\s*\([^)]*\)\s*$/, "") ||
      "판매자";
    const ownerName = String(ownerNameRaw).replace(/\s*\([^)]*\)\s*$/, ""); // "홍길동 (70)" → "홍길동"
    const landName = detail.landName || selected?.name || "농지";
    onOpenChat &&
      onOpenChat({
        landId,
        buyerId: BUYER_ID,
        landName,
        ownerName,
      });
  };

  // -----------------------------
  // Handlers
  // -----------------------------
  const isWaiting = currentStatus === "WAITING";

  const handleApply = async () => {
    if (!landId) {
      alert("landId를 확인할 수 없습니다.");
      return;
    }
    if (isApplied || applying) return;

    try {
      setApplying(true);
      const token = localStorage.getItem("accessToken");
      await applyForFarmland({ landId, buyerId: BUYER_ID, token });
      await loadApplied(); // 신청 후 목록 갱신
      onApply && onApply(selected);
      alert("신청이 완료되었습니다.");
    } catch (err) {
      console.error("[APPLY] error:", err);
      alert(err?.message || "신청 처리 중 오류가 발생했습니다.");
    } finally {
      setApplying(false);
    }
  };

  const handleCancelApply = async () => {
    if (!landId) return;
    try {
      const res = await fetch(
        `${API_BASE}/farmland/${encodeURIComponent(landId)}/${encodeURIComponent(
          BUYER_ID
        )}/apply-cancel`,
        { method: "DELETE", headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error(`DELETE apply-cancel -> ${res.status}`);
      await loadApplied();
      alert("신청이 취소되었습니다.");
    } catch (e) {
      console.error("[CANCEL] error:", e);
      alert(e?.message || "신청 취소 중 오류가 발생했습니다.");
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite((v) => !v);
    onToggleFavorite && onToggleFavorite(selected);
  };

  // -----------------------------
  // 뷰 모델
  // -----------------------------
  const view = {
    emoji: selected?.emoji,
    name: detail?.name ?? selected?.name,
    address: detail?.address ?? selected?.address,
    detail: {
      ...(selected?.detail || {}),
      ...(detail || {}),
      landInfo: (detail && detail.landInfo) || selected?.detail?.landInfo,
    },
  };

  // -----------------------------
  // ✅ 사용 가능한 페이지 목록(1번 페이지는 aiAvailable=false면 제외)
  // -----------------------------
  const availablePages = useMemo(() => {
    const pages = [0];
    if (aiAvailable) pages.push(1);             // AI 점수 페이지
    if (view.detail?.aiProfit) pages.push(2);   // 예상 수익
    if (view.detail?.trustMatch) pages.push(3); // 신뢰 매칭
    pages.push(4);                               // 판매자 한마디(항상 표시)
    return pages;
  }, [aiAvailable, view.detail?.aiProfit, view.detail?.trustMatch]);

  // 현재 pageIndex가 사용 불가 상태가 되면 가장 가까운 사용 가능한 페이지로 이동
  useEffect(() => {
    if (!availablePages.includes(pageIndex)) {
      setPageIndex(availablePages[0] ?? 0);
    }
  }, [availablePages, pageIndex]);

  const goPrev = () => {
    const idx = availablePages.indexOf(pageIndex);
    if (idx > 0) setPageIndex(availablePages[idx - 1]);
  };
  const goNext = () => {
    const idx = availablePages.indexOf(pageIndex);
    if (idx >= 0 && idx < availablePages.length - 1) {
      setPageIndex(availablePages[idx + 1]);
    }
  };

  const canGoPrev = availablePages.indexOf(pageIndex) > 0;
  const canGoNext = availablePages.indexOf(pageIndex) < availablePages.length - 1;

  // -----------------------------
  // ✅ 렌더 직전에 selected 체크
  // -----------------------------
  if (!selected) return null;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="RightPanel-RightContainer">
      <div className="RightPanel-TopButtons">
        <button
          onClick={() => setShowDetail(true)}
          className="RightPanel-DetailButton"
          disabled={detailLoading || !!detailError}
          title={
            detailLoading
              ? "상세 불러오는 중…"
              : detailError
              ? "상세를 불러올 수 없습니다."
              : "상세 보기"
          }
        >
          {detailLoading ? "불러오는 중…" : "상세 보기"}
        </button>

        <div className="RightPanel-ActionGroup">
          <button
            className={`RightPanel-PrimaryButton ${statusClass} ${primaryDisabled ? "is-disabled" : ""}`}
            onClick={!isApplied ? handleApply : undefined}
            disabled={primaryDisabled}
            title={
              isApplied
                ? statusLabelMap[currentStatus] || "신청 상태"
                : applying
                ? "신청 처리 중..."
                : "이 농지에 매칭을 신청합니다"
            }
          >
            {applying && !isApplied ? "신청 중..." : primaryLabel}
          </button>

          {currentStatus === "WAITING" && (
            <button
              className="RightPanel-SecondaryButton danger"
              onClick={handleCancelApply}
              title="이 신청을 취소합니다"
            >
              매칭 취소
            </button>
          )}

          <button
            className={`RightPanel-SecondaryButton ${isFavorite ? "active" : ""}`}
            onClick={handleToggleFavorite}
            title="즐겨찾기에 추가/제거"
          >
            {isFavorite ? "즐겨찾기 ✓" : "즐겨찾기 추가"}
          </button>
        </div>

        <button className="RightPanel-CloseButton" onClick={onClose}>
          ✕
        </button>
      </div>

      {loadingApplied && (
        <div className="RightPanel-InfoRow" style={{ opacity: 0.7, marginTop: 8 }}>
          신청 현황을 불러오는 중…
        </div>
      )}
      {appliedError && (
        <div className="RightPanel-InfoRow" style={{ color: "#c00", marginTop: 8 }}>
          {appliedError}
        </div>
      )}

      <div className="RightPanel-ImageContainer">
        {detail?.image ? (
          <img src={detail.image} alt={view.name || "농지 사진"} className="RightPanel-Image" />
        ) : (
          <div className="RightPanel-ImagePlaceholder">사진이 없습니다</div>
        )}
      </div>

      {/* ✅ 페이지 네비게이션: 사용 가능한 페이지 기준으로 이동 */}
      <div className="RightPanel-PageNav">
        {canGoPrev ? (
          <button className="RightPanel-PageButton" onClick={goPrev}>
            ⬅ 이전
          </button>
        ) : (
          <div />
        )}

        {canGoNext ? (
          <div className="RightPanel-PageRightGroup">
            <button className="RightPanel-PageButton" onClick={goNext}>
              다음 ➡
            </button>

            {canChat && (
              <button
                className="RightPanel-PageButton"
                onClick={handleOpenChat}
                title="채팅으로 이동"
                style={{ marginLeft: 8 }}
              >
                💬 채팅
              </button>
            )}
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* 0. 농지 기본 정보 */}
      {pageIndex === 0 && view.detail?.landInfo && (
        <div className="RightPanel-InfoBlock">
          <h3 className="RightPanel-InfoTitle">
            {view.emoji} {view.name}
          </h3>

          <div className="RightPanel-InfoRow">
            <strong>📍 주소:</strong> {view.address}
          </div>

          <div className="RightPanel-InfoRow">
            <strong>🌱 작물:</strong> {view.detail.landInfo.crop}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>📐 면적:</strong> {view.detail.landInfo.areaHectare}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>🗺 위치:</strong> {view.detail.landInfo.location}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>🏷 지번정보:</strong> {view.detail.landInfo.landNumber}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>🧪 토양 유형:</strong> {view.detail.landInfo.soilType}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>💧 수자원:</strong> {view.detail.landInfo.waterSource}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>👩‍🌾 소유자:</strong> {view.detail.landInfo.owner}
          </div>

          {detailLoading && (
            <div className="RightPanel-InfoRow" style={{ opacity: 0.7 }}>
              상세 데이터를 불러오는 중입니다…
            </div>
          )}
          {detailError && (
            <div className="RightPanel-InfoRow" style={{ color: "#c00" }}>
              상세 데이터를 불러오지 못했습니다: {detailError}
            </div>
          )}
        </div>
      )}

      {/* 1. 🔥 AI 매칭 점수 (BE 데이터) */}
      {pageIndex === 1 && aiAvailable && (
        <div className="RightPanel-InfoBlock">
          <h3 className="RightPanel-InfoTitle">🔥 AI 매칭 점수</h3>

          {aiLoading && <div className="RightPanel-InfoRow">AI 점수 불러오는 중…</div>}
          {aiError && <div className="RightPanel-InfoRow" style={{ color: "#c00" }}>{aiError}</div>}

          {!aiLoading && !aiError && (
            <>
              <div className="RightPanel-MatchHeader">
                <div>
                  <div className="RightPanel-MatchScore">{aiMatchScore ?? "미산정"}</div>
                  <div className="RightPanel-MatchLabel">/ 100</div>
                </div>
              </div>

              {/* 세부 산출 근거 */}
              {aiScoreDetail ? (
                <div className="RightPanel-MatchBars">
                  {[
                    { key: "면적(Area)", value: aiScoreDetail.area },
                    { key: "작물 적합도(Crop)", value: aiScoreDetail.crop },
                    { key: "거리(Distance)", value: aiScoreDetail.distance },
                    { key: "시설(Facility)", value: aiScoreDetail.facility },
                  ].map((p) => {
                    const width = Math.max(0, Math.min(100, Number(p.value)));
                    return (
                      <div key={p.key} className="RightPanel-MatchBarItem">
                        <div className="RightPanel-MatchBarTop">
                          <span>{p.key}</span>
                          <span>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</span>
                        </div>
                        <div className="RightPanel-MatchBarTrack">
                          <div className="RightPanel-MatchBarFill" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="RightPanel-InfoRow" style={{ opacity: 0.7 }}>
                  상세 산출 근거가 없습니다.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 2. 🤖 AI 기반 예상 수익 */}
      {pageIndex === 2 && view.detail?.aiProfit && (
        <div className="RightPanel-InfoBlock">
          <h3 className="RightPanel-InfoTitle">🤖 AI 기반 예상 수익</h3>
          <div className="RightPanel-InfoRow">
            <strong>총 예상 수익:</strong> {view.detail.aiProfit.yearlyProfit}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>수확량:</strong> {view.detail.aiProfit.yield}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>작물 단가:</strong> {view.detail.aiProfit.unitPrice}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>비용 분석</strong>
          </div>
          <div className="RightPanel-InfoRow">ㆍ비료 및 자재: {view.detail.aiProfit.cost.material}</div>
          <div className="RightPanel-InfoRow">ㆍ인건비: {view.detail.aiProfit.cost.labor}</div>
          <div className="RightPanel-InfoRow">ㆍ기계·임차비: {view.detail.aiProfit.cost.machine}</div>
          <div className="RightPanel-InfoRow">
            <strong>예상 순수익:</strong> {view.detail.aiProfit.netProfit}
          </div>
        </div>
      )}

      {/* 3. 🤝 신뢰 매칭 현황 */}
      {pageIndex === 3 && view.detail?.trustMatch && (
        <div className="RightPanel-InfoBlock">
          <h3 className="RightPanel-InfoTitle">🤝 신뢰 매칭 현황</h3>
          <div className="RightPanel-InfoRow">
            <strong>현재 매칭 상태:</strong> {view.detail.trustMatch.status}
          </div>
          <div className="RightPanel-InfoRow">
            <strong>매칭 희망 조건:</strong>
          </div>
          <ul>
            {view.detail.trustMatch.preferences.map((pref, idx) => (
              <li key={idx}>ㆍ{pref}</li>
            ))}
          </ul>
          <div className="RightPanel-InfoRow">
            <strong>추천 청년:</strong> {view.detail.trustMatch.waitingYouth}명 대기 중
          </div>
        </div>
      )}

      {/* 4. 👵 판매자 한마디 */}
      {pageIndex === 4 && (
        <div className="RightPanel-InfoBlock">
          <h3 className="RightPanel-InfoTitle">👵 판매자 한마디</h3>
          <blockquote style={{ fontStyle: "italic", color: "#555" }}>
            "{view.detail?.sellerComment || "멘트가 없습니다."}"
          </blockquote>
        </div>
      )}

      {showDetail && (
        <div className="RightPanel-ModalOverlay">
          <FarmlandDetailPanel data={view.detail} onClose={() => setShowDetail(false)} />
        </div>
      )}
    </div>
  );
}

export default RightPanel;
