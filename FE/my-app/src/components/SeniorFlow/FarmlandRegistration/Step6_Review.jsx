function Step6_Review({ data, onNext, onBack }) {
  return (
    <div className="FarmlandRegistration-Step">
      <h2>지금까지 입력한 농지 정보를 확인해주세요</h2>

      <div className="FarmlandRegistration-ReviewGroup">
        <h3>📍 위치</h3>
        <p>행정주소: {data.address}</p>
        <p>도로명 주소: {data.roadAddress}</p>
        <p>지번: {data.landNumber}</p>
        <p>
          위도/경도: {data.lat}, {data.lng}
        </p>

        <h3>🌾 재배 작물 & 면적</h3>
        <p>작물: {data.crop}</p>
        <p>
          면적: {data.areaSquare}㎡ / {data.areaHectare}ha
        </p>

        <h3>🧱 토지 상세</h3>
        <p>토양 형태: {data.soilType}</p>
        <p>용수 접근성: {data.waterSource}</p>
        <p>
          소유자: {data.owner} ({data.ownerAge}세)
        </p>
        <p>거주지: {data.home}</p>
        <p>등록일: {data.registerDate}</p>

        <h3>🏕️ 기반 시설</h3>
        <p>농업용수: {data.hasWater}</p>
        <p>전기: {data.hasElectricity}</p>
        <p>농기계 접근: {data.machineAccess}</p>
        <p>기타 시설: {(data.facilities || []).join(", ")}</p>

        <h3>🚗 접근성</h3>
        <p>도로 인접: {data.nearRoad}</p>
        <p>포장도로: {data.pavedRoad}</p>
        <p>대중교통: {data.publicTransit}</p>
        <p>차량 진입: {data.carAccess}</p>
      </div>

      <div className="FarmlandRegistration-ButtonGroup">
        <div className="FarmlandRegistration-Button" onClick={onBack}>
          이전
        </div>
        <div className="FarmlandRegistration-Button" onClick={onNext}>
          다음
        </div>
      </div>
    </div>
  );
}

export default Step6_Review;
