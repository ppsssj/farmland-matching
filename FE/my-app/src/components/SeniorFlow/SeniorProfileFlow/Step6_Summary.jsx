import { useNavigate } from "react-router-dom";

export default function Step6_Summary({ profile, onBack, onSave }) {
  const navigate = useNavigate();

  const handleSave = () => {
    onSave(); // 로컬스토리지 저장
    navigate("/SeniorMain"); // 저장 후 메인 페이지로 이동
  };

  const maskPhone = (p = "") =>
    p.replace(/(\d{3})-?(\d{3,4})-?(\d{4})/, "$1-****-$3");

  return (
    <div className="SeniorProfile-Step">
      <h2>입력하신 정보를 확인해주세요</h2>
      <Row label="성함" value={profile.name} />
      <Row label="출생연도" value={profile.birthYear} />
      <Row label="연락처" value={maskPhone(profile.phone)} />
      <Row label="거주 지역" value={profile.address} />
      <Row label="보유 농지 수" value={`${profile.landCount || 0} 개`} />
      <div className="SeniorProfile-Buttons">
        <button onClick={onBack}>수정하기</button>
        <button className="SeniorProfile-Next" onClick={handleSave}>저장하기</button>
      </div>
      <p className="SeniorProfile-Help">
        ※ 저장 후 ‘내 정보’에서 언제든 수정할 수 있어요.
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="SeniorProfile-InfoRow">
      <div className="SeniorProfile-InfoLabel">{label}</div>
      <div className="SeniorProfile-InfoValue">{value || "-"}</div>
    </div>
  );
}
