/*일반적인 웹 */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Pannel/Header";
import "./IntroPage.css";
import ParticleBackground from "../Effect/ParticleBackground.jsx";
import FloatingEmojis from "../Effect/FloatingEmojis.jsx";
import BgmController from "../Effect/BgmController.jsx";
const sellerFeatures = [
  {
    title: "간편한 농지 등록",
    desc: "등기부등본, 지적도 등을 클릭만으로 업로드",
    icon: "/icons/register.png",
  },
  {
    title: "안심 소통 시스템",
    desc: "연락처 노출 없이 초기 대화 가능",
    icon: "/icons/chat.png",
  },
  {
    title: "AI 농업자 추천",
    desc: "내 땅과 어울리는 청년 농부 자동 매칭",
    icon: "/icons/ai.png",
  },
  {
    title: "기본 계약서 자동 생성",
    desc: "자동 문서화 및 출력 기능 제공",
    icon: "/icons/document.png",
  },
  {
    title: "농지 히스토리 소개",
    desc: "내 땅의 이야기를 글/사진으로 등록 가능",
    icon: "/icons/history.png",
  },
  {
    title: "인증 기반 거래",
    desc: "실명/자격 기반 매칭으로 신뢰 보장",
    icon: "/icons/check.png",
  },
];

const buyerFeatures = [
  {
    title: "지도 기반 농지 탐색",
    desc: "지역별로 관심 농지를 시각적으로 탐색",
    icon: "/icons/map.png",
  },
  {
    title: "1년 예상 수익 시뮬레이션",
    desc: "작물 선택 시 수익 확인",
    icon: "/icons/profit.png",
  },
  {
    title: "나의 농업 프로필 등록",
    desc: "자격증, 수료증, 희망 작물 등 입력",
    icon: "/icons/profile.png",
  },
  {
    title: "실명 인증 및 이력 검증",
    desc: "구매자 신뢰도를 위한 인증 시스템",
    icon: "/icons/verify.png",
  },
  {
    title: "판매자에게 질문하기",
    desc: "내조건, 토양, 위치 등 실시간 문의",
    icon: "/icons/question.png",
  },
  {
    title: "맞춤형 농지 추천",
    desc: "나의 조건과 맞는 땅을 자동 추천",
    icon: "/icons/recommend.png",
  },
];

function TypingText({ text, speed = 60, pause = 3000 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (phase === "typing") {
      if (index < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text.charAt(index));
          setIndex(index + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), pause);
      }
    }

    if (phase === "deleting") {
      if (index > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        }, speed / 1.5);
      } else {
        timeout = setTimeout(() => setPhase("typing"), 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, phase, text, speed, pause]);

  return <p className="subtext typing">{displayedText}</p>;
}

function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className="IntroContainer">
      {/*<ParticleBackground /> {/* ✅ 동적 배경 추가 */}
      <FloatingEmojis /> {/* ✅ 떠다니는 이모지 효과 추가 */}
      <BgmController /> {/* ✅ 배경 음악 컨트롤러 추가 */}
      <div className="IntroForeground">
        <div className="IntroHeader">
          <div className="IntroLogo">
            <img src="/logo.png" alt="Logo" className="IntroLogoImage" />
          </div>
          <div className="IntroTitle">밭 내놓으셨어요?밭 볼텼유?밭 팔았당가?밭 팔았나?밭 내논 거야?<br/>밧 팔앙 헙서?밭 팔았슈?밭 내놨나?밭 팔아부렀소?밭 팔았능교?</div>
        </div>
        <div className="IntroContent">
          <div className="Intro-Text">
            <h1>
              농지를 <span className="blue">찾는 이</span>와{" "}
              <span className="blue">맡기고 싶은 이</span>를 잇습니다.
            </h1>
            <TypingText text="[내 손으로 가꾼 농지, 이제는 누군가의 시작이 됩니다.]" />
            <button className="start-button" onClick={() => navigate("/main")}>
              시작하기
            </button>
          </div>
          <div className="Intro-Video">
            <video
              src="/Intro-Video.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // 🎯 핵심!
              }}
            />
          </div>
        </div>

        <div className="FeatureSectionWrapper">
          {/* 판매자 */}
          <div className="KeyFeaturesBox">
            <div className="FeatureHeader">[Feature Section - #01]</div>
            <div className="FeatureTitle">Key Features - 판매자</div>
            <div className="FeatureGrid">
              {sellerFeatures.map((feature, idx) => (
                <div key={idx} className="FeatureCard">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="FeatureIcon"
                  />
                  <div className="FeatureContent">{feature.title}</div>
                  <div className="FeatureExplain">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 구매자 */}
          <div className="KeyFeaturesBox">
            <div className="FeatureHeader">[Feature Section - #02]</div>
            <div className="FeatureTitle">Key Features - 구매자</div>
            <div className="FeatureGrid">
              {buyerFeatures.map((feature, idx) => (
                <div key={idx} className="FeatureCard">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="FeatureIcon"
                  />
                  <div className="FeatureContent">{feature.title}</div>
                  <div className="FeatureExplain">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
