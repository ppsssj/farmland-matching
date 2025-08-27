// src/components/Setting/SettingContent/FarmlandMatchingSetting/Sell.jsx
import React, { useEffect, useState } from "react";
import "./Sell.css";
import API_BASE from "../../../../config/apiBase"; // 공통 API_BASE
import FarmlandDetailView from "./FarmlandDetailView";

const BUYER_ID_DEFAULT = 1;

export default function Sell({ buyerId = BUYER_ID_DEFAULT }) {
  const [farmlands, setFarmlands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFarm, setSelectedFarm] = useState(null); // 상세보기용
  const [loadingCancel, setLoadingCancel] = useState(false);

  const itemsPerPage = 2;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/applied-farmland/1`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFarmlands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[Sell] 불러오기 실패:", err);
        setFarmlands([]);
      }
    })();
  }, []);

  const openDetail = (farm) => {
    // 최소 요구사항: FarmlandDetailView를 호출하기만 함
    // (데이터 연동은 FarmlandDetailView 안에서 처리)
    setSelectedFarm(farm);

    const el = document.querySelector(".SettingModal-SettingsDetailArea");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusLabel = (status) => {
    if (status === "IN_PROGRESS") return "매칭 성공";
    if (status === "REJECTED") return "매칭 실패";
    if (status === "WAITING") return "매칭 대기";
    return "알 수 없음";
  };

  const totalPages = Math.max(1, Math.ceil(farmlands.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFarmlands = farmlands.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const cancelMatch = async (farm) => {
    if (!window.confirm("정말 매칭을 취소하시겠습니까?")) return;
    try {
      setLoadingCancel(true);
      const url = `${API_BASE}/farmland/${encodeURIComponent(
        farm.landId
      )}/${encodeURIComponent(buyerId)}/apply-cancel`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setFarmlands((prev) => prev.filter((f) => f.landId !== farm.landId));
      alert("매칭이 취소되었습니다.");
    } catch (err) {
      console.error("[Sell] 매칭 취소 실패:", err);
      alert("매칭 취소 중 오류가 발생했습니다.");
    } finally {
      setLoadingCancel(false);
    }
  };

  // ✅ 상세보기 모드: FarmlandDetailView만 호출
  if (selectedFarm) {
    return (
      <FarmlandDetailView
        landId={selectedFarm.landId} // ← 여기서 landId 등 필요한 최소 정보만 넘겨도 됨
        prefetched={selectedFarm} // ← 선택된 농장 데이터
        onClose={() => setSelectedFarm(null)}
      />
    );
  }

  return (
    <div className="Sell-container">
      <div className="Sell-wrapper">
        {currentFarmlands.map((farm) => {
          const canChat = farm.matchStatus === "IN_PROGRESS";

          return (
            <div key={farm.landId} className="Sell-card">
              <img
                src={
                  farm.landImage
                    ? farm.landImage
                    : `/images/farm${(farm.landId % 5) + 1}.jpg`
                }
                alt="farm"
                className="Sell-farm-image"
              />

              <div className="Sell-info-row wide">
                <label>농장명</label>
                <span>{farm.landName}</span>
                <label>주소</label>
                <span>{farm.landAddress || farm.landArress || "-"}</span>
              </div>

              <div className="Sell-info-row horizontal">
                <div>
                  <label>작물</label>
                  <span>{farm.landCrop}</span>
                </div>
                <div>
                  <label>등록일</label>
                  <span>{farm.landRegisterDate || "미상"}</span>
                </div>
              </div>

              <div className="Sell-info-row horizontal">
                <div>
                  <label>매칭 상태</label>
                  <span>{statusLabel(farm.matchStatus)}</span>
                </div>
                <div>
                  <label>예상 수익</label>
                  <span>{"계산 중"}</span>
                </div>
              </div>

              <div className="Sell-btn-group">
                <button
                  className="Sell-btn detail"
                  onClick={() => openDetail(farm)}
                >
                  상세 보기
                </button>

                <button
                  className={`Sell-btn chat ${canChat ? "on" : "off"}`}
                  disabled={!canChat}
                  aria-disabled={!canChat}
                  onClick={() => {
                    if (!canChat) return;
                    alert(`[채팅] ${farm.landName} 과(와) 채팅을 시작합니다.`);
                  }}
                >
                  채팅
                </button>

                <button
                  className="Sell-btn reject"
                  disabled={loadingCancel}
                  onClick={() => cancelMatch(farm)}
                >
                  {loadingCancel ? "취소 중..." : "취소"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="Sell-controls">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>{` ${currentPage} / ${totalPages} `}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
}
