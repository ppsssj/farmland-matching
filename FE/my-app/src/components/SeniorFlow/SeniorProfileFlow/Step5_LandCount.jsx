import { useEffect, useRef, useState } from "react";

export default function Step5_LandCount({ profile, updateProfile, onBack, onNext }) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const v = String(profile?.landCount ?? "");
  const numeric = v.replace(/\D/g, "");
  const valid = numeric !== "" && Number(numeric) >= 0;

  const handleChange = (e) => {
    updateProfile("landCount", e.target.value.replace(/\D/g, ""));
  };

  const handleNext = () => { setTouched(true); if (valid) onNext(); };

  return (
    <div className="SeniorProfile-Step">
      <h2>보유한 농지는 몇 개인가요?</h2>
      <input
        ref={inputRef}
        className={`SeniorProfile-Input ${touched && !valid ? "SeniorProfile-Input--error" : ""}`}
        placeholder="예: 1"
        inputMode="numeric"
        value={v}
        onChange={handleChange}
      />
      <p className="SeniorProfile-Help">• 숫자로 입력 (0 이상)</p>
      <div className="SeniorProfile-Buttons">
        <button onClick={onBack}>이전</button>
        <button className="SeniorProfile-Next" disabled={!valid} onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}
