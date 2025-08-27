// useMarkerManager.js
import { useEffect, useRef, useState } from "react";

export function useMarkerManager(map, farmlands = [], onSelect) {
  const markerMap = useRef(new Map());
  const circleMap = useRef(new Map());
  const overlayMap = useRef(new Map());
  const markerImagesRef = useRef({ black: null, blue: null });

  const [activeId, setActiveId] = useState(null);

  // ----------------------------
  // 부드러운 원(서클) 펄스 애니메이션
  // ----------------------------
  function animateCirclePulseInfinite(circle) {
    if (!circle || typeof circle.setOptions !== "function") return;

    let startTime = null;
    const baseOpacity = 0.15;

    function animate(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const opacity = 0.15 * Math.sin(elapsed / 400) + baseOpacity; // 0.05 ~ 0.25
      circle.setOptions({ fillOpacity: opacity });
      circle.__animationId = requestAnimationFrame(animate);
    }

    if (circle.__animationId) cancelAnimationFrame(circle.__animationId);
    animate();
  }

  function stopCircleAnimation(circle) {
    if (circle && circle.__animationId) {
      cancelAnimationFrame(circle.__animationId);
      circle.__animationId = null;
      circle.setOptions({ fillOpacity: 0.15 });
    }
  }

  // ----------------------------
  // 마커/원/오버레이 생성
  // ----------------------------
  useEffect(() => {
    // kakao SDK & map 준비 상태 확인
    if (!map || typeof window === "undefined" || !window.kakao?.maps) return;

    const { kakao } = window;
    const canConstruct =
      typeof kakao.maps.MarkerImage === "function" &&
      typeof kakao.maps.Size === "function" &&
      typeof kakao.maps.LatLng === "function" &&
      typeof kakao.maps.Marker === "function";

    if (!canConstruct) {
      console.warn("[useMarkerManager] kakao.maps 생성자 준비 전. 렌더 스킵");
      return;
    }

    // 커스텀 마커 이미지 1회 생성(없을 때만)
    if (!markerImagesRef.current.black || !markerImagesRef.current.blue) {
      markerImagesRef.current = {
        black: new kakao.maps.MarkerImage(
          "/marker-black.png",
          new kakao.maps.Size(25, 25)
        ),
        blue: new kakao.maps.MarkerImage(
          "/marker-blue.png",
          new kakao.maps.Size(40, 40)
        ),
      };
    }
    const { black, blue } = markerImagesRef.current;

    // 기존 요소 정리
    markerMap.current.forEach((m) => m.setMap(null));
    circleMap.current.forEach((c) => {
      stopCircleAnimation(c);
      c.setMap(null);
    });
    overlayMap.current.forEach((o) => o.setMap(null));
    markerMap.current.clear();
    circleMap.current.clear();
    overlayMap.current.clear();

    // 새로 생성
    farmlands.forEach((farm) => {
      if (farm.lat == null || farm.lng == null) return;

      const position = new kakao.maps.LatLng(farm.lat, farm.lng);

      // 마커
      const marker = new kakao.maps.Marker({
        map,
        position,
        title: farm.name,
        image: black,
      });
      kakao.maps.event.addListener(marker, "click", () => {
        onSelect?.(farm);
        setActiveId(farm.id);

        // 모든 원 애니메이션 정지 후, 클릭된 원만 활성화
        circleMap.current.forEach((c) => stopCircleAnimation(c));
        const clickedCircle = circleMap.current.get(farm.id);
        animateCirclePulseInfinite(clickedCircle);
      });
      markerMap.current.set(farm.id, marker);

      // 면적 기반 원
      const radius = Math.sqrt(Number(farm.area) || 0) * 10;
      const circle = new kakao.maps.Circle({
        center: position,
        radius,
        strokeWeight: 1,
        strokeColor: "#3399ff",
        strokeOpacity: 0.6,
        strokeStyle: "solid",
        fillColor: "#3399ff",
        fillOpacity: 0.15,
        zIndex: 0,
      });
      circle.setMap(map);
      circle.__baseRadius = radius;
      circleMap.current.set(farm.id, circle);

      // 이모지 오버레이
      const emojiContent = document.createElement("div");
      emojiContent.className = "useMakerManager-emoji-overlay";
      emojiContent.innerText = farm.emoji ?? "🌾";

      const emojiOverlay = new kakao.maps.CustomOverlay({
        content: emojiContent,
        position: position,
        xAnchor: 0.5,
        yAnchor: 0,
        zIndex: 1,
      });
      emojiOverlay.setMap(map);
      overlayMap.current.set(farm.id, emojiOverlay);
    });

    // cleanup: 언마운트/재실행 시 모두 제거
    return () => {
      markerMap.current.forEach((m) => m.setMap(null));
      circleMap.current.forEach((c) => {
        stopCircleAnimation(c);
        c.setMap(null);
      });
      overlayMap.current.forEach((o) => o.setMap(null));
      markerMap.current.clear();
      circleMap.current.clear();
      overlayMap.current.clear();
    };
  }, [map, farmlands]);

  // ----------------------------
  // activeId 변경 시 마커 이미지 갱신
  // ----------------------------
  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.kakao?.maps) return;
    const { black, blue } = markerImagesRef.current;
    if (!black || !blue) return;

    markerMap.current.forEach((marker, id) => {
      marker.setImage(id === activeId ? blue : black);
    });
  }, [activeId, map]);

  // ----------------------------
  // 외부에서 포커싱
  // ----------------------------
  const focusOnFarm = (farm) => {
    if (!map || !farm) return;
    const marker = markerMap.current.get(farm.id);
    if (!marker) return;

    setActiveId(farm.id);

    // 원 애니메이션 제어
    circleMap.current.forEach((c) => stopCircleAnimation(c));
    const circle = circleMap.current.get(farm.id);
    animateCirclePulseInfinite(circle);

    const target = marker.getPosition();
    map.setLevel(4);
    setTimeout(() => map.panTo(target), 100);
  };

  return { focusOnFarm };
}
