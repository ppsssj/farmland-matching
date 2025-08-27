function Step4_Facility({ data, updateData, onNext, onBack }) {
  // 필수값: 물, 전기, 농기계 접근, 창고, 비닐하우스, 울타리
  const canNext =
    data.hasWater !== "" &&
    data.hasElectricity !== "" &&
    data.machineAccess !== "" &&
    (data.hasWarehouse ?? "") !== "" &&
    (data.hasGreenhouse ?? "") !== "" &&
    (data.hasFence ?? "") !== "";

  // 기존에 facilities 배열(예: ["창고","울타리"])을 쓰던 경우 초기 매핑(옵션)
  // const initialHas = (name) =>
  //   (data[name] ?? ((data.facilities || []).includes(
  //     name === "hasWarehouse" ? "창고" : name === "hasGreenhouse" ? "비닐하우스" : "울타리"
  //   ) ? "있음" : ""));

  return (
    <div className="FarmlandRegistration-Step">
      <h2>Step 4. 기반시설</h2>

      <label>농업용수</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.hasWater ?? ""}
        onChange={(e) => updateData("hasWater", e.target.value)}
      >
        <option value="">선택</option>
        <option value="있음">있음</option>
        <option value="없음">없음</option>
      </select>

      <label>전기</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.hasElectricity ?? ""}
        onChange={(e) => updateData("hasElectricity", e.target.value)}
      >
        <option value="">선택</option>
        <option value="있음">있음</option>
        <option value="없음">없음</option>
      </select>

      <label>농기계 접근</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.machineAccess ?? ""}
        onChange={(e) => updateData("machineAccess", e.target.value)}
      >
        <option value="">선택</option>
        <option value="가능">가능</option>
        <option value="불가">불가</option>
      </select>

      {/* 새 드롭다운 3개 */}
      <label>창고</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.hasWarehouse ?? ""}
        onChange={(e) => updateData("hasWarehouse", e.target.value)}
      >
        <option value="">선택</option>
        <option value="있음">있음</option>
        <option value="없음">없음</option>
      </select>

      <label>비닐하우스</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.hasGreenhouse ?? ""}
        onChange={(e) => updateData("hasGreenhouse", e.target.value)}
      >
        <option value="">선택</option>
        <option value="있음">있음</option>
        <option value="없음">없음</option>
      </select>

      <label>울타리</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.hasFence ?? ""}
        onChange={(e) => updateData("hasFence", e.target.value)}
      >
        <option value="">선택</option>
        <option value="있음">있음</option>
        <option value="없음">없음</option>
      </select>

      <div className="FarmlandRegistration-ButtonGroup">
        <div className="FarmlandRegistration-Button" onClick={onBack}>
          이전
        </div>
        <div
          className={`FarmlandRegistration-Button ${!canNext ? "disabled" : ""}`}
          onClick={canNext ? onNext : undefined}
        >
          다음
        </div>
      </div>
    </div>
  );
}

export default Step4_Facility;
