// src/components/ProfileModal.jsx
import React, { useEffect, useCallback, useState, Suspense } from "react";
import "./ProfileModal.css";
import API_BASE from "../../config/apiBase"; // ✅ 공용 API 베이스 사용

// 지연 로딩
const ProfileSettings = React.lazy(() => import("../Setting/SettingContent/AccountSetting/ProfileSettings"));
const Certification   = React.lazy(() => import("../Setting/SettingContent/TrustSetting/Certification"));
const RecommenderForm = React.lazy(() => import("../Setting/SettingContent/TrustSetting/RecommenderForm"));
const TrustProfile    = React.lazy(() => import("../Setting/SettingContent/TrustSetting/TrustProfile"));
const TrustScore      = React.lazy(() => import("../Setting/SettingContent/TrustSetting/TrustScore"));

/**
 * 단일 섹션 보기 + 상단 목차
 * - 상단 요약은 항상 표시
 * - 아래 컨텐츠 영역에는 선택된 섹션 하나만 렌더링
 */
export default function ProfileModal({ user, buyerId = 1, token, loading, onClose }) {
  // ESC 닫기
  const handleKeyDown = useCallback((e) => { if (e.key === "Escape") onClose?.(); }, [onClose]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 섹션 상태
  const [active, setActive] = useState("base"); // 'base' | 'cert' | 'recom' | 'trust' | 'score'
  const [userState, setUserState] = useState(user || null);
  useEffect(() => setUserState(user || null), [user]);

  const Loader = <div style={{ padding: "12px 0" }}>불러오는 중…</div>;

  const NavButton = ({ k, label }) => (
    <button
      type="button"
      className={`ProfileModal-TopNavBtn ${active === k ? "active" : ""}`}
      onClick={() => {
        setActive(k);
        // 컨텐츠 상단으로 스크롤
        const panel = document.querySelector(".ProfileModal-Content");
        if (panel) panel.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {label}
    </button>
  );

  const renderSection = () => (
    <Suspense fallback={Loader}>
      {active === "base" && (
        <section className="ProfileModal-Section full fade-in">
          <h3 className="ProfileModal-SectionTitle">기본정보</h3>
          <ProfileSettings user={userState} onChange={(updated) => setUserState(updated)} />
        </section>
      )}
      {active === "cert" && (
        <section className="ProfileModal-Section full fade-in">
          <h3 className="ProfileModal-SectionTitle">자격증</h3>
          {/* ✅ apiBase를 하위에도 통일 전달(필요 없으면 무시됨) */}
          <Certification buyerId={buyerId} token={token} apiBase={API_BASE} />
        </section>
      )}
      {active === "recom" && (
        <section className="ProfileModal-Section full fade-in">
          <h3 className="ProfileModal-SectionTitle">추천인</h3>
          <RecommenderForm buyerId={buyerId} token={token} user={userState} onUserChange={(u) => setUserState(u)} apiBase={API_BASE} />
        </section>
      )}
      {active === "trust" && (
        <section className="ProfileModal-Section full fade-in">
          <h3 className="ProfileModal-SectionTitle">신뢰 프로필</h3>
          <TrustProfile user={userState} onUserChange={(u) => setUserState(u)} buyerId={buyerId} token={token} apiBase={API_BASE} />
        </section>
      )}
      {active === "score" && (
        <section className="ProfileModal-Section full fade-in">
          <h3 className="ProfileModal-SectionTitle">신뢰 점수</h3>
          {/* ❌ process.env 사용 제거 → ✅ 공용 API_BASE 사용 */}
          <TrustScore buyerId={buyerId} apiBase={API_BASE} />
        </section>
      )}
    </Suspense>
  );

  return (
    <div className="ProfileModal-Overlay" role="dialog" aria-modal="true">
      <div className="ProfileModal-Card">
        {/* 헤더 */}
        <div className="ProfileModal-Header">
          <div className="ProfileModal-Title">내 프로필</div>
          <button className="ProfileModal-Close" onClick={onClose} aria-label="닫기">×</button>
        </div>

        {/* 상단 요약은 항상 표시 */}
        {loading ? (
          <div className="ProfileModal-Loading">불러오는 중…</div>
        ) : !userState ? (
          <div className="ProfileModal-Empty">프로필 정보를 찾을 수 없습니다.</div>
        ) : (
          <>
            <section className="ProfileModal-Section full ProfileModal-Top">
              <div className="ProfileModal-Avatar">
                <img src="/images/youngfarmer_image.png" alt="프로필" />
              </div>

              <div className="ProfileModal-TopInfo">
                <div className="ProfileModal-Identity">
                  <div className="ProfileModal-Name">{userState.name || "이름 미입력"}</div>
                  <div className="ProfileModal-Tags">
                    {userState.sex && <span className="tag">{userState.sex}</span>}
                    {userState.age && <span className="tag">{userState.age}세</span>}
                  </div>
                </div>

                <div className="ProfileModal-QuickGrid">
                  {(userState.callNumber || userState.mail) && (
                    <div className="ProfileModal-QuickCard">
                      <div className="quick-title">연락</div>
                      {userState.callNumber && (
                        <div className="quick-row"><span className="quick-ico">📞</span><span>{userState.callNumber}</span></div>
                      )}
                      {userState.mail && (
                        <div className="quick-row"><span className="quick-ico">✉️</span><span>{userState.mail}</span></div>
                      )}
                    </div>
                  )}
                  {userState.address && (
                    <div className="ProfileModal-QuickCard">
                      <div className="quick-title">주소</div>
                      <div className="quick-row"><span className="quick-ico">📍</span><span className="quick-address">{userState.address}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 상단 목차 */}
            <div className="ProfileModal-TopNav" role="navigation" aria-label="프로필 목차">
              <NavButton k="base"  label="기본정보" />
              <NavButton k="cert"  label="자격증" />
              <NavButton k="recom" label="추천인" />
              <NavButton k="trust" label="신뢰 프로필" />
              <NavButton k="score" label="신뢰 점수" />
            </div>

            {/* 컨텐츠: 선택된 섹션만 표시 */}
            <div className="ProfileModal-Content">
              {renderSection()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
