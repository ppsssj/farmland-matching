import { useEffect, useRef, useState } from "react";

export default function Step1_Name({ profile, updateProfile, onNext }) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  const [rawInput, setRawInput] = useState(profile?.name ?? "");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const cleaned = rawInput.trim().replace(/[^가-힣a-zA-Z\s]/g, "").replace(/\s{2,}/g, " ");
  const valid = /^[가-힣a-zA-Z\s]{2,20}$/.test(cleaned);

  const handleChange = (e) => {
    setRawInput(e.target.value); // 정제 없이 바로 반영
  };

  const handleNext = () => {
    setTouched(true);
    if (valid) {
      updateProfile("name", cleaned);  // 다음 단계 가기 전에 정제하고 저장
      onNext();
    }
  };

  return (
    <div className="SeniorProfile-Step">
      <h2>성함이 어떻게 되시나요?</h2>
      <input
        ref={inputRef}
        className={`Input ${touched && !valid ? "SeniorProfile-Input--error" : ""}`}
        placeholder="예: 홍길동"
        value={rawInput}
        onChange={handleChange}
      />
      <p className="SeniorProfile-Help">• 한글/영문 2~20자 (특수문자 제외)</p>
      <div className="SeniorProfile-Buttons">
        <button className="SeniorProfile-Next" disabled={!valid} onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
}
