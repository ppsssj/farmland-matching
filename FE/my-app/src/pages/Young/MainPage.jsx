// MainPage.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Pannel/Header";
import LeftPanel from "../../components/Pannel/LeftPanel";
import RightPanel from "../../components/Pannel/RightPanel";
import BottomPanel from "../../components/Pannel/BottomPanel";
import MapView from "../../components/Map/MapView";
import ChatPage from "../../components/Pannel/ChatPage"; // ⬅️ 오버레이로 띄울 채팅 페이지
// import { fetchFarmlands } from "../../api/farmland"; // 직접 fetch로 대체
import { getYoungUserData } from "../../api/YoungUser";
import ProfileModal from "../../components/Pannel/ProfileModal";
import API_BASE from "../../config/apiBase";

const BUYER_ID_DEFAULT = 1;
const TOPK_DEFAULT = 5;

function MainPage() {
  const [farmlands, setFarmlands] = useState([]);
  const [selectedFarmland, setSelectedFarmland] = useState(null);
  const [map, setMap] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [youngUser, setYoungUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // 채팅 오버레이 상태
  const [showChat, setShowChat] = useState(false);
  const [chatProps, setChatProps] = useState(null); // { landId, buyerId, landName, ownerName }

  // AI 추천 모드 상태/로딩
  const [aiMode, setAiMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // 서버에서 받아온 리스트에 aiMatchScore를 끌어올림(_raw.aiMatchScore → aiMatchScore)
  // ⚠️ null은 null로 보존 (0으로 강제 변환하지 않음)
  const attachAiScore = (rows) =>
    (rows || []).map((f) => {
      const raw = f?.aiMatchScore ?? f?._raw?.aiMatchScore;
      let score = null;
      if (raw !== null && raw !== undefined && raw !== "") {
        const n = Number(raw);
        score = Number.isFinite(n) ? n : null;
      }
      const landId = f?.id ?? f?._raw?.landId;
      console.log("[attachAiScore] landId:", landId, "score:", score);
      return { ...f, aiMatchScore: score };
    });

  // ✅ API_BASE를 사용해 절대 경로로 호출 + JSON 안전 체크
  const loadFarmlands = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/farmland`;
      console.log("[loadFarmlands] GET", url, "요청 시작");

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "(no body)");
        console.error("[loadFarmlands] !res.ok", res.status, text.slice(0, 300));
        throw new Error(`GET /farmland -> ${res.status}`);
      }

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("application/json")) {
        const text = await res.text().catch(() => "(no body)");
        console.error(
          "[loadFarmlands] invalid content-type:",
          ct,
          text.slice(0, 300)
        );
        throw new Error("Response is not valid JSON");
      }

      const rows = await res.json();
      const withScore = attachAiScore(rows);
      console.log("[loadFarmlands] 응답 개수:", withScore.length);
      setFarmlands(withScore);
    } catch (e) {
      console.error("[loadFarmlands] error:", e);
      setFarmlands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadFarmlands();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        console.log("[MainPage] getYoungUserData 호출");
        const list = await getYoungUserData();
        setYoungUser(list?.[0] || null);
      } catch (e) {
        console.error("[MainPage] getYoungUserData error:", e);
      } finally {
        setUserLoading(false);
      }
    })();
  }, []);

  // 🔵 AI 버튼: 군집화/점수계산 트리거 → 재조회 → AI 모드 ON
  const handleAiRecommend = async () => {
    const url = `${API_BASE}/farmland/aiMatch`;
    const payload = { buyerId: BUYER_ID_DEFAULT, topK: TOPK_DEFAULT };
    const startedAt = performance.now();

    console.log("[AI] POST 요청 시작:", url, "payload:", payload);

    setAiLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const durationMs = Math.round(performance.now() - startedAt);
      const requestId =
        res.headers.get("x-request-id") ||
        res.headers.get("X-Request-Id") ||
        res.headers.get("x-correlation-id") ||
        null;

      console.log("[AI] 응답 수신", {
        status: res.status,
        statusText: res.statusText,
        durationMs,
        requestId,
      });

      // 응답 본문 로깅: JSON 시도 → 실패 시 text
      let responseBody = null;
      try {
        const clone = res.clone();
        responseBody = await clone.json();
      } catch {
        try {
          responseBody = await res.text();
        } catch {
          responseBody = "<no body>";
        }
      }
      console.log("[AI] 응답 본문:", responseBody);

      if (!res.ok) {
        const msg =
          (responseBody && (responseBody.message || responseBody.error)) ||
          (typeof responseBody === "string"
            ? responseBody.slice(0, 300)
            : "") ||
          "원인 미상";
        alert(
          `AI 추천 호출 실패 (status ${res.status})\n메시지: ${msg}\n자세한 로그는 콘솔을 확인하세요.`
        );
        return;
      }

      // 성공: 백엔드가 DB에 점수를 반영했다고 가정 → 재조회
      await loadFarmlands();
      setAiMode(true);
      setSelectedFarmland(null);
      console.log("[AI] 추천 모드 ON");
    } catch (e) {
      console.error("[AI] fetch 예외:", e);
      alert("AI 추천 호출 실패 (네트워크/예외). 콘솔을 확인하세요.");
    } finally {
      setAiLoading(false);
    }
  };

  // 🔙 AI 추천 해제
  const exitAiMode = async () => {
    console.log("[AI] 추천 모드 해제");
    setAiMode(false);
    await loadFarmlands(); // 원본 순서/목록으로 복귀
    setSelectedFarmland(null);
  };

  // 🔎 LeftPanel로 전달할 표시용 목록 계산
  const displayFarmlands = useMemo(() => {
    if (!aiMode) return farmlands;

    // 필터 제거: null/0 점수도 포함
    // 정렬: 점수 있는 항목(숫자) → 점수 없는 항목(null) 순
    const sorted = [...farmlands].sort((a, b) => {
      const as = a.aiMatchScore;
      const bs = b.aiMatchScore;
      const aNull = as == null;
      const bNull = bs == null;
      if (aNull && bNull) return 0;
      if (aNull) return 1; // a가 null이면 뒤로
      if (bNull) return -1; // b가 null이면 뒤로
      return bs - as; // 숫자 내림차순
    });

    console.log(
      "[displayFarmlands] AI 모드 목록:",
      sorted.map((f) => ({ id: f.id, score: f.aiMatchScore }))
    );

    return sorted;
  }, [aiMode, farmlands]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 중앙 지도는 항상 유지 */}
      <MapView
        farmlands={displayFarmlands}
        onSelect={setSelectedFarmland}
        onMapLoad={setMap}
        selectedFarm={selectedFarmland}
      />

      {/* 상단 헤더 */}
      <Header onOpenProfile={() => setShowProfile(true)} />

      {/* 좌/우/하단 패널 */}
      <LeftPanel
        farmlands={displayFarmlands}
        onSelect={setSelectedFarmland}
        // AI 관련
        onAiRecommend={handleAiRecommend}
        onExitAiMode={exitAiMode}
        aiMode={aiMode}
        aiLoading={aiLoading}
        loading={loading}
      />

      <RightPanel
        selected={selectedFarmland}
        onClose={() => setSelectedFarmland(null)}
        // 채팅 버튼 → 중앙 오버레이 ChatPage
        onOpenChat={(props) => {
          setChatProps(props);
          setShowChat(true);
        }}
      />

      <BottomPanel map={map} />

      {/* 프로필 모달 */}
      {showProfile && (
        <ProfileModal
          user={youngUser}
          loading={userLoading}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* 채팅 오버레이 */}
      {showChat && chatProps && (
        <ChatPage {...chatProps} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}

export default MainPage;
