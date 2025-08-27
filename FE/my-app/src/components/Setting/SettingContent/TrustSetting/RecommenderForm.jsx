// src/components/Setting/SettingContent/TrustSetting/RecommenderForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./RecommenderForm.css";
import API_BASE from "../../../../config/apiBase"; // API_BASE 경로 수정

/**
 * props
 * - buyerId: number | string  (필수: 보증인 API에 사용)
 * - token?: string            (선택: 필요시 Authorization)
 * - user / onUserChange?:     (선택: 기존 YoungUser 구조와 동기화가 필요할 때)
 */
export default function RecommenderForm({
  buyerId = 1,
  token,
  user,
  onUserChange,
}) {
  // 상태: suggestId는 내부에만 보관(서버가 부여/구분에 사용), UI에는 표시하지 않음
  // { suggestId?, suggestName, suggestRelationShip, suggestNumber, suggestEmail }
  const [rows, setRows] = useState([
    {
      suggestId: "",
      suggestName: "",
      suggestRelationship: "",
      suggestNumber: "",
      suggestEmail: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---------------- Helpers ----------------
  const buildHeaders = (extra = {}) => {
    const h = { Accept: "application/json", ...extra };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  const sanitize = (r) => ({
    // suggestId는 서버 구분용: 신규이면 "", 수정이면 서버에서 내려준 값 유지
    suggestId: (r.suggestId ?? "").toString().trim(),
    suggestName: (r.suggestName ?? "").trim(),
    suggestRelationship: (r.suggestRelationship ?? "").trim(),
    suggestNumber: (r.suggestNumber ?? "").trim(),
    suggestEmail: (r.suggestEmail ?? "").trim(),
  });

  // 저장 가능 여부:
  // - rows.length === 0 이면 "전체 삭제"를 서버에 반영하기 위해 저장 가능
  // - 그 외에는 한 칸이라도 값이 있으면 저장 가능
  const canSave = useMemo(() => {
    if (rows.length === 0) return true;
    return rows.some((r) =>
      (
        r.suggestName ||
        r.suggestRelationship ||
        r.suggestNumber ||
        r.suggestEmail
      )
        ?.toString()
        .trim()
    );
  }, [rows]);

  // ---------------- GET: 페이지 진입 시 보증인 불러오기 ----------------
  useEffect(() => {
    let aborted = false;
    async function fetchSuggests() {
      setLoading(true);
      setError("");
      try {
        const url = `${API_BASE}/${encodeURIComponent(buyerId)}/suggests`;
        const res = await fetch(url, {
          method: "GET",
          headers: buildHeaders(),
        });

        const text = await res.text();
        const data = (() => {
          try {
            return JSON.parse(text);
          } catch {
            return text;
          }
        })();

        if (!res.ok) {
          throw new Error(
            typeof data === "string"
              ? data
              : data?.message || "보증인 조회 실패"
          );
        }

        // 서버가 배열로 내려준다고 가정
        const list = Array.isArray(data) ? data : [];
        const mapped = list.map((it) => ({
          suggestId: (it.suggestId ?? "").toString(), // 내부 보관(표시X)
          suggestName: it.suggestName ?? "",
          suggestRelationship: it.suggestRelationship ?? "",
          suggestNumber: it.suggestNumber ?? "",
          suggestEmail: it.suggestEmail ?? "",
        }));

        if (!aborted) {
          setRows(
            mapped.length > 0
              ? mapped
              : [
                  {
                    suggestId: "",
                    suggestName: "",
                    suggestRelationship: "",
                    suggestNumber: "",
                    suggestEmail: "",
                  },
                ]
          );
        }

        // (선택) YoungUser 연동
        if (!aborted && user && onUserChange) {
          const toMini = (r) => ({
            name: r.suggestName,
            rel: r.suggestRelationship,
            phone: r.suggestNumber,
            mail: r.suggestEmail,
          });
          const updated = {
            ...user,
            detail: {
              ...user.detail,
              recommendersList: (mapped.length > 0 ? mapped : []).map(toMini),
              recommand1: mapped[0] ? toMini(mapped[0]) : undefined,
              recommand2: mapped[1] ? toMini(mapped[1]) : undefined,
              recommand3: mapped[2] ? toMini(mapped[2]) : undefined,
            },
          };
          onUserChange?.(updated);
        }
      } catch (e) {
        if (!aborted) setError(e.message || String(e));
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    fetchSuggests();
    return () => {
      aborted = true;
    };
  }, [buyerId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------- 행 조작 ----------------
  const handleAddRow = () =>
    setRows((prev) => [
      ...prev,
      {
        suggestId: "",
        suggestName: "",
        suggestRelationship: "",
        suggestNumber: "",
        suggestEmail: "",
      },
    ]);

  const handleChange = (index, field, value) =>
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });

  // ✅ 삭제: 프론트에서만 즉시 제거(서버 반영은 "저장" 시)
  const handleRemoveRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  // ---------------- POST: 저장(등록/수정/전체 삭제 반영) ----------------
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // 공백 행 제거 & 트림
      const filtered = rows.filter((r) =>
        (
          r.suggestName ||
          r.suggestRelationship ||
          r.suggestNumber ||
          r.suggestEmail
        )
          ?.toString()
          .trim()
      );
      const payload = filtered.map(sanitize);

      const url = `${API_BASE}/${encodeURIComponent(buyerId)}/suggest-save`;
      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload), // 빈 배열이면 서버에서 "전체 삭제"로 처리되도록 백엔드 규칙 가정
      });

      const text = await res.text();
      const data = (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })();

      if (!res.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "보증인 저장/수정 실패"
        );
      }

      // 서버가 갱신된 전체 목록을 반환한다면 그대로 반영
      const updatedList = Array.isArray(data) ? data : payload;
      setRows(
        (updatedList.length > 0 ? updatedList : []).map((it) => ({
          suggestId: (it.suggestId ?? "").toString(),
          suggestName: it.suggestName ?? "",
          suggestRelationship: it.suggestRelationship ?? "",
          suggestNumber: it.suggestNumber ?? "",
          suggestEmail: it.suggestEmail ?? "",
        }))
      );

      // (선택) YoungUser 동기화
      if (user && onUserChange) {
        const toMini = (r) => ({
          name: r.suggestName,
          rel: r.suggestRelationship,
          phone: r.suggestNumber,
          mail: r.suggestEmail,
        });
        const finalList = Array.isArray(updatedList) ? updatedList : payload;
        const updatedUser = {
          ...user,
          detail: {
            ...user.detail,
            recommendersList: finalList.map(toMini),
            recommand1: finalList[0] ? toMini(finalList[0]) : undefined,
            recommand2: finalList[1] ? toMini(finalList[1]) : undefined,
            recommand3: finalList[2] ? toMini(finalList[2]) : undefined,
          },
        };
        onUserChange?.(updatedUser);
      }

      alert("보증인 정보가 저장되었습니다. (삭제/수정 포함)");
      console.log("✅ Saved suggest list:", updatedList);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="RecommenderForm-container">
      <div className="RecommenderForm-title">보증인 등록</div>
      <div className="RecommenderForm-description">
        추천인은 해당 청년이{" "}
        <strong>얼마나 성실하고 농업에 관심이 있는지</strong>를 신뢰 기반으로
        증명해줄 수 있는 분입니다.
        <br />
        저장 후 추천인에게 <strong>메일 또는 문자로 인증 요청</strong>을 보낼 수
        있습니다.
      </div>
      {loading && <div style={{ margin: "0.5rem 0" }}>불러오는 중...</div>}
      {error && (
        <div style={{ margin: "0.5rem 0", color: "crimson" }}>⚠️ {error}</div>
      )}

      {rows.length === 0 && (
        <div className="RecommenderForm-empty">
          현재 보증인이 없습니다.{" "}
          <button
            className="RecommenderForm-add-inline"
            onClick={handleAddRow}
            type="button"
          >
            추가
          </button>
          하거나 바로 <b>저장</b>을 눌러 전체 삭제를 반영할 수 있어요.
        </div>
      )}

      {rows.map((row, index) => (
        <div className="RecommenderForm-row" key={index}>
          {/* suggestId는 내부 보관만 하고 UI에는 노출하지 않습니다. */}
          <input
            className="RecommenderForm-input name"
            placeholder="이름"
            value={row.suggestName}
            onChange={(e) => handleChange(index, "suggestName", e.target.value)}
          />
          <input
            className="RecommenderForm-input relation"
            placeholder="관계 (예: 지도교수, 이장)"
            value={row.suggestRelationship}
            onChange={(e) =>
              handleChange(index, "suggestRelationship", e.target.value)
            }
          />
          <input
            className="RecommenderForm-input phone"
            placeholder="전화번호"
            value={row.suggestNumber}
            onChange={(e) =>
              handleChange(index, "suggestNumber", e.target.value)
            }
          />
          <input
            className="RecommenderForm-input mail"
            placeholder="메일"
            value={row.suggestEmail}
            onChange={(e) =>
              handleChange(index, "suggestEmail", e.target.value)
            }
          />

          {/* ✅ 행 삭제 버튼 (프론트 상태만 제거) */}
          <button
            className="RecommenderForm-remove-line"
            onClick={() => handleRemoveRow(index)}
            title="이 행 삭제"
            aria-label="이 행 삭제"
            type="button"
          >
            삭제
          </button>
        </div>
      ))}

      <div className="RecommenderForm-add-button-wrapper">
        <button
          className="RecommenderForm-add-btn"
          onClick={handleAddRow}
          type="button"
        >
          +
        </button>
      </div>

      {/* 하단 액션 */}
      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <button
          className="RecommenderForm-add-btn"
          style={{
            width: "auto",
            height: "auto",
            borderRadius: "10px",
            padding: "0.6rem 1rem",
            opacity: saving ? 0.7 : 1,
          }}
          disabled={saving || loading || !canSave}
          onClick={handleSave}
          title={
            rows.length === 0
              ? "현재 목록(빈 목록)을 서버에 반영합니다."
              : "보증인 저장"
          }
          type="button"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
