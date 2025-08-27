function Step7_TradeDocs({ data, updateData, onBack, onSubmit }) {
  const handlePhotos = (e) => {
    const file = e.target.files?.[0]; // 첫 번째 파일만
    if (file) {
      updateData("photos", [file]); // 배열 형태로 1개만 저장
    } else {
      updateData("photos", []);
    }
  };

  const handleFile = (key) => (e) => {
    updateData(key, e.target.files?.[0] || null);
  };

  const canSubmit = data.tradeType && data.wishWhen;

  return (
    <div className="FarmlandRegistration-Step">
      <h2>Step 6. 거래 조건 & 자료 첨부</h2>

      <label>거래 형태</label>
      <select
        className="FarmlandRegistration-InputField"
        value={data.tradeType}
        onChange={(e) => updateData("tradeType", e.target.value)}
      >
        <option value="">선택</option>
        <option value="매매">매매</option>
        <option value="임대">임대</option>
        <option value="상관없음">상관없음</option>
      </select>

      <label>우선 매칭 대상 (선택)</label>
      <input
        className="FarmlandRegistration-InputField"
        placeholder="예: 배 재배 경험자, 인근 거주자"
        value={data.preferMatch}
        onChange={(e) => updateData("preferMatch", e.target.value)}
      />

      <label>희망 금액 (선택)</label>
      <input
        className="FarmlandRegistration-InputField"
        type="number"
        placeholder="예: 13376000"
        value={data.wishPrice}
        onChange={(e) => updateData("wishPrice", e.target.value)}
      />

      <label>매도 희망 시기</label>
      <input
        className="FarmlandRegistration-InputField"
        placeholder="예: 즉시 / 3개월 이내 / 상관없음"
        value={data.wishWhen}
        onChange={(e) => updateData("wishWhen", e.target.value)}
      />

      <div className="FarmlandRegistration-Divider" />

      <label>사진 첨부 (1장)</label>
      <input type="file" accept="image/*" onChange={handlePhotos} />

      <label>등록 사유 (선택)</label>
      <textarea
        className="FarmlandRegistration-InputField"
        rows={3}
        placeholder="이 농지를 등록하게 된 사유를 적어주세요"
        value={data.reason}
        onChange={(e) => updateData("reason", e.target.value)}
      />

      <label>어르신 한마디 (선택)</label>
      <textarea
        className="FarmlandRegistration-InputField"
        rows={3}
        placeholder="마을 사람들과 함께 일구던 밭이에요..."
        value={data.comment}
        onChange={(e) => updateData("comment", e.target.value)}
      />

      <div className="FarmlandRegistration-Divider" />

      <div className="FarmlandRegistration-FieldGroup">
        <div className="FarmlandRegistration-FieldLabel">
          서류 업로드 (선택)
        </div>
        <div className="FarmlandRegistration-Row">
          <div className="FarmlandRegistration-Col">
            <div>등기부등본</div>
            <input type="file" onChange={handleFile("docDeung")} />
          </div>
          <div className="FarmlandRegistration-Col">
            <div>토지대장</div>
            <input type="file" onChange={handleFile("docToji")} />
          </div>
          <div className="FarmlandRegistration-Col">
            <div>농지원부/경영체 등록증</div>
            <input type="file" onChange={handleFile("docNong")} />
          </div>
        </div>
      </div>
      <div className="FarmlandRegistration-ButtonGroup">
        <div className="FarmlandRegistration-Button" onClick={onBack}>
          이전
        </div>
        <div
          className="FarmlandRegistration-Button"
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          등록 완료
        </div>
      </div>
    </div>
  );
}

export default Step7_TradeDocs;
