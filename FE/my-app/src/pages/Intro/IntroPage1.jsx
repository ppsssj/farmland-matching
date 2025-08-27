/*시네마틱 웹 */
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./IntroPage1.css";
import { useNavigate } from "react-router-dom";

function IntroPage1() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // 여러 번 애니메이션 실행 허용
      mirror: true, // 위로 스크롤 시에도 다시 실행
    });
  }, []);

  return (
    <div className="intro-wrapper">
      {/* Section 1: Hero */}
      <section className="intro-section hero" data-aos="fade-up">
        <h1>당신의 땅, 이어지다</h1>
        <p>
          고령 농업인의 귀한 땅을 청년 농부에게 안전하게 이어주는 <br />
          대한민국 최초의 신뢰 기반 농지 매칭 플랫폼
        </p>
        <button onClick={() => navigate("/main")}>시작하기</button>
      </section>

      {/* Section 2: 고령 농부 소개 */}
      <section className="intro-section split" data-aos="fade-left">
        <img src="logo.png" alt="고령 농부" className="intro-img" />
        <div className="intro-text">
          <h2>농지를 맡기고 싶은 고령 농업인</h2>
          <p>
            농지를 계속 관리하기 어려운 상황에서,
            <br />
            믿을 수 있는 청년 농부에게 안전하게 농지를 맡기고 싶으신가요?
            <br />
            신뢰도 기반 매칭과 안전한 서류 확인으로 걱정을 덜어드립니다.
          </p>
        </div>
      </section>

      {/* Section 3: 청년 농부 소개 */}
      <section className="intro-section split reverse" data-aos="fade-right">
        <div className="intro-text">
          <h2>농지를 찾고 있는 청년 농부</h2>
          <p>
            땅을 구하기 어려운 청년 농부를 위해,
            <br />
            AI가 예상 수익을 분석하고 적합한 땅을 추천해드립니다.
            <br />
            이제, 안전하게 내 농업의 첫 걸음을 시작해보세요.
          </p>
        </div>
        <img src="logo.png" alt="청년 농부" className="intro-img" />
      </section>

      {/* Section 4: 넷플릭스형 기능 소개 */}
      <section className="intro-section slider-section" data-aos="fade-up">
        <h2>우리가 제공하는 주요 기능</h2>
        <div className="slider-container">
          <div className="slider-card">
            <span role="img" aria-label="AI">
              📊
            </span>
            <h3>AI 수익 예측</h3>
            <p>농지 기반 데이터로 연간 예상 수익을 분석해 드립니다.</p>
          </div>
          <div className="slider-card">
            <span role="img" aria-label="Trust">
              🤝
            </span>
            <h3>신뢰 기반 매칭</h3>
            <p>거래 경험, 추천인 정보를 기반으로 안전한 매칭을 제공합니다.</p>
          </div>
          <div className="slider-card">
            <span role="img" aria-label="Docs">
              📄
            </span>
            <h3>서류 확인 기능</h3>
            <p>토지대장, 지적도 등 필수 서류를 간편하게 확인하세요.</p>
          </div>
          <div className="slider-card">
            <span role="img" aria-label="Map">
              📍
            </span>
            <h3>지도 기반 탐색</h3>
            <p>아산시 전 지역 농지를 지도에서 직관적으로 탐색할 수 있어요.</p>
          </div>
          <div className="slider-card">
            <span role="img" aria-label="Realtime">
              ⏱️
            </span>
            <h3>실시간 문의 알림</h3>
            <p>거래 제안이나 문의가 오면 즉시 알림을 받아볼 수 있습니다.</p>
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="intro-section cta" data-aos="fade-up">
        <h2>신뢰로 연결되는 농지 거래</h2>
        <p>
          더 이상 어렵고 불안한 농지 거래는 그만. <br />
          신뢰와 기술로 만들어가는 새로운 농지 매칭의 시작입니다.
        </p>
        <button onClick={() => navigate("/main")}>농지 찾으러 가기 →</button>
      </section>
    </div>
  );
}

export default IntroPage1;
