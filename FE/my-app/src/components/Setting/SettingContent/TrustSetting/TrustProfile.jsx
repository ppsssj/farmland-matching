// src/components/Setting/SettingContent/TrustSetting/TrustProfile.jsx
import { useEffect, useMemo, useState } from "react";
import "./TrustProfile.css";
import { getBuyerTrustProfile, saveBuyerTrustProfile } from "../../../../api/trustProfile";

export default function TrustProfile({ user, onUserChange, buyerId = 1, token }) {
  // 관심작물/장비/거래
  const [crops, setCrops] = useState([]);
  const [tools, setTools] = useState([]);
  const [trades, setTrades] = useState([]);
  const [leasePeriod, setLeasePeriod] = useState("");
  const [otherTrade, setOtherTrade] = useState("");

  // ✅ 예산(만원) / 거래기간(예: 1년 내)
  const [budget, setBudget] = useState("");         // 문자열로 보관(입력 제어), 저장 시 숫자 변환
  const [wantPeriod, setWantPeriod] = useState(""); // “1년 내” 등

  // 수상경력
  const [awards, setAwards] = useState([]); // [{ title, org, year }]

  // 소개/영상/SNS/성향
  const [oneLine, setOneLine] = useState("");
  const [intro, setIntro] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sns, setSns] = useState("");
  const [personal, setPersonal] = useState("");

  // ✅ 농업 경험
  const [hasExp, setHasExp] = useState(false);
  const [expYears, setExpYears] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const tradeOptions = ["토지 매입", "임대", "공유농", "기타"];
  const ONE_LINE_MAX = 80;

  // 🔹 서버 데이터 → 화면 state 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getBuyerTrustProfile(buyerId, { token });
        if (!mounted || !data) return;

        // ---- 백엔드 스키마 매핑 ----
        const awardsList = Array.isArray(data.awards) ? data.awards : [];

        // 경험 문자열 복원(라이트 규칙)
        const expStr = (data.experience || "").trim();
        const expHas = expStr ? !/없음|무|no/i.test(expStr) : false;
        const yearsMatch = expStr.match(/(\d+)\s*년/);
        const expYearsGuess = yearsMatch ? `${yearsMatch[1]}년` : "";
        const descGuess = expStr
          .replace(/경력\s*O|경력\s*있음|경력\s*X|경력\s*없음/gi, "")
          .replace(/\d+\s*년/gi, "")
          .replace(/[,\s]+/g, " ")
          .trim();

        setCrops(Array.isArray(data.interestCrop) ? data.interestCrop : []);
        setTools(Array.isArray(data.equipment) ? data.equipment : []);
        setTrades(Array.isArray(data.wantTrade) ? data.wantTrade : []);
        setLeasePeriod(data.rentPeriod || "");
        setOtherTrade(data.other || "");

        // ✅ 예산/거래기간 로드
        // budget은 숫자일 수 있으니 문자열로 변환해서 입력창에 표시
        setBudget(
          data.budget === 0 || data.budget ? String(data.budget) : ""
        );
        setWantPeriod(data.wantPeriod || "");

        setAwards(awardsList.map((t) => ({ title: t || "" })));

        setOneLine(data.oneIntroduction || "");
        setIntro(data.introduction || "");
        setVideoUrl(data.videoURL || "");
        setSns(data.sns || "");
        setPersonal(data.personal || "");

        setHasExp(expHas);
        setExpYears(expYearsGuess);
        setExpDesc(descGuess);
      } catch (e) {
        console.error(e);
        alert("신뢰정보 불러오기에 실패했습니다. 콘솔을 확인하세요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [buyerId, token]);

  useEffect(() => {
    if (!user) return;
    // user.detail 기반 보정이 필요하면 여기서 병합
  }, [user]);

  // 유틸
  const addField = (setter, initial = "") => setter((prev) => [...prev, initial]);
  const removeAt = (setter, idx) => setter((prev) => prev.filter((_, i) => i !== idx));
  const changeAt = (setter, idx, val) =>
    setter((prev) => { const next = [...prev]; next[idx] = val; return next; });

  const toggleTrade = (type) =>
    setTrades((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));

  const changeAward = (idx, field, value) =>
    setAwards((prev) => { const next = [...prev]; next[idx] = { ...next[idx], [field]: value }; return next; });

  // 예산(만원) 입력: 숫자만 허용
  const handleBudgetChange = (e) => {
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    setBudget(onlyDigits);
  };

  const canSave = useMemo(() => {
    const hasAwards = awards.some((a) => a.title?.trim() || a.org?.trim() || a.year?.trim());
    const hasIntro = oneLine.trim() || intro.trim() || videoUrl.trim() || sns.trim() || personal.trim();
    const hasBasics =
      crops.some((v) => v?.trim()) ||
      tools.some((v) => v?.trim()) ||
      trades.length > 0 ||
      hasAwards ||
      hasIntro ||
      hasExp || !!expYears?.trim() || !!expDesc?.trim();

    // ✅ budget/wantPeriod도 저장 허용 조건에 포함
    return hasBasics || !!budget || !!wantPeriod?.trim() || !!leasePeriod?.trim() || !!otherTrade?.trim();
  }, [crops, tools, trades, awards, oneLine, intro, videoUrl, sns, personal, hasExp, expYears, expDesc, budget, wantPeriod, leasePeriod, otherTrade]);

  // 🔹 저장(등록/수정 동일)
  const onSave = async () => {
    try {
      if (!canSave) {
        alert("저장할 내용이 없습니다.");
        return;
      }
      setSaving(true);

      const awardsPayload = awards
        .map((a) => (a?.title || "").trim())
        .filter(Boolean);

      const expStr = hasExp
        ? `경력 O${expYears ? `, ${expYears.trim()}` : ""}${expDesc ? `, ${expDesc.trim()}` : ""}`
        : "경력 없음";

      // ✅ budget은 숫자 또는 null
      const budgetNumber = budget ? Number(budget) : null;

      // 백엔드 TrustProfile 스키마에 맞춘 payload
      const payload = {
        awards: awardsPayload,
        experience: expStr,
        interestCrop: crops.filter((v) => !!v?.trim()),
        wantTrade: trades,
        rentPeriod: leasePeriod || "",
        other: otherTrade || "",
        equipment: tools.filter((v) => !!v?.trim()),
        oneIntroduction: oneLine.trim(),
        introduction: intro.trim(),
        videoURL: videoUrl.trim(),
        sns: sns.trim(),
        personal: personal.trim(),
        // ✅ 신규 필드
        budget: budgetNumber,         // 만원 단위 숫자
        wantPeriod: (wantPeriod || "").trim(), // "1년 내" 등
      };

      const result = await saveBuyerTrustProfile(buyerId, payload, { token });

      // 화면/상태 반영(필요 시)
      onUserChange?.({
        ...(user || {}),
        detail: {
          ...(user?.detail || {}),
          interestList: payload.interestCrop,
          equipmentList: payload.equipment,
          tradesList: payload.wantTrade,
          leasePeriod: payload.rentPeriod,
          otherTrade: payload.other,
          awardsList: awardsPayload.map((t) => ({ title: t })),
          intro: {
            ...(user?.detail?.intro || {}),
            OneWord: payload.oneIntroduction,
            PullWord: payload.introduction,
            video: payload.videoURL,
            sns: payload.sns,
            personal: payload.personal,
          },
          // ✅ 프론트 보조 보관
          budget: budgetNumber,
          wantPeriod: payload.wantPeriod,
          // 경험은 프론트 구조대로 유지
          experience: { has: hasExp, years: expYears, desc: expDesc },
        },
      });

      alert("신뢰 프로필이 저장되었습니다.");
      console.log("✅ [saveTrustProfile] response:", result);
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="TrustProfile-Container">
      <div className="TrustProfile-Header">
        <h2>신뢰 프로필</h2>
        <p>관심 작물 / 사용 장비 / 거래 형태 / 예산 · 거래기간 / 수상 경력 / 소개 · 영상 · SNS · 성향 / 농업 경험</p>
        {loading && <div className="TrustProfile-Loading">불러오는 중...</div>}
      </div>

      {/* 가로 2열 그리드 */}
      <div className="TrustProfile-Grid">
        {/* 관심 작물 */}
        <section className="TrustProfile-Card">
          <div className="TrustProfile-CardHeader">
            <h3>관심 작물</h3>
            <button className="TrustProfile-AddButton" onClick={() => addField(setCrops)}>+ 추가</button>
          </div>
          {crops.length === 0 && <div className="TrustProfile-Empty">관심 작물을 추가해 주세요.</div>}
          {crops.map((crop, idx) => (
            <div className="TrustProfile-RowGrid" key={idx}>
              <input
                className="TrustProfile-Input"
                type="text"
                placeholder="예: 사과"
                value={crop}
                onChange={(e) => changeAt(setCrops, idx, e.target.value)}
              />
              <div></div>
              <button className="TrustProfile-DeleteButton" onClick={() => removeAt(setCrops, idx)}>삭제</button>
            </div>
          ))}
        </section>

        {/* 사용 장비 */}
        <section className="TrustProfile-Card">
          <div className="TrustProfile-CardHeader">
            <h3>사용 장비</h3>
            <button className="TrustProfile-AddButton" onClick={() => addField(setTools)}>+ 추가</button>
          </div>
          {tools.length === 0 && <div className="TrustProfile-Empty">사용 장비를 추가해 주세요.</div>}
          {tools.map((tool, idx) => (
            <div className="TrustProfile-RowGrid" key={idx}>
              <input
                className="TrustProfile-Input"
                type="text"
                placeholder="예: 트랙터"
                value={tool}
                onChange={(e) => changeAt(setTools, idx, e.target.value)}
              />
              <div></div>
              <button className="TrustProfile-DeleteButton" onClick={() => removeAt(setTools, idx)}>삭제</button>
            </div>
          ))}
        </section>

        {/* 거래 형태 */}
        <section className="TrustProfile-Card">
          <h3>거래 형태</h3>
          <div className="TrustProfile-TagContainer">
            {tradeOptions.map((type) => (
              <button
                key={type}
                type="button"
                className={`TrustProfile-TagButton ${trades.includes(type) ? "selected" : ""}`}
                onClick={() => toggleTrade(type)}
              >{type}</button>
            ))}
          </div>

          {trades.includes("임대") && (
            <input
              type="text"
              placeholder="임대 기간 (예: 2년)"
              value={leasePeriod}
              onChange={(e) => setLeasePeriod(e.target.value)}
              className="TrustProfile-Input TrustProfile-mt8"
            />
          )}
          {trades.includes("기타") && (
            <input
              type="text"
              placeholder="기타 거래 형태를 입력해주세요"
              value={otherTrade}
              onChange={(e) => setOtherTrade(e.target.value)}
              className="TrustProfile-Input TrustProfile-mt8"
            />
          )}
        </section>

        {/* ✅ 예산 · 거래기간 */}
        <section className="TrustProfile-Card">
          <h3>예산 · 거래기간</h3>

          <div className="TrustProfile-Row">
            <label className="TrustProfile-Label">예산</label>
            <div className="TrustProfile-InputWrap" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                className="TrustProfile-Input"
                inputMode="numeric"
                placeholder="예: 5000"
                value={budget}
                onChange={handleBudgetChange}
                aria-label="예산(만원)"
              />
              <span style={{ whiteSpace: "nowrap" }}>만원</span>
            </div>
          </div>

          <div className="TrustProfile-Row">
            <label className="TrustProfile-Label">거래기간</label>
            <div className="TrustProfile-InputWrap" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["6개월 내", "1년 내", "2년 내", "3년 내"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`TrustProfile-TagButton ${wantPeriod === opt ? "selected" : ""}`}
                    onClick={() => setWantPeriod(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                className="TrustProfile-Input"
                placeholder='직접 입력 (예: "18개월 내", "1년 반 내")'
                value={wantPeriod}
                onChange={(e) => setWantPeriod(e.target.value)}
                aria-label="거래기간(예: 1년 내)"
              />
            </div>
          </div>
        </section>

        {/* 수상 경력 */}
        <section className="TrustProfile-Card">
          <div className="TrustProfile-CardHeader">
            <h3>수상 경력</h3>
            <button className="TrustProfile-AddButton" onClick={() => setAwards((prev) => [...prev, { title: "" }])}>+ 추가</button>
          </div>

          {awards.length === 0 && <div className="TrustProfile-Empty">수상 경력을 추가해 주세요.</div>}

          {awards.map((a, idx) => (
            <div className="TrustProfile-RowGrid awards" key={idx}>
              <input
                className="TrustProfile-Input"
                type="text"
                placeholder="수상명 (예: 귀농 창업 경진대회 최우수)"
                value={a.title}
                onChange={(e) => changeAward(idx, "title", e.target.value)}
              />
              <button className="TrustProfile-DeleteButton" onClick={() => setAwards((prev) => prev.filter((_, i) => i !== idx))}>
                삭제
              </button>
            </div>
          ))}
        </section>

        {/* ✅ 농업 경험 */}
        <section className="TrustProfile-Card">
          <div className="TrustProfile-CardHeader">
            <h3>농업 경험</h3>
          </div>

          <div className="TrustProfile-Row">
            <label className="TrustProfile-Label">경험 여부</label>
            <div className="TrustProfile-InputWrap">
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={hasExp} onChange={(e) => setHasExp(e.target.checked)} />
                <span>경험 있음</span>
              </label>
            </div>
          </div>

          {hasExp ? (
            <>
              <div className="TrustProfile-Row">
                <label className="TrustProfile-Label">경력 연차</label>
                <div className="TrustProfile-InputWrap">
                  <input
                    className="TrustProfile-Input"
                    placeholder="예: 2년"
                    value={expYears}
                    onChange={(e) => setExpYears(e.target.value)}
                  />
                </div>
              </div>
              <div className="TrustProfile-Row">
                <label className="TrustProfile-Label">경험 설명</label>
                <div className="TrustProfile-InputWrap">
                  <input
                    className="TrustProfile-Input"
                    placeholder="예: 토마토/딸기 재배"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="TrustProfile-Empty">농업 경험이 없다고 선택하셨습니다.</div>
          )}
        </section>
      </div>

      {/* 소개 묶음 */}
      <section className="TrustProfile-IntroRoot">
        <div className="TrustProfile-IntroCard">
          <TrustRow label="한마디 소개">
            <div className="TrustProfile-InputWrap">
              <input
                className="TrustProfile-Input"
                placeholder={`예) ${ONE_LINE_MAX}자 이내로 핵심만 적어주세요`}
                value={oneLine}
                maxLength={ONE_LINE_MAX}
                onChange={(e) => setOneLine(e.target.value)}
                aria-label="대표 한마디"
              />
              <div className="TrustProfile-Counter">{oneLine.length} / {ONE_LINE_MAX}</div>
            </div>
          </TrustRow>

          <TrustRow label="자기 소개">
            <textarea
              className="TrustProfile-Textarea"
              placeholder="자기소개(필수) — 동기, 경험, 목표 등을 자세히 적어주세요."
              rows={8}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              aria-label="자기 소개"
            />
          </TrustRow>

          <TrustRow label="자기소개 영상">
            <input
              type="text"
              className="TrustProfile-Input"
              placeholder="YouTube 등 영상 URL (선택)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              aria-label="자기소개 영상 URL"
            />
          </TrustRow>

          <TrustRow label="SNS">
            <input
              type="text"
              className="TrustProfile-Input"
              placeholder="SNS 아이디 또는 링크 (선택)"
              value={sns}
              onChange={(e) => setSns(e.target.value)}
              aria-label="SNS"
            />
          </TrustRow>

          <TrustRow label="개인 성향">
            <input
              type="text"
              className="TrustProfile-Input"
              placeholder="예: 단체생활, 성실, 관계중시 (쉼표로 구분 가능)"
              value={personal}
              onChange={(e) => setPersonal(e.target.value)}
              aria-label="개인 성향"
            />
          </TrustRow>
        </div>
      </section>

      <div className="TrustProfile-ActionRow">
        <button className="TrustProfile-PrimaryButton" disabled={!canSave || saving} onClick={onSave}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}

function TrustRow({ label, children }) {
  return (
    <div className="TrustProfile-Row">
      <label className="TrustProfile-Label">{label}</label>
      <div className="TrustProfile-InputWrap">{children}</div>
    </div>
  );
}
