import { useEffect, useRef, useState } from "react";

export default function Step4_Address({ profile, updateProfile, onBack, onNext }) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const v = profile?.address ?? "";
  const valid = v.trim().length >= 2;

  const handleNext = () => { setTouched(true); if (valid) onNext(); };

  return (
    <div className="SeniorProfile-Step">
      <h2>거주 지역을 알려주세요</h2>
      <input
        ref={inputRef}
        className={`SeniorProfile-Input ${touched && !valid ? "SeniorProfile-Input--error" : ""}`}
        placeholder="예: 충남 아산시 배방읍"
        value={v}
        onChange={(e)=>updateProfile("address", e.target.value)}
      />
      <p className="SeniorProfile-Help">• 시/군/읍면 정도로 간단히</p>
      <div className="SeniorProfile-Buttons">
        <button onClick={onBack}>이전</button>
        <button className="SeniorProfile-Next" disabled={!valid} onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}
