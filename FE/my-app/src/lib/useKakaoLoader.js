// src/lib/useKakaoLoader.js
import { useEffect, useState } from "react";

export default function useKakaoLoader(appKey) {
  const [loaded, setLoaded] = useState(
    !!(window.kakao?.maps && window.kakao?.maps?.services)
  );

  useEffect(() => {
    if (!appKey) {
      console.warn("[useKakaoLoader] REACT_APP_KAKAO_JAVASCRIPT_KEY 누락");
      return;
    }

    // ✅ 0) 이미 준비됨
    if (window.kakao?.maps?.services) {
      setLoaded(true);
      return;
    }

    // ✅ 1) 혹시 다른 곳에서 잘못 꽂은 SDK들을 싹 정리
    //    (services 없는 src, 혹은 동일 SDK가 여러 개)
    const allSdkScripts = Array.from(
      document.querySelectorAll('script[src*="dapi.kakao.com/v2/maps/sdk.js"]')
    );
    for (const s of allSdkScripts) {
      const hasServices = s.src.includes("libraries=services");
      const isOurs = s.id === "kakao-map-sdk";
      // 우리 것이 아니고, 혹은 services 없는 건 제거
      if (!isOurs || !hasServices) s.remove();
    }

    // 제거 후 재확인
    if (window.kakao?.maps?.services) {
      setLoaded(true);
      return;
    }

    const ID = "kakao-map-sdk";
    const desiredSrc =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}` +
      `&autoload=false&libraries=services`;

    // ✅ 2) 남아있는 우리 스크립트가 있으면 그대로 load만 호출
    let script = document.getElementById(ID);
    if (script) {
      // src가 다르면 교체
      if (!script.src.includes("libraries=services")) {
        script.remove();
        script = null;
      }
    }

    if (!script) {
      script = document.createElement("script");
      script.id = ID;
      script.async = true;
      script.src = desiredSrc;
      script.onerror = () => console.error("[useKakaoLoader] SDK 로드 실패");
      document.head.appendChild(script);
    }

    script.onload = () => {
      try {
        window.kakao.maps.load(() => {
          if (!window.kakao?.maps?.services) {
            console.error("[useKakaoLoader] services 라이브러리 없음");
            return;
          }
          setLoaded(true);
        });
      } catch (e) {
        console.error("[useKakaoLoader] onload 처리 오류:", e);
      }
    };
  }, [appKey]);

  return loaded;
}
