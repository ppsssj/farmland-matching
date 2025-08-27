// src/components/Setting/SettingModal.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./SettingModal.css";
import Sidebar from "./Sidebar";
import ProfileSettings from "./SettingContent/AccountSetting/ProfileSettings";
import SecuritySettings from "./SettingContent/AccountSetting/SecuritySettings";
import AlertSettings from "./SettingContent/AccountSetting/AlertSettings";
import Star from "./SettingContent/FarmlandMatchingSetting/Star";
import Sell from "./SettingContent/FarmlandMatchingSetting/Sell";
import RecommenderForm from "./SettingContent/TrustSetting/RecommenderForm";
import TrustScore from "./SettingContent/TrustSetting/TrustScore";

// ✅ 경로/이름 정확히 맞추기
import TrustProfile from "./SettingContent/TrustSetting/TrustProfile";
import Certification from "./SettingContent/TrustSetting/Certification";

import { getYoungUserData, saveYoungUserData } from "../../api/YoungUser";

function SettingsModal({ onClose }) {
  const [selectedMenu, setSelectedMenu] = useState("내 프로필");
  const [youngUser, setYoungUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const overlayRef = useRef(null);

  useEffect(() => {
    (async () => {
      const list = await getYoungUserData();
      setYoungUser(list?.[0] || null);
      setUserLoading(false);
    })();
  }, []);

  // ✅ ESC로 닫기
  const handleKeydown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  // ✅ 오버레이 클릭으로 닫기 (카드 내부 클릭은 무시)
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };
  // 공용 저장 핸들러 (상태 반영 + 영속화)
  const handleUserChange = async (updated) => {
    setYoungUser(updated);
    try {
      await saveYoungUserData(updated);
      console.log("[SettingsModal] user saved");
    } catch (e) {
      console.error("[SettingsModal] save failed", e);
    }
  };
  // 메뉴 정의
  const sections = {
    계정: ["내 프로필", "로그인 및 보안", "알림 설정"],
    "농지 및 매칭": ["신청한 매칭 내역", "관심 농지 목록"],
    "신뢰 관리": [
      "신뢰 프로필 관리", // 관심작물/장비/거래/수상/한마디/자기소개/영상/SNS
      "자격증 업로드", // 자격증만
      "추천인/보증인 등록",
      "나의 신뢰 레벨 확인",
    ],
  };

  const currentSection =
    Object.entries(sections).find(([_, items]) =>
      items.includes(selectedMenu)
    )?.[0] ?? "계정";

  const renderContent = () => {
    if (userLoading)
      return <div style={{ padding: "1rem" }}>사용자 불러오는 중…</div>;

    switch (selectedMenu) {
      case "내 프로필":
        return <ProfileSettings user={youngUser} onChange={setYoungUser} />;
      case "로그인 및 보안":
        return <SecuritySettings user={youngUser} onChange={setYoungUser} />;
      case "알림 설정":
        return <AlertSettings user={youngUser} />;
      case "신청한 매칭 내역":
        return <Sell user={youngUser} />;
      case "관심 농지 목록":
        return <Star user={youngUser} />;
      case "신뢰 프로필 관리":
        return (
          <TrustProfile user={youngUser} onUserChange={handleUserChange} />
        );
      case "자격증 업로드":
        return <Certification buyerId={1} />;
      case "추천인/보증인 등록":
        return (
          <RecommenderForm user={youngUser} onUserChange={handleUserChange} />
        );
      case "나의 신뢰 레벨 확인":
        return <TrustScore user={youngUser} />;
      default:
        return <div style={{ padding: "1rem" }}>설정 항목을 선택하세요.</div>;
    }
  };

  return (
    <div
      className="SettingModal-ModalOverlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="설정"
    >
      <div className="SettingModal-SettingsContainer">
        <Sidebar selected={selectedMenu} onMenuSelect={setSelectedMenu} />

        <div className="SettingModal-MainSettingsArea">
          <div className="SettingModal-SettingsSectionTitle">
            {currentSection}
          </div>

          <div className="SettingModal-SettingsTabs">
            {sections[currentSection]?.map((item) => (
              <button
                key={item}
                className={`SettingModal-TabButton ${
                  selectedMenu === item ? "active" : ""
                }`}
                onClick={() => setSelectedMenu(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="SettingModal-SettingsDetailArea">
            {renderContent()}
          </div>
        </div>

        <button
          className="SettingModal-CloseButton"
          onClick={onClose}
          aria-label="설정 닫기 (ESC)"
          title="ESC로도 닫을 수 있어요"
        >
          ✕ ESC
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
