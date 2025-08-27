import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./IntroPage2.css";
import FloatingEmojis from "../Effect/FloatingEmojis.jsx";
import BgmController from "../Effect/BgmController.jsx";

const DIALECTS = {
  서울: {
    title: "밭 내놓으셨어요? 밭 팔래요?",
    main: "농지를 찾는 이와 맡기고 싶은 이를 잇습니다.",
    typing: "[내 손으로 가꾼 농지, 이제는 누군가의 시작이 됩니다.]",
  },
  충청도: {
    title: "밭 내놨어유? 밭 팔라고유?",
    main: "논 밭 찾는 사람하고 맡길 사람을 이어유.",
    typing: "[내 손으로 부지런히 일군 밭, 누군가한테 넘겨줄 때 됐슈.]",
  },
  경상도: {
    title: "밭 내놨나예? 팔라꼬예?",
    main: "논 찾는 사람하고 맡기고픈 사람 이어줍니더.",
    typing: "[내가 고생해서 일군 밭, 누군가한테 넘기겠심더.]",
  },
  전라도: {
    title: "밭 내놨당가요? 팔라구요?",
    main: "농지 찾는 이랑, 맡기고픈 이랑 이어불랑께요.",
    typing: "[내 손으로 가꾼 밭이제 누군가한테 넘겨불랑께.]",
  },
  강원도: {
    title: "밭 내놨수다? 팔라구 허요?",
    main: "논밭 찾는 사람하고 맡기고픈 사람 이어주는 거여.",
    typing: "[내가 고생허구 가꾼 밭, 이제는 다른 사람한테 넘길라구 허요.]",
  },
  제주도: {
    title: "밭 내놨수과? 팔암쥬?",
    main: "농사짓을 사람과 맡을 사람 이어줍주.",
    typing: "[내 손으로 키운 밭, 이제 누군가 시작헐 때주.]",
  },
};

const sellerFeatures = [
  {
    title: "간편한 농지 등록",
    desc: "등기부등본, 지적도 등을 클릭만으로 업로드",
    icon: "/icons/seller_Features1.png",
  },
  {
    title: "안심 소통 시스템",
    desc: "연락처 노출 없이 초기 대화 가능",
    icon: "/icons/seller_Features2.png",
  },
  {
    title: "AI 농업자 추천",
    desc: "내 땅과 어울리는 청년 농부 자동 매칭",
    icon: "/icons/seller_Features3.png",
  },
  {
    title: "기본 계약서 자동 생성",
    desc: "자동 문서화 및 출력 기능 제공",
    icon: "/icons/seller_Features4.png",
  },
  {
    title: "농지 히스토리 소개",
    desc: "내 땅의 이야기를 글/사진으로 등록 가능",
    icon: "/icons/seller_Features5.png",
  },
  {
    title: "인증 기반 거래",
    desc: "실명/자격 기반 매칭으로 신뢰 보장",
    icon: "/icons/seller_Features6.png",
  },
];

const buyerFeatures = [
  {
    title: "지도 기반 농지 탐색",
    desc: "지역별로 관심 농지를 시각적으로 탐색",
    icon: "/icons_purchase/purchase_Features1.png",
  },
  {
    title: "1년 예상 수익 시뮬레이션",
    desc: "작물 선택 시 수익 확인",
    icon: "/icons_purchase/purchase_Features2.png",
  },
  {
    title: "나의 농업 프로필 등록",
    desc: "자격증, 수료증, 희망 작물 등 입력",
    icon: "/icons_purchase/purchase_Features3.png",
  },
  {
    title: "실명 인증 및 이력 검증",
    desc: "구매자 신뢰도를 위한 인증 시스템",
    icon: "/icons_purchase/purchase_Features4.png",
  },
  {
    title: "판매자에게 질문하기",
    desc: "내조건, 토양, 위치 등 실시간 문의",
    icon: "/icons_purchase/purchase_Features5.png",
  },
  {
    title: "맞춤형 농지 추천",
    desc: "나의 조건과 맞는 땅을 자동 추천",
    icon: "/icons_purchase/purchase_Features6.png",
  },
];

const userStories = [
  {
    quote: "우리 땅을 이해해주는 사람이 생겼어요.",
    name: "고령 농부 이○○님, 경북 안동",
    detail:
      "오래된 논이라서 찾는 사람이 없을 줄 알았는데, 플랫폼 덕분에 농지의 이력과 위치, 작물 정보까지 자세히 확인할 수 있었고, 이를 바탕으로 관심 가진 청년이 나타났어요. 직접 연락을 주고받으며 이야기 나눌 수 있었고, 결국 마음 놓고 넘길 수 있었죠. 우리 땅에 담긴 정성과 시간이 헛되지 않았다는 걸 느꼈습니다.",
  },
  {
    quote: "매칭도 빠르고, 과정도 투명했어요.",
    name: "중장년 농부 박○○님, 충남 예산",
    detail:
      "처음에는 플랫폼에 내 정보를 올리는 게 망설여졌어요. 하지만 매칭이 이뤄지는 과정에서 문서 확인, 신뢰 점수, 조건 일치 등을 투명하게 보여줘서 신뢰할 수 있었고, 플랫폼 담당자의 도움도 컸습니다. 짧은 시간 안에 성실한 청년 농부를 만나서, 만족스러운 결과로 이어졌어요.",
  },
  {
    quote: "나 같은 초보도 시작할 수 있었어요.",
    name: "귀농 준비자 김○○님, 서울 → 전남 보성",
    detail:
      "귀농을 꿈만 꾸던 시절, 이 플랫폼을 알게 되면서 많은 것이 달라졌어요. 복잡한 농지 정보도 시각적으로 보여주고, 예상 수익 분석도 제공해줘서 결정에 도움이 됐습니다. 인증 서류와 매칭 절차도 처음엔 막막했지만, 안내가 잘 되어 있어 초보인 저도 한 걸음씩 준비할 수 있었어요.",
  },
  {
    quote: "드디어 내 농업의 첫걸음을 뗐습니다.",
    name: "청년 농부 정○○님, 전북 김제",
    detail:
      "귀농을 결심하고 직접 발로 뛰며 땅을 알아보던 중, 이 플랫폼을 통해 매물 정보를 한눈에 볼 수 있었어요. 지도를 통해 원하는 위치를 찾고, 프로필을 충실히 작성했더니 곧바로 추천 매칭이 왔습니다. 현재는 그 땅에서 첫 수확을 준비하고 있어요. 시작을 도와준 이 플랫폼에 정말 감사합니다.",
  },
  {
    quote: "여성도 믿고 시작할 수 있었어요.",
    name: "여성 농부 최○○님, 강원 평창",
    detail:
      "농촌에서 여성 혼자 귀농을 시작한다는 건 큰 용기였어요. 하지만 이 플랫폼은 기본 정보뿐 아니라 안전성, 신뢰 점수, 소통 방식 등 다양한 부분에서 꼼꼼하게 구성되어 있어 불안함을 많이 줄일 수 있었습니다. 지금은 같은 지역 농부들과도 네트워킹하며 잘 적응하고 있어요.",
  },
  {
    quote: "이야기를 듣고 내 땅에 관심을 가져주더라고요.",
    name: "고령 농부 윤○○님, 충북 제천",
    detail:
      "우리 땅에 얽힌 가족 이야기, 농사 지으며 겪은 사연을 사진과 함께 등록했는데, 그걸 보고 한 청년 농부가 연락을 주더군요. '이런 땅을 찾고 있었다'며 진심 어린 메시지를 보냈을 때 정말 뭉클했어요. 이제는 그 청년이 우리 땅을 이어받아 새로운 이야기를 써내려가고 있습니다.",
  },
];

function TypingText({ text, speed = 60, pause = 3000 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState("typing");
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
    } else if (phase === "deleting") {
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

function IntroPage2() {
  const navigate = useNavigate();
  const [dialect, setDialect] = useState("충청도");

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <div className="Intro2Container">
      <FloatingEmojis />
      <BgmController />
      <div className="Intro2Foreground">
        <section className="SectionBlock" data-aos="fade-up">
          <div className="Intro2Background">
            <div className="Intro2Header">
              <img src="/LOGO1.png" alt="Logo" className="Intro2LogoImage" />
              <div className="Intro2Title">{DIALECTS[dialect].title}</div>
            </div>

            <div className="dialect-buttons">
              {Object.keys(DIALECTS).map((region) => (
                <button
                  key={region}
                  onClick={() => setDialect(region)}
                  className={dialect === region ? "active-dialect" : ""}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="Intro2Content">
            <div className="Intro2Text">
              <h1>{DIALECTS[dialect].main}</h1>
              <TypingText text={DIALECTS[dialect].typing} />
              <button
                className="Intro2start-button"
                onClick={() => navigate("/YoungMain")}
              >
                농지를 찾는 청년 / 중장년 농업인
              </button>
              <button
                className="Intro2start-button"
                onClick={() => navigate("/SeniorMain")}
              >
                농지를 맡기고 싶은 고령 농업인
              </button>
            </div>
            <div className="Intro2Video">
              <video
                src="/Intro-Video.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </section>
        <section className="SectionBlock" data-aos="fade-left">
          <div className="Intro2Content">
            <img
              src="/Farmer/OldFarmer.png"
              alt="고령 농부"
              className="Intro2Image"
            />
            <div className="Intro2Text">
              <h2 className="FeatureTitle2">농지를 맡기고 싶은 고령 농업인</h2>
              <p className="FeatureExplain2">
                농지를 계속 관리하기 어려운 상황에서, 믿을 수 있는 청년 농부에게
                <br />
                안전하게 농지를 맡기고 싶으신가요? 이제는 단순한 거래를 넘어,
                <br />
                정성껏 가꿔온 삶의 터전을 같은 마음으로 이어받을 누군가에게 전할
                수 있습니다.
                <br />
                우리는 어르신의 이야기를 듣고, 농지에 담긴 시간과 노력을
                이해하며,
                <br /> 신뢰할 수 있는 청년과의 연결을 도와드립니다.
                <br />
                신뢰도 기반 매칭 시스템과 서류 진위 검증 기술을 통해 복잡하고
                <br />
                불안했던 농지 거래 과정을 간편하고 안전하게 바꿉니다. <br />
                필요한 서류를 등록하면, AI가 자동으로 확인하고 어르신의 조건과
                청년의
                <br />
                자격을 바탕으로 최적의 연결을 추천해드려요.
              </p>
            </div>
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-right">
          <div className="Intro2Content reverse">
            <div className="Intro2Text">
              <h2 className="FeatureTitle2">농지를 찾고 있는 청년 농부</h2>
              <p className="FeatureExplain2">
                땅을 구하기 어려운 청년 농부를 위해, AI가 예상 수익을 분석하고
                적합한 땅을 추천해드립니다.
                <br /> 이제, 안전하게 내 농업의 첫 걸음을 시작해보세요. 경험은
                부족하지만 열정은 가득한 당신을 위해,
                <br />
                복잡한 서류 절차도 간편하게, 신뢰할 수 있는 농지 소유자와 직접
                연결해드립니다.
                <br /> 단순한 귀농이 아닌, 지속 가능한 농업의 시작을 돕는
                플랫폼.
                <br /> 꿈꿔왔던 귀농의 시작, 합리적이고 신뢰 가능한 방식으로
                연결됩니다.
              </p>
            </div>
            <img
              src="/Farmer/YoungFarmer.png"
              alt="청년 농부"
              className="Intro2Image"
            />
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-left">
          <div className="KeyFeaturesBox2">
            <div className="FeatureHeader2">[Feature Section - #01]</div>
            <div className="FeatureTitle2">Key Features - 판매자</div>
            <div className="FeatureGrid2">
              {sellerFeatures.map((feature, idx) => (
                <div key={idx} className="FeatureCard2">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="FeatureIcon2"
                  />
                  <div className="FeatureContent2">{feature.title}</div>
                  <div className="FeatureExplain2">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-right">
          <div className="KeyFeaturesBox2">
            <div className="FeatureHeader2">[Feature Section - #02]</div>
            <div className="FeatureTitle2">Key Features - 구매자</div>
            <div className="FeatureGrid2">
              {buyerFeatures.map((feature, idx) => (
                <div key={idx} className="FeatureCard2">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="FeatureIcon2"
                  />
                  <div className="FeatureContent2">{feature.title}</div>
                  <div className="FeatureExplain2">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <h2 className="FeatureTitle2">왜 신뢰 기반 매칭이 중요한가요?</h2>
          <p
            className="FeatureExplain2"
            style={{ maxWidth: "60vw", textAlign: "center" }}
          >
            농지는 단순한 땅이 아닙니다. <br />
            누군가의 인생이 담긴 공간이며, 새로운 시작이 만들어지는 터전입니다.
            <br />
            그렇기 때문에 우리는 농지 매칭에도 '신뢰'라는 기준을 더했습니다.
          </p>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <h2 className="FeatureTitle2">간단한 3단계 사용법</h2>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <div className="FeatureGrid2_1">
            <div className="FeatureCard2_1">
              <img src="Instruction1.png" className="FeatureIcon2_1" />
              <div className="FeatureContent2_1">
                1단계: 농지 등록 or 프로필 작성
              </div>
              <div className="FeatureExplain2_1">
                판매자/구매자 모두 기본 정보를 입력합니다.
              </div>
              <div className="FeatureDetail2_1">
                이름, 연락처, 재배 작물, 거래 희망 조건 등 필수 정보를 <br />
                간편하게 입력하면, AI 매칭을 위한 준비가 완료됩니다.
              </div>
            </div>
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <div className="FeatureGrid2_1">
            <div className="FeatureCard2_1">
              <img src="Instruction2.png" className="FeatureIcon2_1" />
              <div className="FeatureContent2_1">
                2단계: AI 매칭 및 추천 확인
              </div>
              <div className="FeatureExplain2_1">
                AI가 신뢰 점수와 조건을 분석하여 자동 추천합니다.
              </div>
              <div className="FeatureDetail2_1">
                입력한 정보를 바탕으로 가장 적합한 상대를 추천받습니다.
                <br />
                조건 필터도 직접 설정 가능하여 내가 원하는 매칭만 받아볼 수
                있어요.
              </div>
            </div>
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <div className="FeatureGrid2_1">
            <div className="FeatureCard2_1">
              <img src="Instruction3.png" className="FeatureIcon2_1" />
              <div className="FeatureContent2_1">3단계: 메시지 → 계약</div>
              <div className="FeatureExplain2_1">
                메시지로 협의 후, 간편 계약서 출력까지 완료!
              </div>
              <div className="FeatureDetail2_1">
                실명 인증된 상대방과 메시지를 통해 상세 조건을 조율하고, <br />
                플랫폼에서 계약서 자동 생성 및 출력이 가능합니다.
              </div>
            </div>
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <h2 className="FeatureTitle2">사용자 이야기</h2>
          <div className="FeatureGrid2">
            {userStories.map((story, idx) => (
              <div key={idx} className="FeatureCard2 hover-expand">
                <div className="FeatureContent2">“{story.quote}”</div>
                <div className="FeatureExplain2">{story.name}</div>
                <div className="FeatureDetail2">{story.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="SectionBlock" data-aos="fade-up">
          <h2 className="FeatureTitle2">청년 농부를 위한 정부 지원 안내</h2>
          <p
            className="FeatureExplain2"
            style={{ maxWidth: "60vw", textAlign: "center" }}
          >
            농림축산식품부의 청년 영농정착 지원사업, 귀농 귀촌 정책 등과
            연계됩니다. <br />
            플랫폼 내에서 신청 가능한 안내도 함께 제공됩니다.
          </p>
        </section>

        <section className="SectionBlock" data-aos="zoom-in">
          <h2 className="FeatureTitle2">지금, 땅의 미래를 함께 그려보세요</h2>
          <button
            className="start-button"
            onClick={() => navigate("/YoungMain")}
          >
            농지에서 새로운 시작을 하고 싶어요
          </button>
          <button
            className="start-button"
            onClick={() => navigate("/SeniorMain")}
          >
            내 농지를 믿고 맡길 청년을 찾고 싶어요
          </button>
        </section>
      </div>
    </div>
  );
}

export default IntroPage2;
