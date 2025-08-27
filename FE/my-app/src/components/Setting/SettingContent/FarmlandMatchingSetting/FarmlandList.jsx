import React, { useEffect, useState } from "react";
import { getFarmlandData } from "../../../../api/farmland"; // 경로는 프로젝트 구조에 맞게 조정하세요

export default function FarmlandList() {
  const [farmlands, setFarmlands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFarmlandData();
      const firstTwo = data.slice(0, 2); // 상위 2개만 사용
      const formatted = firstTwo.map((land, idx) => ({
        id: land.id,
        image: `/images/farm${idx + 1}.jpg`, // 이미지 경로 (없다면 대체 이미지로)
        address: land.address,
        crop: land.crop,
        area: land.detail.landInfo.areaHectare,
        date: "2025-08-04", // 더미 날짜 (필요시 land.detail.trade?.When 등으로 대체 가능)
      }));
      setFarmlands(formatted);
    };
    fetchData();
  }, []);

  return (
    <div className="FarmlandListWrapper">
      <div className="FarmlandSlider">
        {farmlands.map((land) => (
          <div className="FarmlandCard" key={land.id}>
            <img src={land.image} alt="농지 이미지" className="LandImage" />
            <div className="LandInfo">
              <p>주소: {land.address}</p>
              <p>작물: {land.crop}</p>
              <p>면적: {land.area}</p>
              <p>등록일: {land.date}</p>
            </div>
            <div className="LandButtons">
              <button className="detail">상세 보기</button>
              <button className="edit">수정</button>
              <button className="delete">삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
