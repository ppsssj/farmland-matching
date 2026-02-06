# 🌱 밭 볼텼유? — 신뢰 기반 농지 매칭 플랫폼  

> **데이터로 가능성을, 신뢰로 계약을**  
2025 멋쟁이사자처럼 해커톤  

---

## 📌 프로젝트 개요
고령화와 정보 비대칭으로 인해 늘어나는 **유휴농지 문제**를 해결하기 위해,  
농지를 보유한 어르신과 농지를 필요로 하는 청년을 **신뢰 기반으로 연결**하는 플랫폼입니다.  

---

## ✨ 주요 기능
- **신뢰도 분석**  
  - 청년의 자격증, 교육 이수, 장비 보유, 재배/임대 이력, 추천인 정보를 기반으로 **신뢰 점수 산출**  

- **AI 기반 매칭**  
  - KMeans + Rule-based Scoring으로 구매자–판매자 농지 적합도 분석  
  - 예상 수익 예측 모델 제공  

- **맞춤 UI/UX**  
  - 청년: 상세 데이터 기반의 농지 탐색  
  - 어르신: **큰 버튼**과 **단계별 입력 흐름**으로 간단히 등록 가능  

- **실시간 채팅**  
  - 상호 동의 시에만 열리는 안전한 채팅 기능  

---

## 🛠️ 기술 스택
**Front-End**  
- React, Kakao Map API  
- AOS 애니메이션, Styled CSS  
- Responsive UI (Panel 구조: Left/Right/Bottom/Overlay)

**Back-End**  
- Spring Boot, PostgreSQL  
- REST API, Docker Compose  
- Nginx Reverse Proxy  

**AI/ML**  
- Python, scikit-learn  
- Polynomial Regression, KMeans Clustering  
- Rule-based Scoring  

**Infra**  
- AWS EC2, Docker, GitHub Actions  

---

## 📅 프로젝트 기간
- **2025.07.28 ~ 2025.08.25 (약 4주)**  
  - 07.28: 주제 확정 — *“밭 볼텼유? 신뢰 기반 농지 매칭 플랫폼”*  
  - 07.29~07.31: 피그마 디자인 및 UI 기획     Figma url : https://www.figma.com/design/y0GsKpGun5i5Ci2gs1R6Gt/%EB%86%8D%EC%9E%A5?node-id=0-1&p=f&t=slA6kiG5YgirmWph-0
  - 08.01~08.13: 프론트엔드 / 백엔드 / AI 개발  
  - 08.14~08.20: 시스템 연동 및 기능 통합  
  - 08.21~08.23: 배포(AWS EC2 + Docker) 및 버그 수정  
  - 08.24~08.25: 최종 발표 & 데모 시연

---

## 👥 Team & My Role

- **Team size:** 4 members  
- **My role:** **PM / Product Design / Front-End**

### ✅ What I did (PM · Design · FE)

**PM**
- Defined problem scope and MVP, set feature priorities
- Managed 4-week milestones and issue tracking across the team
- Built the demo scenario and presentation storyline

**Design (UI/UX)**
- Designed user flows for **Senior (land owner)** and **Youth (tenant/buyer)**
- Produced **Figma** wireframes and high-fidelity UI screens
- Organized basic UI consistency (components, spacing, readability, large-button UX)

**Front-End**
- Implemented key pages with **React**
- Integrated **Kakao Map API** for map-based browsing and selection
- Built **responsive panel layout** (Left/Right/Bottom/Overlay) and **AOS** interactions
- Connected to backend **REST APIs** for core flows (explore/detail/register) and supported integration testing

---

## 🚀 실행 방법
```bash
# 프론트엔드 실행
cd frontend
npm install
npm start

# 백엔드 실행
cd backend
./gradlew bootRun

# AI 서버 실행
cd ai
python app.py

