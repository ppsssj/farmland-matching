import React, { useState } from "react";
import "./SettingModal.css";
import "./Sidebar.css";
function Sidebar({ selected, onMenuSelect }) {
  const [search, setSearch] = useState("");
  // 메뉴 항목과 섹션 정보
  // 각 항목은 label과 section으로 구성
  const menuItems = [
    { label: "내 프로필", section: "계정" },
    { label: "로그인 및 보안", section: "계정" },
    { label: "알림 설정", section: "계정" },
    { label: "신청한 매칭 내역", section: "농지 및 매칭" },
    { label: "관심 농지 목록", section: "농지 및 매칭" },
    { label: "신뢰 프로필 관리", section: "신뢰 관리" },
    { label: "자격증 업로드", section: "신뢰 관리" },
    { label: "추천인/보증인 등록", section: "신뢰 관리" },
    { label: "나의 신뢰 레벨 확인", section: "신뢰 관리" },
    // 여기에 다른 항목들도 필요시 추가
  ];

  // 검색어에 따라 필터링
  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // 섹션 기준으로 그룹화
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="Sidebar">
      <input
        type="text"
        placeholder="검색"
        className="SidebarSearch"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(groupedItems).map(([section, items], index) => (
        <div key={section}>
          <div className="SidebarSectionTitle">{section}</div>
          <ul className="SidebarSection">
            {items.map((item, idx) => (
              <li
                key={idx}
                className={`SidebarItem ${selected === item.label ? "active" : ""}`}
                onClick={() => onMenuSelect(item.label)}
              >
                {item.label}
              </li>
            ))}
          </ul>
          {index < Object.entries(groupedItems).length - 1 && <hr className="SidebarDivider" />}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;

