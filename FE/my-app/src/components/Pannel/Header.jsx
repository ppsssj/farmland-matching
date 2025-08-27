// Header.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import SettingsModal from "../Setting/SettingModal.jsx";

function Header({ onOpenProfile }) {   // ⬅ 추가
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="HeaderContainer">
        <div className="Header-left-section">
          <img
            src="/LOGO1.png"
            alt="Logo"
            className="HeaderLogo"
            onClick={() => navigate("/")}
          />
          <div className="HeaderTitleContainer">
            <span className="HeaderTitle">밭 볼텨유?</span>
            <span className="HeaderSubtitle">농지를 찾는 청년 / 중장년 농업인 Page</span>
          </div>
        </div>

        <div className="Header-right-section">
          <button className="SettingsButton" onClick={onOpenProfile}>🙍 프로필</button> {/* ⬅ 추가 */}
          <button className="SettingsButton" onClick={() => setShowSettings(true)}>⚙ 설정</button>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default Header;
