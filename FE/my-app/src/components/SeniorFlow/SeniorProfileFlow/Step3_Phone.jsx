import { useEffect, useRef, useState } from "react";

export default function Step3_Phone({ profile, updateProfile, onBack, onNext }) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const v = profile?.phone ?? "";
  const valid = /^01[0-9]-?\d{3,4}-?\d{4}$/.test(v);

  const handleChange = (e) => {
    updateProfile("phone", e.target.value.replace(/[^\d-]/g, ""));
  };

  const handleNext = () => { setTouched(true); if (valid) onNext(); };

  return (
    <div className="SeniorProfile-Step">
      <h2>연락처를 입력해주세요</h2>
      <input
        ref={inputRef}
        className={`SeniorProfile-Input ${touched && !valid ? "SeniorProfile-Input--error" : ""}`}
        placeholder="예: 010-1234-5678"
        inputMode="tel"
        value={v}
        onChange={handleChange}
      />
      <p className="Help">• 010-1234-5678 형식 권장</p>
      <div className="SeniorProfile-Buttons">
        <button onClick={onBack}>이전</button>
        <button className="SeniorProfile-Next" disabled={!valid} onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}
