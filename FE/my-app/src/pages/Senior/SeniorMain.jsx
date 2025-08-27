import { useNavigate } from "react-router-dom";
import "./SeniorMain.css";
import FloatingEmojis from "../Effect/FloatingEmojis.jsx";

function SeniorMain() {
  const navigate = useNavigate();

  return (
    <div className="senior-main">
      <FloatingEmojis />

      {/* 👈 좌측 상단 Intro로 이동 버튼 */}
      <div className="senior-main-back-button" onClick={() => navigate("/")}>
        ⬅ 인트로로 돌아가기
      </div>

      <header className="senior-main-header">
        <h1>👵 어르신 농지 관리</h1>
        <p className="senior-main-subtitle">
          농지를 등록하거나, 등록한 내역을 확인할 수 있어요.
        </p>
      </header>

      <section className="senior-main-button-group">
        <MainActionCard
          emoji="👤"
          title="개인 정보 입력하기"
          description="개인 정보를 입력하면, 농지 등록 시 자동으로 정보가 채워집니다. (이름, 연락처, 주소 등)"
          onClick={() => navigate("/senior/profile")}
        />
        <MainActionCard
          emoji="➕"
          title="농지 등록하기"
          description="농지를 등록하면, 해당 농지에 대한 정보를 입력할 수 있어요. (농지 이름, 위치, 면적 등)"
          onClick={() => navigate("/senior/register")}
        />
        <MainActionCard
          emoji="📄"
          title="등록한 농지 목록 보기"
          description="등록한 농지의 목록을 확인할 수 있어요. 각 농지의 상세 정보를 확인하고 수정할 수 있으며 청년의 매칭 신청을 관리할 수 있습니다."
          onClick={() => navigate("/senior/lands")}
        />
        
      </section>
    </div>
  );
}

function MainActionCard({ emoji, title, description, onClick }) {
  return (
    <div className="senior-main-action-card" onClick={onClick}>
      <div className="senior-main-action-card-button">
        {emoji} {title}
      </div>
      <p className="senior-main-action-card-description">{description}</p>
    </div>
  );
}

export default SeniorMain;
