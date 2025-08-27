import React, { useEffect, useState } from "react";
import "./SecuritySetting.css";

export default function SecuritySettings({ user, onChange }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.mail || "");
      setPhone(user.callNumber || "");
    }
  }, [user]);

  const sendEmailVerification = () => {
    console.log("📧 인증 메일 전송:", email);
    alert("인증 메일을 전송했어요.");
  };

  const sendSmsVerification = () => {
    console.log("📱 인증 문자 전송:", phone);
    alert("인증 문자를 전송했어요.");
  };

  const saveEmail = () => {
    const updated = { ...user, mail: email };
    onChange?.(updated);
    setEditingEmail(false);
    alert("메일 주소가 저장되었습니다.");
  };

  const cancelEmail = () => {
    setEmail(user?.mail || "");
    setEditingEmail(false);
  };

  const savePhone = () => {
    const updated = { ...user, callNumber: phone };
    onChange?.(updated);
    setEditingPhone(false);
    alert("전화번호가 저장되었습니다.");
  };

  const cancelPhone = () => {
    setPhone(user?.callNumber || "");
    setEditingPhone(false);
  };

  const handlePasswordChange = () => {
    alert("비밀번호가 변경되었습니다.");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const isPasswordMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <div className="Securitysettings-container">
      {/* 메일 + 전화번호 나란히 */}
      <div className="SecuritySettings-mailtell">
        {/* 메일 */}
        <div className="Securitysettings-section half-width">
          <label className="Securitysettings-label" htmlFor="email">
            메일 확인
          </label>
          <input
            id="email"
            type="email"
            className="Securitysettings-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editingEmail}
          />
          {!editingEmail ? (
            <div className="Securitysettings-button-group">
              <button className="Securitysettings-btn" onClick={sendEmailVerification}>
                메일 전송
              </button>
              <button className="Securitysettings-btn" onClick={() => setEditingEmail(true)}>
                메일 변경
              </button>
            </div>
          ) : (
            <div className="Securitysettings-button-group">
              <button className="Securitysettings-btn" onClick={saveEmail}>
                저장
              </button>
              <button className="Securitysettings-btn" onClick={cancelEmail}>
                취소
              </button>
            </div>
          )}
          <p className="Securitysettings-error-text">
            이메일 인증 완료.
          </p>
        </div>

        {/* 전화번호 */}
        <div className="Securitysettings-section half-width">
          <label className="Securitysettings-label" htmlFor="phone">
            전화번호 확인
          </label>
          <input
            id="phone"
            type="text"
            className="Securitysettings-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editingPhone}
          />
          {!editingPhone ? (
            <div className="Securitysettings-button-group">
              <button className="Securitysettings-btn" onClick={sendSmsVerification}>
                메시지 전송
              </button>
              <button className="Securitysettings-btn" onClick={() => setEditingPhone(true)}>
                전화번호 변경
              </button>
            </div>
          ) : (
            <div className="Securitysettings-button-group">
              <button className="Securitysettings-btn" onClick={savePhone}>
                저장
              </button>
              <button className="Securitysettings-btn" onClick={cancelPhone}>
                취소
              </button>
            </div>
          )}
          <p className="Securitysettings-error-text">
            전화번호 인증 완료.
          </p>
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="Securitysettings-section">
        <label className="Securitysettings-label" htmlFor="old-password">
          비밀번호 변경
        </label>
        <div className="Securitysettings-password-row">
          <input
            id="old-password"
            type="password"
            placeholder="기존 비밀번호 입력"
            className="Securitysettings-input half"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            id="new-password"
            type="password"
            placeholder="새 비밀번호 입력"
            className="Securitysettings-input half"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="Securitysettings-password-row">
          <input
            id="confirm-password"
            type="password"
            placeholder="새 비밀번호 확인"
            className="Securitysettings-input half"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="Securitysettings-changebtn"
            disabled={!isPasswordMatch}
            onClick={handlePasswordChange}
          >
            비밀번호 변경
          </button>
        </div>
        {confirmPassword && (
          <p
            className={
              isPasswordMatch
                ? "Securitysettings-password-match success"
                : "Securitysettings-password-match error"
            }
          >
            {isPasswordMatch
              ? "비밀번호가 동일합니다."
              : "비밀번호가 틀립니다."}
          </p>
        )}
      </div>

      {/* 최근 로그인 기록 */}
      <div className="Securitysettings-login-record">
        <label className="Securitysettings-label">최근 로그인 기록</label>
        <table>
          <tbody>
            <tr>
              <td>2025 - 07 - 29</td>
              <td>16 : 49</td>
              <td>Chrome(Windows)</td>
            </tr>
            <tr>
              <td>2025 - 07 - 28</td>
              <td>12 : 09</td>
              <td>삼성 갤럭시 북 플렉스 (H789-1)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
