import { useRef, useState } from "react";

const BgmController = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.volume = 0.2;
      audio.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="bgm-controller" onClick={toggleMusic}>
      {playing ? "🎵 음악끄기" : "🎷 음악켜기"}
      <audio ref={audioRef} src="/western-swing.mp3" loop />
    </div>
  );
};

export default BgmController;
