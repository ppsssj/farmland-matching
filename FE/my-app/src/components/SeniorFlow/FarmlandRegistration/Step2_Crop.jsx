// src/components/FarmlandRegistration/Step2_Crop.jsx
import React from "react";
import "./FarmlandRegistration.css";

export default function Step2_Crop({ data, updateData, onNext, onBack }) {
  const handleAreaSquare = (v) => {
    updateData("areaSquare", v);
    const num = parseFloat(v);
    if (!isNaN(num)) {
      updateData("areaHectare", (num / 10000).toFixed(4));
    } else {
      updateData("areaHectare", "");
    }
  };

  const handleCropInput = (e) => {
    // 앞뒤 공백 제거
    const v = e.target.value.replace(/^\s+|\s+$/g, "");
    updateData("crop", v);
  };

  const canNext = !!data.crop && !!data.areaSquare;

  return (
    <div className="FarmlandRegistration-Step">
      <h2>Step 2. 최근 재배 작물과 면적</h2>

      {/* ✅ 작물 입력: 자유롭게 텍스트로 입력 */}
      <label htmlFor="cropInput">재배 작물</label>
      <input
        id="cropInput"
        type="text"
        className="FarmlandRegistration-InputField"
        placeholder="예: 상추, 깻잎, 오이, 토마토 등"
        value={data.crop || ""}
        onChange={handleCropInput}
        // 선택지 힌트를 주고 싶으면 아래 datalist 주석 해제 + list 속성 추가
        list="cropExamples"
        autoComplete="off"
      />

      {/* (옵션) 입력 힌트용 datalist — 사용자가 자유 입력 가능 */}
      <datalist id="cropExamples">
        <option value="상추" />
        <option value="깻잎" />
        <option value="오이" />
        <option value="토마토" />
        <option value="배추" />
        <option value="파프리카" />
        <option value="고추" />
        <option value="가지" />
        <option value="양파" />
        <option value="마늘" />
      </datalist>

      <label htmlFor="areaSquare">면적 (㎡)</label>
      <input
        id="areaSquare"
        type="number"
        className="FarmlandRegistration-InputField"
        placeholder="예: 1200"
        min="0"
        step="1"
        value={data.areaSquare || ""}
        onChange={(e) => handleAreaSquare(e.target.value)}
      />

      <div className="FarmlandRegistration-Hint">
        변환: {data.areaHectare ? `${data.areaHectare} ha` : "-"}
      </div>

      <div className="FarmlandRegistration-ButtonGroup">
        <div className="FarmlandRegistration-Button" onClick={onBack}>
          이전
        </div>
        <div
          className={`FarmlandRegistration-Button ${
            !canNext ? "disabled" : ""
          }`}
          onClick={canNext ? onNext : undefined}
        >
          다음
        </div>
      </div>
    </div>
  );
}
