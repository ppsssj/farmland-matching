import React, { useState } from "react";
import "./Star.css";

const Star = () => {
  const users = [
    {
      image: "/images/farm1.jpg",
      address: "충청남도 아산시 어쩌고 저쩌고",
      crop: "배",
      date: "2025-07-19",
      status: "대기 중",
      profit: "500만 원",
    },
    {
      image: "/images/farm2.jpg",
      address: "충청남도 아산시 어쩌고 저쩌고",
      crop: "배",
      date: "2025-07-01",
      status: "매칭 실패",
      profit: "모름",
    },
    {
      image: "/images/farm3.jpg",
      address: "충청남도 아산시 어쩌고 저쩌고",
      crop: "사과",
      date: "2025-05-07",
      status: "매칭 성공",
      profit: "800만 원",
    },
  ];

  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="Star-container">
      <div className="Star-wrapper">
        {currentUsers.map((user, index) => (
          <div key={index} className="Star-card">
            <img
              src={user.image}
              alt="farm"
              className="Star-farm-image"
            />
            <div className="Star-info-row wide">
              <label>주소</label>
              <span>{user.address}</span>
            </div>
            <div className="Star-info-row horizontal">
              <div>
                <label>작물</label>
                <span>{user.crop}</span>
              </div>
              <div>
                <label>등록일</label>
                <span>{user.date}</span>
              </div>
            </div>
            <div className="Star-info-row horizontal">
              <div>
                <label>매칭 상태</label>
                <span>{user.status}</span>
              </div>
              <div>
                <label>예상 수익</label>
                <span>{user.profit}</span>
              </div>
            </div>

            <div className="Star-btn-group" >
              <button className="Star-btn detail">
                상세 보기
              </button>
              <button className="Star-btn match">
                수락
              </button>
              <button className="Star-btn reject">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        className="Star-controls">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>{`${currentPage} / ${totalPages}`}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Star;
