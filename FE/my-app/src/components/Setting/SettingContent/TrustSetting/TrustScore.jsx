import React, { useEffect, useMemo, useState } from "react";
import "./TrustScore.css";
import API_BASE from "../../../../config/apiBase"; // 공통 API_BASE

/**
 * TrustScore (API 연동)
 * - GET {API_BASE}/{buyerId}/trust-score
 */
export default function TrustScore({ buyerId = 1 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 디버깅 토글
  const DEBUG = true;
  const dlog = (...args) => DEBUG && console.log("[TrustScore]", ...args);

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();

    async function fetchScore() {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/${encodeURIComponent(buyerId)}/trust-score`;
        dlog("GET", url);
        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!alive) return;
        dlog("resp", json);
        setData(json);
      } catch (e) {
        if (!alive) return;
        dlog("error", e);
        setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchScore();
    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [buyerId]);

  const total = useMemo(() => {
    if (!data) return 0;
    const t = Number(data.total) || 0;
    return Math.max(0, Math.min(t, 100));
  }, [data]);

  // 안전 추출 유틸
  const pick = (obj, key, fallback = { quantity: 0, unitPoint: 0, acquiredPoint: 0 }) => {
    const o = obj?.[key];
    if (!o || typeof o !== "object") return { ...fallback };
    return {
      quantity: Number(o.quantity) || 0,
      unitPoint: Number(o.unitPoint) || 0,
      acquiredPoint: Number(o.acquiredPoint) || 0,
    };
  };

  const rows = useMemo(() => {
    if (!data) return [];
    const license = pick(data, "license");
    const suggest = pick(data, "suggest");
    const sns = pick(data, "sns");
    const awards = pick(data, "awards");
    const oneIntro = pick(data, "oneIntroduction");
    const intro = pick(data, "introduction");

    return [
      { icon: "📜", label: "자격증", rule: `1개당 +${license.unitPoint}점`, qty: `${license.quantity}개`, score: license.acquiredPoint },
      { icon: "🤝", label: "추천인", rule: `1명당 +${suggest.unitPoint}점`, qty: `${suggest.quantity}명`, score: suggest.acquiredPoint },
      { icon: "🔗", label: "SNS", rule: `등록 시 +${sns.unitPoint}점`, qty: data.hasSns ? "O" : "X", score: sns.acquiredPoint },
      { icon: "🏆", label: "수상 경력", rule: `1개당 +${awards.unitPoint}점`, qty: `${awards.quantity}개`, score: awards.acquiredPoint },
      { icon: "💬", label: "대표 한마디", rule: `작성 시 +${oneIntro.unitPoint}점`, qty: data.hasOneIntroduction ? "O" : "X", score: oneIntro.acquiredPoint },
      { icon: "📝", label: "자기소개 본문", rule: `작성 시 +${intro.unitPoint}점`, qty: data.hasIntroduction ? "O" : "X", score: intro.acquiredPoint },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="TrustScore-container">
        <div className="RecommenderForm-description">신뢰 점수를 불러오는 중입니다…</div>
        <div className="TrustScore-bar-wrapper">
          <div className="TrustScore-bar-background">
            <div className="TrustScore-bar-foreground" style={{ width: `0%` }} />
          </div>
          <div className="TrustScore-score-display">-- 점</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="TrustScore-container">
        <div className="RecommenderForm-description">
          신뢰 점수를 불러오는 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.
        </div>
        <pre className="TrustScore-error" style={{ whiteSpace: "pre-wrap" }}>
          {String(error)}
        </pre>
      </div>
    );
  }

  return (
    <div className="TrustScore-container">
      <div className="RecommenderForm-description">
        신뢰 점수는 <strong>자격증, 수상경력, 대표 한마디, 자기소개 본문, SNS, 추천인</strong> 등으로 점수가 매겨지며{" "}
        <strong>판매자에게 점수가 제공됩니다.</strong> 판매자에게 <strong>신뢰</strong> 할 수 있는 사람이라는 것을 증명해줄 수 있는 점수 입니다.
      </div>

      <div className="TrustScore-title">신뢰 점수</div>

      <div className="TrustScore-bar-wrapper">
        <div className="TrustScore-bar-background">
          <div className="TrustScore-bar-foreground" style={{ width: `${total}%` }} />
        </div>
        <div className="TrustScore-score-display">{Number(data?.total) || 0} 점</div>
      </div>

      <table className="TrustScore-table">
        <thead>
          <tr>
            <th>항목</th>
            <th>기준</th>
            <th>수량/여부</th>
            <th>획득 점수</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="label">
                <span className="icon">{r.icon}</span>
                {r.label}
              </td>
              <td>{r.rule}</td>
              <td>{r.qty}</td>
              <td className="score">{r.score}점</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
