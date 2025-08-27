import { useEffect, useRef, useState } from "react";

export default function Step2_BirthYear({ profile, updateProfile, onBack, onNext }) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const currentYear = new Date().getFullYear();
  const v = profile?.birthYear ?? "";
  const valid = /^\d{4}$/.test(v) && +v >= 1900 && +v <= currentYear - 10;

  const handleChange = (e) => {
    updateProfile("birthYear", e.target.value.replace(/\D/g, "").slice(0,4));
  };

  const handleNext = () => { setTouched(true); if (valid) onNext(); };

  return (
    <div className="SeniorProfile-Step">
      <h2>출생연도를 알려주세요</h2>
      <input
        ref={inputRef}
        className={`SeniorProfile-Input ${touched && !valid ? "SeniorProfile-Input--error" : ""}`}
        placeholder="예: 1950"
        inputMode="numeric"
        maxLength={4}
        value={v}
        onChange={handleChange}
      />
      <p className="SeniorProfile-Help">• 4자리 (예: 1950)</p>
      <div className="SeniorProfile-Buttons">
        <button onClick={onBack}>이전</button>
        <button className="SeniorProfile-Next" disabled={!valid} onClick={handleNext}>다음</button>
      </div>
    </div>

  );
}
