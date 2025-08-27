import React, { useEffect } from "react";

const ParticleBackground = () => {
  useEffect(() => {
    const numStars = 80;
    const container = document.getElementById("particle-bg");

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${3 + Math.random() * 4}s`; // 3~7초
      star.style.opacity = `${0.4 + Math.random() * 0.6}`;
      container.appendChild(star);
    }
  }, []);

  return <div id="particle-bg" className="particle-background" />;
};

export default ParticleBackground;
