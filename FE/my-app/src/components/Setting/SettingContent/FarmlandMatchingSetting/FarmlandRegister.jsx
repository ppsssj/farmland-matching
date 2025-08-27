import React from "react";
import "./FarmlandRegister.css";

export default function LandRegisterForm() {
  return (
    <div className="FarmlandResister-container">
      {/* 왼쪽 섹션 */}
      
      <div className="FarmlandResister-section">
        <h3>기본 정보</h3>
        <label>소유자 정보</label>
        <div className="FarmlandResister-row">
          <input type="text" placeholder="성" />
          <input type="text" placeholder="이름" />
        </div>
        <input type="text" placeholder="거주지 주소" />
        <label className="FarmlandResister-checkbox-row">
          <input type="checkbox" />
          내 프로필
        </label>

        <h4>농지 위치</h4>
        <input type="text" placeholder="주소" />
        <input type="text" placeholder="지번 또는 도로명 주소" />
        <div className="FarmlandResister-gray-map">지도 표시 영역</div>
        <label className="FarmlandResister-checkbox-row">
          <input type="checkbox" />
          기록 등록 여부
        </label>

        <h4>면적 및 형태</h4>
        <input type="text" placeholder="총 면적 (㎡)" />
        <div className="FarmlandResister-row">
          <select>
            <option>지형</option>
            <option>토지</option>
            <option>기타</option>
            <option>등등</option>
          </select>
          <select>
            <option>지목</option>
            <option>토지</option>
            <option>기타</option>
            <option>등등</option>
          </select>
        </div>

        <h4>지목 및 토지 용도</h4>
        <input type="text" placeholder="총 면적 (㎡)" />
      </div>

      {/* 중간 수직 구분선 */}
      <div className="FarmlandResister-vertical-divider" />

      {/* 가운데 섹션 */}
      <div className="FarmlandResister-form-section">
        <h3>농지 상세 형태</h3>
        <div className="FarmlandResister-row">
          <select>
            <option>토양 상태</option>
            <option>토지</option>
            <option>기타</option>
            <option>등등</option>
          </select>
          <select>
            <option>토질</option>
            <option>토지</option>
            <option>기타</option>
            <option>등등</option>
          </select>
        </div>
        <input type="text" placeholder="직전 재배 이력" />

        <h4>기반 시설</h4>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 농업용수</label>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 전기 유무</label>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 농기계 접근 가능 여부</label>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 창고/비닐하우스/헛간</label>
        <input type="text" placeholder="기타 기반 시설 (직접 입력)" />

        <h4>접근성</h4>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 도로 인접 여부</label>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 포장도로 여부</label>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 대중교통 접근성</label>
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 차량 진입 가능 여부</label>

        <h4>사연/에피소드</h4>
        <textarea placeholder="내용을 입력하세요" rows={5}></textarea>
      </div>

      {/* 중간 수직 구분선 */}
      <div className="FarmlandResister-vertical-divider" />

      {/* 오른쪽 섹션 */}
      <div className="FarmlandResister-form-section">
        <h3>희망 조건 (거래 관련)</h3>
        <div className="FarmlandResister-row">
          <select>
            <option>거래 유형</option>
            <option>토지</option>
            <option>기타</option>
            <option>등등</option>
          </select>
          <select>
            <option>우선 매칭 대상</option>
            <option>토지</option>
            <option>기타</option>
            <option>등등</option>
          </select>
        </div>
        <input type="text" placeholder="희망 금액" />
        <input type="text" placeholder="매도 희망 시기" />
        <label className="FarmlandResister-checkbox-row"><input type="checkbox" /> 공동 경작 가능</label>

        <h4>사진 첨부 (최대 5장)</h4>
        <div className="FarmlandResister-image-box">사진 업로드 영역</div>

        <h4>기타 첨부 서류</h4>
        <input type="text" placeholder="등록 서류" />
        <input type="text" placeholder="등기부등본 업로드" />
        <input type="text" placeholder="토지대장 업로드" />
        <input type="text" placeholder="농지원부/경영체 등록증 업로드" />

        <button className="FarmlandResister-submit-btn">등록</button>
      </div>
    </div>
  );
}
