import { useState } from "react";
import "./BottomPanel.css";

function BottomPanel({ map }) {
  const [activeOverlays, setActiveOverlays] = useState({
    traffic: false,
    terrain: false,
    bicycle: false,
  });

  const setMapType = (type) => {
    if (!map || !window.kakao) return;
    const { ROADMAP, HYBRID } = window.kakao.maps.MapTypeId;
    map.setMapTypeId(type === "roadmap" ? ROADMAP : HYBRID);
  };

  const toggleOverlay = (type) => {
    if (!map || !window.kakao) return;

    const mapTypeId = window.kakao.maps.MapTypeId[type.toUpperCase()];
    const isActive = activeOverlays[type];

    if (isActive) {
      map.removeOverlayMapTypeId(mapTypeId);
    } else {
      map.addOverlayMapTypeId(mapTypeId);
    }

    setActiveOverlays((prev) => ({
      ...prev,
      [type]: !isActive,
    }));
  };

  const zoom = (dir) => {
    if (!map) return;
    const level = map.getLevel();
    map.setLevel(dir === "in" ? level - 1 : level + 1);
  };

  return (
    <div className="BttomPanel-BottomContainer">
      <div className="BttomPanel-BottomPanel BottomPanel1">
        <div onClick={() => setMapType("roadmap")} className="BttomPanel-BottomItem">🗺 일반</div>
        <div onClick={() => setMapType("satellite")} className="BttomPanel-BottomItem">🛰 위성</div>
      </div>
      <div className="BttomPanel-BottomPanel BottomPanel2">
        <div
          onClick={() => toggleOverlay("terrain")}
          className={`BttomPanel-BottomItem ${activeOverlays.terrain ? "active" : ""}`}
        >
          ⛰ 지형
        </div>
        <div
          onClick={() => toggleOverlay("traffic")}
          className={`BttomPanel-BottomItem ${activeOverlays.traffic ? "active" : ""}`}
        >
          🚗 교통
        </div>
        <div
          onClick={() => toggleOverlay("bicycle")}
          className={`BttomPanel-BottomItem ${activeOverlays.bicycle ? "active" : ""}`}
        >
          🚴 자전거
        </div>
      </div>
      <div className="BttomPanel-BottomPanel BottomPanel3">
        <div onClick={() => zoom("in")} className="BttomPanel-BottomItem">➕ 줌인</div>
        <div onClick={() => zoom("out")} className="BttomPanel-BottomItem">➖ 줌아웃</div>
      </div>
    </div>
  );
}

export default BottomPanel;
