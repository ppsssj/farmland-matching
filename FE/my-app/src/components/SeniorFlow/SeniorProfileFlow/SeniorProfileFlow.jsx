import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingEmojis from "../../../pages/Effect/FloatingEmojis";
import Step1_Name from "./Step1_Name";
import Step2_BirthYear from "./Step2_BirthYear";
import Step3_Phone from "./Step3_Phone";
import Step4_Address from "./Step4_Address";
import Step5_LandCount from "./Step5_LandCount";
import Step6_Summary from "./Step6_Summary";
import { getSeller, updateSeller } from "../../../api/SeniorUser";
import "./SeniorProfileFlow.css";

const TOTAL_STEPS = 6;
const STORAGE_KEY = "senior_profile";

function SeniorProfileFlow() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    birthYear: "",
    phone: "",
    address: "",
    landCount: "",
  });

  const navigate = useNavigate();

  // ✅ 최초 로드 시 DB에서 불러오기
  useEffect(() => {
    async function fetchSeller() {
      try {
        const data = await getSeller("1");
        console.log("API 응답 데이터 (원본):", data);

        setProfile({
          name: data.name ?? "",
          birthYear: data.year ?? "",
          phone: data.phoneNumber ?? "",
          address: data.address ?? "",
          landCount: data.land ?? "",
        });
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    }
    fetchSeller();
  }, []);

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ 저장(수정) 버튼: profile 그대로 전달, 매핑은 API 모듈에서 처리
  const saveProfile = async () => {
    try {
      console.log("저장할 데이터(프론트 상태):", profile);

      // 빈값 경고(선택)
      const nullKeys = Object.entries(profile)
        .filter(([, v]) => v === null || v === "" || v === undefined)
        .map(([k]) => k);
      if (nullKeys.length > 0) {
        console.warn("다음 필드가 null/빈 값입니다:", nullKeys);
      }

      await updateSeller("1", profile);
      alert("저장되었습니다.");
      setStep(0);

      // (선택) 저장 직후 최신 데이터 재조회해서 화면 동기화
      const fresh = await getSeller("1");
      setProfile({
        name: fresh.name ?? "",
        birthYear: fresh.year ?? "",
        phone: fresh.phoneNumber ?? "",
        address: fresh.address ?? "",
        landCount: fresh.land ?? "",
      });
    } catch (err) {
      console.error("업데이트 실패:", err);
      console.log("에러 발생 시점의 profile 상태:", profile);
      alert("저장 실패. 콘솔을 확인하세요.");
    }
  };

  const progressPercent = step === 0 ? 0 : Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="SeniorProfile-Wrapper">
      <FloatingEmojis />
      <button
        className="SeniorProfile-BackButton"
        onClick={() => navigate("/SeniorMain")}
        type="button"
      >
        ⬅ 홈으로
      </button>

      <main className="SeniorProfile-FlowContainer">
        {/* 진행률 표시 */}
        <div className="SeniorProfile-ProgressBar">
          <div className="SeniorProfile-ProgressFill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="SeniorProfile-StepText">
          {step === 0
            ? "개인 정보"
            : `${step}단계 / 총 ${TOTAL_STEPS}단계 (${progressPercent}%)`}
        </div>

        {/* 요약 화면 */}
        {step === 0 && (
          <div className="SeniorProfile-Step">
            <h2>어르신 프로필</h2>
            <div className="SeniorProfile-ViewCard">
              <p>👤 이름: {profile.name || "미입력"}</p>
              <p>🎂 출생년도: {profile.birthYear || "미입력"}</p>
              <p>📞 연락처: {profile.phone || "미입력"}</p>
              <p>🏠 주소: {profile.address || "미입력"}</p>
              <p>🌾 보유 농지 수: {profile.landCount || "미입력"}</p>
            </div>
            <div className="SeniorProfile-Buttons">
              <button onClick={() => setStep(1)}>✏️ 수정하기</button>
            </div>
          </div>
        )}

        {/* 입력 단계 */}
        {step === 1 && <Step1_Name profile={profile} updateProfile={updateProfile} onNext={() => setStep(2)} />}
        {step === 2 && <Step2_BirthYear profile={profile} updateProfile={updateProfile} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && <Step3_Phone profile={profile} updateProfile={updateProfile} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
        {step === 4 && <Step4_Address profile={profile} updateProfile={updateProfile} onBack={() => setStep(3)} onNext={() => setStep(5)} />}
        {step === 5 && <Step5_LandCount profile={profile} updateProfile={updateProfile} onBack={() => setStep(4)} onNext={() => setStep(6)} />}
        {step === 6 && <Step6_Summary profile={profile} onBack={() => setStep(5)} onSave={saveProfile} />}
      </main>
    </div>
  );
}

export default SeniorProfileFlow;
