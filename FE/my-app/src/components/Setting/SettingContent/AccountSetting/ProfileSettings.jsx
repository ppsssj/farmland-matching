import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ProfileSetting.css";
import useKakaoLoader from "../../../../lib/useKakaoLoader";

function ProfileSettings({ user, onChange }) {
  const [editMode, setEditMode] = useState(false);
  const [agreements, setAgreements] = useState({
    all: true,
    privacy: true,
    marketing: true,
    thirdParty: true,
  });

  // buyerLat / buyerLng 포함
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    callNumber: "",
    mail: "",
    address: "",
    buyerLat: "", // 위도
    buyerLng: "", // 경도
  });

  // 카카오 JS SDK 로드
  const kakaoReady = useKakaoLoader(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);

  // 마지막으로 지오코딩한 주소와 디바운스 타이머
  const lastGeocodedAddressRef = useRef("");
  const debounceRef = useRef(null);

  // 상위 user → 폼 주입
  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      age: user.age || "",
      sex: user.sex || "",
      callNumber: user.callNumber || "",
      mail: user.mail || "",
      address: user.address || "",
      buyerLat: user.buyerLat?.toString?.() || "",
      buyerLng: user.buyerLng?.toString?.() || "",
    });
  }, [user]);

  const canSave = useMemo(() => {
    return form.name.trim() && form.age.trim() && form.callNumber.trim();
  }, [form]);

  const onField = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  // 전체 동의 토글
  const toggleAll = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      privacy: newValue,
      marketing: newValue,
      thirdParty: newValue,
    });
  };

  // 개별 동의 토글
  const toggleOne = (key) => {
    setAgreements((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      updated.all = updated.privacy && updated.marketing && updated.thirdParty;
      return updated;
    });
  };

  // 🔁 주소가 바뀔 때마다 자동 디바운스 지오코딩 (버튼 불필요)
  // 🔁 주소 자동 지오코딩 useEffect 수정 부분만 보여줍니다.
  useEffect(() => {
    if (!kakaoReady) return;
    if (!window.kakao?.maps?.services) {
      console.warn("[Geo] Kakao services 미준비 상태. SDK 재시도 대기");
      return;
    }

    const addr = (form.address || "").trim();
    if (addr.length < 5) return;

    if (
      lastGeocodedAddressRef.current === addr &&
      form.buyerLat &&
      form.buyerLng
    )
      return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(addr, function (result, status) {
          if (
            status === window.kakao.maps.services.Status.OK &&
            result?.length
          ) {
            const { x, y } = result[0];
            setForm((p) => ({ ...p, buyerLat: y, buyerLng: x }));
            lastGeocodedAddressRef.current = addr;
          } else {
            console.warn(
              "[Geo] 주소로 좌표를 찾지 못했습니다:",
              addr,
              status,
              result
            );
          }
        });
      } catch (e) {
        console.error("[Geo] 지오코딩 오류(services 확인 필요):", e);
      }
    }, 700);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.address, kakaoReady, form.buyerLat, form.buyerLng]);

  // 저장
  const handleSave = () => {
    if (!canSave) return;
    if (!agreements.privacy) {
      alert("개인정보 수집·이용에 동의해 주세요. (필수)");
      return;
    }

    // 숫자 변환(빈값은 undefined)
    const latNum = form.buyerLat === "" ? undefined : parseFloat(form.buyerLat);
    const lngNum = form.buyerLng === "" ? undefined : parseFloat(form.buyerLng);
    if (form.buyerLat !== "" && Number.isNaN(latNum)) {
      alert("위도 형식이 올바르지 않습니다.");
      return;
    }
    if (form.buyerLng !== "" && Number.isNaN(lngNum)) {
      alert("경도 형식이 올바르지 않습니다.");
      return;
    }

    const updated = { ...user, ...form, buyerLat: latNum, buyerLng: lngNum };
    onChange?.(updated);
    setEditMode(false);
    alert("프로필이 저장되었습니다.");
    console.log("✅ 저장할 데이터:", updated);
  };

  return (
    <div className="ProfileSettings-container">
      <div className="ProfileSettings-top-section">
        <div className="ProfileSettings-left-top-section">
          <div className="ProfileSettings-input-row half-width">
            <label>이름</label>
            <input
              value={form.name}
              onChange={onField("name")}
              disabled={!editMode}
            />
          </div>
          <div className="ProfileSettings-input-row half-width">
            <label>나이</label>
            <input
              value={form.age}
              onChange={onField("age")}
              disabled={!editMode}
            />
          </div>
          <div className="ProfileSettings-input-row half-width">
            <label>성별</label>
            <input
              value={form.sex}
              onChange={onField("sex")}
              disabled={!editMode}
            />
          </div>
          <div className="ProfileSettings-input-row half-width">
            <label>전화번호</label>
            <input
              className="ProfileSettings-num"
              value={form.callNumber}
              onChange={onField("callNumber")}
              disabled={!editMode}
            />
            <span className="ProfileSettings-error-text">
              전화번호 인증 완료.
            </span>
          </div>
        </div>

        <div className="ProfileSettings-profile-photo">
          <img
            src={user?.profileImage}
            alt="프로필 사진"
            className="ProfileSettings-photo-img"
          />
        </div>
      </div>

      <div className="ProfileSettings-left-section">
        <div className="ProfileSettings-input-row">
          <label>메일</label>
          <input
            className="ProfileSettings-num"
            value={form.mail}
            onChange={onField("mail")}
            disabled={!editMode}
          />
          <span className="ProfileSettings-error-text">메일 인증 완료.</span>
        </div>

        <div className="ProfileSettings-input-row">
          <label>주소</label>
          <input
            value={form.address}
            onChange={onField("address")}
            disabled={!editMode}
            placeholder="예) 충남 아산시 ..."
          />
        </div>

        {/* 좌표 표시(읽기 전용) */}
        <div className="ProfileSettings-input-row">
          <label>위도 (자동)</label>
          <input value={form.buyerLat} readOnly />
        </div>
        <div className="ProfileSettings-input-row">
          <label>경도 (자동)</label>
          <input value={form.buyerLng} readOnly />
        </div>
      </div>

      {/* 동의 항목 */}
      <div className="ProfileSettings-agreements">
        <div className="agree-all">
          <input
            type="checkbox"
            id="agreeAll"
            checked={agreements.all}
            onChange={toggleAll}
            disabled={!editMode}
          />
          <label htmlFor="agreeAll">전체 동의</label>
        </div>

        <div className="agree-item">
          <input
            type="checkbox"
            id="privacy"
            checked={agreements.privacy}
            onChange={() => toggleOne("privacy")}
            disabled={!editMode}
          />
          <label htmlFor="privacy">[필수] 개인정보 수집·이용 동의</label>
        </div>

        <div className="agree-item">
          <input
            type="checkbox"
            id="marketing"
            checked={agreements.marketing}
            onChange={() => toggleOne("marketing")}
            disabled={!editMode}
          />
          <label htmlFor="marketing">[선택] 마케팅 정보 수신 동의</label>
        </div>

        <div className="agree-item">
          <input
            type="checkbox"
            id="thirdParty"
            checked={agreements.thirdParty}
            onChange={() => toggleOne("thirdParty")}
            disabled={!editMode}
          />
          <label htmlFor="thirdParty">[선택] 제3자 제공 동의</label>
        </div>
      </div>

      {!editMode ? (
        <button
          className="ProfileSettings-submit-button"
          onClick={() => setEditMode(true)}
        >
          수정하기
        </button>
      ) : (
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            className="ProfileSettings-submit-button"
            disabled={!canSave}
            onClick={handleSave}
          >
            저장
          </button>
          <button
            className="ProfileSettings-cancel-button"
            onClick={() => {
              setForm({
                name: user?.name || "",
                age: user?.age || "",
                sex: user?.sex || "",
                callNumber: user?.callNumber || "",
                mail: user?.mail || "",
                address: user?.address || "",
                buyerLat: user?.buyerLat?.toString?.() || "",
                buyerLng: user?.buyerLng?.toString?.() || "",
              });
              setEditMode(false);
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
export default ProfileSettings;
