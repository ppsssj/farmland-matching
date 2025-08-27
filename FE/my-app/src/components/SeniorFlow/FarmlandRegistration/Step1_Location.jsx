import { useEffect } from "react";

function Step1_Location({ data, updateData, onNext }) {
  const canNext = data.address && data.landNumber;

  // 공통 주소 → 좌표 + 기타 정보 추출 함수
  const resolveAddress = (query, sourceType) => {
    if (query.length < 5) return;

    fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        const info = result.documents?.[0];
        if (info) {
          const road = info.road_address?.address_name || "";
          const jibun = info.address?.address_name || "";
          const lat = info.y;
          const lng = info.x;

          // 어떤 입력이 변경됐는지에 따라 갱신 기준 분리
          if (sourceType === "address") {
            updateData("roadAddress", road);
          } else if (sourceType === "roadAddress") {
            updateData("address", jibun);
          }

          updateData("lat", lat);
          updateData("lng", lng);
        }
      })
      .catch((err) => console.error("주소 검색 실패:", err));
  };

  // 행정주소 입력 시
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (data.address) resolveAddress(data.address, "address");
    }, 600);
    return () => clearTimeout(timeout);
  }, [data.address]);

  // 도로명주소 입력 시
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (data.roadAddress) resolveAddress(data.roadAddress, "roadAddress");
    }, 600);
    return () => clearTimeout(timeout);
  }, [data.roadAddress]);

  return (
    <div className="FarmlandRegistration-Step">
      <h2>Step 1. 농지 정보를 알려주세요</h2>
      <label>농지명</label>
      <input
        className="FarmlandRegistration-InputField"
        placeholder="예: 충남 1구 농지"
        value={data.landName}
        onChange={(e) => updateData("landName", e.target.value)}
      />

      <label>행정주소</label>
      <input
        className="FarmlandRegistration-InputField"
        placeholder="예: 충남 아산시 신창면"
        value={data.address}
        onChange={(e) => updateData("address", e.target.value)}
      />

      <label>도로명 주소</label>
      <input
        className="FarmlandRegistration-InputField"
        placeholder="예: 충남 아산시 신창면 OO로 12"
        value={data.roadAddress}
        onChange={(e) => updateData("roadAddress", e.target.value)}
      />

      <label>지번</label>
      <input
        className="FarmlandRegistration-InputField"
        placeholder="예: 631-4"
        value={data.landNumber}
        onChange={(e) => updateData("landNumber", e.target.value)}
      />

      <div className="FarmlandRegistration-Row">
        <div className="FarmlandRegistration-Col">
          <label>위도 (자동 입력)</label>
          <input
            className="FarmlandRegistration-InputField"
            placeholder="36.733462"
            value={data.lat || ""}
            readOnly
          />
        </div>
        <div className="FarmlandRegistration-Col">
          <label>경도 (자동 입력)</label>
          <input
            className="FarmlandRegistration-InputField"
            placeholder="126.961405"
            value={data.lng || ""}
            readOnly
          />
        </div>
      </div>

      <button
        className="FarmlandRegistration-NextButton"
        disabled={!canNext}
        onClick={onNext}
      >
        다음
      </button>
    </div>
  );
}

export default Step1_Location;
