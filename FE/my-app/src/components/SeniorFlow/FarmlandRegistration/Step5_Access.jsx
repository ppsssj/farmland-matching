
function Step5_Access({ data, updateData, onNext, onBack }) {
  const canNext = data.nearRoad !== "" && data.pavedRoad !== "" && data.publicTransit !== "" && data.carAccess !== "";

  return (
    <div className="FarmlandRegistration-Step">
      <h2>Step 5. 접근성</h2>

      <label>도로 인접</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.nearRoad}
        onChange={(e) => updateData("nearRoad", e.target.value)}
      >
        <option value="">선택</option>
        <option value="인접">인접</option>
        <option value="비인접">비인접</option>
      </select>

      <label>포장도로</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.pavedRoad}
        onChange={(e) => updateData("pavedRoad", e.target.value)}
      >
        <option value="">선택</option>
        <option value="있음">있음</option>
        <option value="없음">없음</option>
      </select>

      <label>대중교통 접근성</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.publicTransit}
        onChange={(e) => updateData("publicTransit", e.target.value)}
      >
        <option value="">선택</option>
        <option value="인접">인접</option>
        <option value="비인접">비인접</option>
      </select>

      <label>차량 진입</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.carAccess}
        onChange={(e) => updateData("carAccess", e.target.value)}
      >
        <option value="">선택</option>
        <option value="가능">가능</option>
        <option value="불가">불가</option>
      </select>

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

export default Step5_Access;
