// src/components/MapView.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import useKakaoLoader from "../../lib/useKakaoLoader" 
import { useMarkerManager } from "../Hooks/useMakerManager";

function MapView({ farmlands, onSelect, onMapLoad, selectedFarm }) {
  const mapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // ✅ 공용 로더만 사용 (중복 로드 방지)
  const kakaoReady = useKakaoLoader(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);

  // 마커 매니저는 mapRef.current가 생긴 뒤에 동작
  const { focusOnFarm } = useMarkerManager(mapRef.current, farmlands, onSelect);

  // 지도 초기화
  useEffect(() => {
    if (!kakaoReady) return;
    if (!window.kakao?.maps) return;
    if (mapRef.current) return; // 이미 생성됨

    const container = document.getElementById("map");
    if (!container) return;

    const map = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(36.768736444259694, 126.96255752759119),
      level: 6,
    });

    mapRef.current = map;
    setIsMapReady(true);
    onMapLoad?.(map);
  }, [kakaoReady, onMapLoad]);

  // 선택된 농지 포커싱
  useEffect(() => {
    if (!isMapReady || !selectedFarm || !focusOnFarm) return;
    focusOnFarm(selectedFarm);
  }, [isMapReady, selectedFarm, focusOnFarm]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100%",
          border: "2px solid #aaa",
          zIndex: 0,
        }}
      />
    </div>
  );
}

export default MapView;
