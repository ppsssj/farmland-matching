import React, { useState } from "react";
import "./AlertSetting.css";

export default function AlertSettings() {
  const [matchAlert, setMatchAlert] = useState("on");
  const [scheduleAlert, setScheduleAlert] = useState("on");
  const [secondMatchAlert, setSecondMatchAlert] = useState("off");

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [webPushEnabled, setWebPushEnabled] = useState(true);

  return (
    <div className="AlertSetting-container full-width">
      <h2 className="AlertSetting-section-title">매칭 관련 알림</h2>

      <div className="AlertSetting-alert-row">
        <div className="AlertSetting-toggle-group">
          <button
            className={`AlertSetting-btn ${matchAlert === "on" ? "on" : "off"}`}
            onClick={() => setMatchAlert("on")}
          >
            허용
          </button>
          <button
            className={`AlertSetting-btn ${matchAlert === "off" ? "red" : "off"}`}
            onClick={() => setMatchAlert("off")}
          >
            미허용
          </button>
        </div>
        <span className="AlertSetting-alert-text">내 농지에 매칭 요청이 올 때 알림 받기</span>
      </div>

      <div className="AlertSetting-alert-row">
        <div className="AlertSetting-toggle-group">
          <button
            className={`AlertSetting-btn ${scheduleAlert === "on" ? "on" : "off"}`}
            onClick={() => setScheduleAlert("on")}
          >
            허용
          </button>
          <button
            className={`AlertSetting-btn ${scheduleAlert === "off" ? "red" : "off"}`}
            onClick={() => setScheduleAlert("off")}
          >
            미허용
          </button>
        </div>
        <span className="AlertSetting-alert-text">면담 일정 하루 전 알림 받기</span>
      </div>

      <div className="AlertSetting-alert-row">
        <div className="AlertSetting-toggle-group">
          <button
            className={`AlertSetting-btn ${secondMatchAlert === "on" ? "on" : "off"}`}
            onClick={() => setSecondMatchAlert("on")}
          >
            허용
          </button>
          <button
            className={`AlertSetting-btn ${secondMatchAlert === "off" ? "red" : "off"}`}
            onClick={() => setSecondMatchAlert("off")}
          >
            미허용
          </button>
        </div>
        <span className="AlertSetting-alert-text">내 농지에 매칭 요청이 올 때 알림 받기</span>
      </div>

      <h2 className="AlertSetting-section-title">알림 수신 방법</h2>

      <div className="AlertSetting-receive-methods">
        <div className="AlertSetting-method">
          <button
            className={`AlertSetting-btn ${emailEnabled ? "on" : "red"}`}
            onClick={() => setEmailEnabled(!emailEnabled)}
          >
            이메일
          </button>
        </div>
        <div className="AlertSetting-method">
          <button
            className={`AlertSetting-btn ${smsEnabled ? "on" : "red"}`}
            onClick={() => setSmsEnabled(!smsEnabled)}
          >
            문자메시지
          </button>
        </div>
        <div className="AlertSetting-method">
          <button
            className={`AlertSetting-btn ${webPushEnabled ? "on" : "red"}`}
            onClick={() => setWebPushEnabled(!webPushEnabled)}
          >
            웹 푸시
          </button>
        </div>
      </div>

      <div className="AlertSetting-error-messages">
        <p>메일 인증 완료.</p>
        <p>전화번호 인증 완료.</p>
      </div>
    </div>
  );
}
