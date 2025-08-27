// src/components/LeftPanel.jsx
import { useMemo, useState } from "react";
import "./LeftPanel.css";
// 경로는 프로젝트 구조에 맞게 수정하세요 (예: "../../api/farmland")
import { inferEmojiFromCrop } from "../../api/farmland";

function LeftPanel({
  farmlands,
  onSelect,
  // AI 관련 prop
  onAiRecommend = () => {},
  onExitAiMode = () => {},
  aiMode = false,
  aiLoading = false,
  loading = false,
}) {
  // 기본 필터 키를 백엔드 키로 통일
  const [searchText, setSearchText] = useState("");
  const [filterKey, setFilterKey] = useState("landAddress");

  console.log("[LeftPanel] props:", {
    aiMode,
    aiLoading,
    loading,
    farmlandsCount: farmlands?.length,
  });

  // 백엔드 키 그대로 사용
  const filterOptions = ["landAddress", "landCrop", "landArea", "landPrice"];

  // 필터링 (문자열: 포함검색 / 숫자: 입력값 이상)
  const filteredFarmlands = useMemo(() => {
    const txt = String(searchText ?? "").toLowerCase();
    const list = (farmlands || []).filter((farm) => {
      const value = farm?.[filterKey];

      if (filterKey === "landArea" || filterKey === "landPrice") {
        const num = parseInt(txt, 10);
        // 숫자 아님 → 전체 허용, 숫자면 해당 값 이상만
        return Number.isNaN(num) || Number(value) >= num;
      }

      return String(value ?? "").toLowerCase().includes(txt);
    });

    console.log(
      "[LeftPanel] filterKey:",
      filterKey,
      "검색어:",
      txt,
      "필터링 후:",
      list.length
    );
    return list;
  }, [farmlands, filterKey, searchText]);

  return (
    <div className="LeftPanel-LeftContainer">
      {/* 검색/필터 헤더 */}
      <div className="LeftPanel-LeftHeader">
        <input
          className="LeftPanel-SearchInput"
          placeholder={
            filterKey === "landAddress"
              ? "주소 검색"
              : filterKey === "landCrop"
              ? "작물 검색"
              : filterKey === "landArea"
              ? "면적(이상) 입력"
              : filterKey === "landPrice"
              ? "가격(이상) 입력"
              : "검색"
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={loading || aiLoading}
        />

        <div className="LeftPanel-FilterBar">
          {filterOptions.map((key) => (
            <button
              key={key}
              className={`LeftPanel-FilterButton ${
                filterKey === key ? "active" : ""
              }`}
              onClick={() => {
                console.log("[LeftPanel] 필터 변경:", key);
                setFilterKey(key);
                setSearchText(""); // 필터 바꾸면 검색 초기화
              }}
              disabled={loading || aiLoading}
            >
              {key === "landAddress"
                ? "주소"
                : key === "landCrop"
                ? "작물"
                : key === "landArea"
                ? "면적"
                : key === "landPrice"
                ? "가격"
                : key}
            </button>
          ))}

          {/* AI 실행 / 해제 버튼 */}
          {!aiMode ? (
            <button
              className={`LeftPanel-FilterButton ${
                aiLoading ? "disabled" : "ai"
              }`}
              onClick={() => {
                console.log("[LeftPanel] AI 버튼 클릭");
                onAiRecommend();
              }}
              disabled={aiLoading || loading}
              title="AI 추천 실행"
            >
              {aiLoading ? "AI 계산중..." : "AI"}
            </button>
          ) : (
            <button
              className="LeftPanel-FilterButton active"
              onClick={() => {
                console.log("[LeftPanel] AI 추천 끄기 클릭");
                onExitAiMode();
              }}
              disabled={aiLoading || loading}
              title="AI 추천 끄기"
            >
              AI 추천 끄기
            </button>
          )}
        </div>
      </div>

      {/* 농지 목록 */}
      <div className="LeftPanel-FarmlandList">
        {filteredFarmlands.map((farm, idx) => {
          // 원본 BE 객체 그대로 로그
          console.log("[LeftPanel] farmland 객체:", farm);

          // 렌더에 쓰는 키들도 BE 키로 통일
          console.log("[LeftPanel] render farmland:", {
            landId: farm?.landId,
            landName: farm?.landName,
            landCrop: farm?.landCrop,
            landAddress: farm?.landAddress,
            landPrice: farm?.landPrice,
            aiMatchScore: farm?.aiMatchScore,
          });

          const emoji = inferEmojiFromCrop
            ? inferEmojiFromCrop(farm?.landCrop)
            : "🌱";

          const priceText =
            typeof farm?.landPrice === "number"
              ? farm.landPrice.toLocaleString()
              : String(farm?.landPrice ?? "-");

          return (
            <div
              key={farm?.landId ?? `${farm?.landName ?? "land"}-${idx}`}
              className="LeftPanel-FarmlandCard"
              onClick={() => {
                console.log("[LeftPanel] 선택 farmland:", farm);
                onSelect?.(farm); // BE 객체 그대로 전달
              }}
            >
              <div className="LeftPanel-FarmlandImage">{emoji}</div>

              <div className="LeftPanel-FarmlandContent">
                <div className="LeftPanel-FarmlandTitle">
                  <div className="LeftPanel-FarmlandTag">
                    {farm?.landCrop ?? "작물 미입력"}
                  </div>
                  <div className="LeftPanel-Left-FarmlandName">
                    {farm?.landName ?? "-"}
                  </div>
                </div>

                <div className="LeftPanel-FarmlandMeta">
                  📍 {farm?.landAddress ?? "-"}
                  <br />
                  📐 {farm?.landArea ?? "-"}㎡ / 💰 {priceText}만원
                </div>
              </div>

              {/* ➤ 기본 화살표 + (AI모드일 때 점수/순위 뱃지) */}
              <div className="LeftPanel-FarmlandArrow">
                {aiMode ? (
                  farm?.aiMatchScore != null ? (
                    <div
                      className="LeftPanel-AIScoreBadge"
                      title="AI 추천 점수"
                    >
                      <div className="rank">#{idx + 1}</div>
                      <div className="score">{farm.aiMatchScore}</div>
                    </div>
                  ) : (
                    "➤"
                  )
                ) : (
                  "➤"
                )}
              </div>
            </div>
          );
        })}

        {/* 빈 상태 */}
        {filteredFarmlands.length === 0 && (
          <div className="LeftPanel-Empty">
            {aiMode
              ? "AI 추천 대상 농지가 없습니다. (aiMatchScore 없음)"
              : "조건에 맞는 농지가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftPanel;
