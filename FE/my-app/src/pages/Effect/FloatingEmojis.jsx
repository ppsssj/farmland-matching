import { useEffect } from "react";

const FloatingEmojis = () => {
  const emojis = [
    "👩‍🌾",
    "👨‍🌾",
    "🧑‍🌾",
    "🌾",
    "🍅",
    "🍎",
    "🥕",
    "🥬",
    "🍠",
    "🐓",
    "🌻",
    "🚜",
    "🍇",
    "🐐",
    "🥔",
    "🧺",
  ];

  useEffect(() => {
    const container = document.getElementById("emoji-bg");
    container.innerHTML = "";

    for (let i = 0; i < 30; i++) {
      const emoji = document.createElement("div");
      emoji.className = "floating-emoji";
      emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

      emoji.style.left = `${Math.random() * 100}%`;
      emoji.style.top = `${Math.random() * 100}%`;
      emoji.style.fontSize = `${1 + Math.random() * 1.2}rem`;
      emoji.style.opacity = `${0.2 + Math.random() * 0.3}`;
      emoji.style.animationDuration = `${8 + Math.random() * 6}s`;
      emoji.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(emoji);
    }
  }, []);

  return <div id="emoji-bg" className="emoji-background" />;
};

export default FloatingEmojis;
