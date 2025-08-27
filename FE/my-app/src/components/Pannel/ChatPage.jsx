// src/components/Pannel/ChatPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./ChatPage.css";

/**
 * props:
 * - landId, buyerId, landName, ownerName
 * - onClose(): 오버레이 닫기
 */
export default function ChatPage({ landId, buyerId, landName, ownerName, onClose }) {
  const listRef = useRef(null);
  const cardRef = useRef(null);

  // 데모 메시지
  const [messages, setMessages] = useState([
    { id: 1, from: "owner", text: `안녕하세요. ${ownerName || "판매자"}입니다.`, time: ts() },
    { id: 2, from: "buyer", text: "안녕하세요! 농지 관련해서 문의드립니다.", time: ts() },
  ]);
  const [input, setInput] = useState("");

  // ── 드래그 상태 ─────────────────────────────────────────────
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ left: null, top: null }); // null이면 중앙정렬 CSS 사용
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  const title = useMemo(() => {
    const ln = landName || "알 수 없는 농지";
    const ow = ownerName || "판매자";
    return `${ln} | ${ow}`;
  }, [landName, ownerName]);

  // 메시지 추가 시 하단 고정
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // ESC로 닫기 + 포커스 트랩 시작점
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 오픈 시 카드 중앙 배치(픽셀 좌표 초기화)
  useEffect(() => {
    // pos가 null이면 CSS 중앙정렬 사용
    if (pos.left == null || pos.top == null) return;

    // 윈도우 리사이즈 시 화면 밖으로 나가면 보정
    const onResize = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const maxLeft = window.innerWidth - rect.width - 8;
      const maxTop = window.innerHeight - rect.height - 8;
      setPos((p) => ({
        left: Math.min(Math.max(8, p.left), Math.max(8, maxLeft)),
        top: Math.min(Math.max(8, p.top), Math.max(8, maxTop)),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos.left, pos.top]);

  function ts() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const send = () => {
    const v = input.trim();
    if (!v) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "buyer", text: v, time: ts() },
    ]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ── 드래그 핸들러 ──────────────────────────────────────────
  const beginDrag = (clientX, clientY) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // 처음 드래그 시작 시, CSS 중앙정렬에서 픽셀 좌표로 전환
    const baseLeft =
      pos.left == null ? Math.round((window.innerWidth - rect.width) / 2) : pos.left;
    const baseTop =
      pos.top == null ? Math.round((window.innerHeight - rect.height) / 2) : pos.top;

    startRef.current = { x: clientX, y: clientY, left: baseLeft, top: baseTop };
    setDragging(true);
    // 픽셀 좌표 모드로 전환
    setPos({ left: baseLeft, top: baseTop });
  };

  const onMouseDownHeader = (e) => {
    // 좌클릭만
    if (e.button !== 0) return;
    e.preventDefault();
    beginDrag(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    moveTo(startRef.current.left + dx, startRef.current.top + dy);
  };
  const onMouseUp = () => {
    setDragging(false);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  // 터치 지원
  const onTouchStartHeader = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    beginDrag(t.clientX, t.clientY);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
  };
  const onTouchMove = (e) => {
    if (!dragging) return;
    const t = e.touches?.[0];
    if (!t) return;
    e.preventDefault();
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    moveTo(startRef.current.left + dx, startRef.current.top + dy);
  };
  const onTouchEnd = () => {
    setDragging(false);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
  };

  const moveTo = (left, top) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - 8;
    const maxTop = window.innerHeight - rect.height - 8;
    setPos({
      left: Math.min(Math.max(8, left), Math.max(8, maxLeft)),
      top: Math.min(Math.max(8, top), Math.max(8, maxTop)),
    });
  };

  // 스타일: pos가 null이면 중앙정렬(translate), 아니면 absolute 좌표
  const cardStyle =
    pos.left == null || pos.top == null
      ? undefined
      : { position: "absolute", left: pos.left, top: pos.top, transform: "none" };

  return (
    <div className="ChatOverlay" role="dialog" aria-modal="true">
      <div
        className={`ChatCard ${dragging ? "is-dragging" : ""}`}
        ref={cardRef}
        style={cardStyle}
        aria-label="채팅"
      >
        {/* 헤더: 드래그 핸들 */}
        <header
          className="ChatHeader"
          onMouseDown={onMouseDownHeader}
          onTouchStart={onTouchStartHeader}
        >
          <div className="ChatHeader-Title">{title}</div>
          <div className="ChatHeader-Meta">LAND #{landId ?? "-"} · BUYER #{buyerId ?? "-"}</div>
          <button className="ChatHeader-Close" onClick={onClose} title="닫기">✕</button>
        </header>

        {/* 본문 (리스트) */}
        <main className="ChatBody">
          <div className="ChatList" ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`ChatRow ${m.from === "buyer" ? "me" : "them"}`}
              >
                {m.from === "owner" && (
                  <div className="ChatAvatar" aria-hidden>
                    {(ownerName || "판")[0]}
                  </div>
                )}
                <div className="ChatBubble">
                  <div className="ChatText">{m.text}</div>
                  <div className="ChatTime">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* 입력 영역 */}
        <footer className="ChatComposer">
          <textarea
            className="ChatInput"
            placeholder="메시지를 입력하세요…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button className="ChatSend" onClick={send}>전송</button>
        </footer>
      </div>
    </div>
  );
}
