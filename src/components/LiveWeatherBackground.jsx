import React, { useEffect, useRef, useState } from "react";
import dashboardWallpaper from "../assets/images/dashboard_wallpaper.jpg";

export default function LiveWeatherBackground({ isLive = true }) {
  const canvasRef = useRef(null);
  const [lightningFlash, setLightningFlash] = useState(0); // 0 = none, 0..1 = flash intensity

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 1. Raindrop System
    // ==========================================
    const dropCount = Math.floor(Math.min(width, 1920) / 10); // ~120 to 180 drops
    const drops = [];
    const windAngle = 0.22; // ~13 degrees tilt

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (width + 300) - 150,
        y: Math.random() * height,
        length: 18 + Math.random() * 24, // 18px to 42px
        speed: 16 + Math.random() * 14,  // 16px to 30px per frame
        opacity: 0.15 + Math.random() * 0.45,
        thickness: 0.8 + Math.random() * 0.9,
      });
    }

    // ==========================================
    // 2. Procedural Lightning Bolt System
    // ==========================================
    let lightningBolts = [];

    const createLightningBolt = (startX, startY, endX, endY) => {
      const bolt = [];
      let currentX = startX;
      let currentY = startY;
      bolt.push({ x: currentX, y: currentY });

      const steps = 18;
      const dx = (endX - startX) / steps;
      const dy = (endY - startY) / steps;

      for (let i = 0; i < steps; i++) {
        currentX += dx + (Math.random() - 0.5) * 35;
        currentY += dy + (Math.random() - 0.2) * 15;
        bolt.push({ x: currentX, y: currentY });
      }
      bolt.push({ x: endX, y: endY });
      return bolt;
    };

    // Periodic natural thunderstorm strike schedule
    let nextLightningTime = Date.now() + 3000 + Math.random() * 4000;
    let lightningActive = false;

    const triggerThunderstorm = () => {
      lightningActive = true;

      // Generate 1-2 branch bolts in upper right / center sky
      const startX = width * (0.55 + Math.random() * 0.3);
      const startY = Math.random() * (height * 0.15);
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = height * (0.45 + Math.random() * 0.3);

      lightningBolts = [createLightningBolt(startX, startY, endX, endY)];
      if (Math.random() > 0.4) {
        // Add a second branching fork
        lightningBolts.push(
          createLightningBolt(startX + 30, startY + 20, endX + 80, endY - 40)
        );
      }

      // Multi-phase natural strike pulse: Flash 1 -> lull -> Flash 2 -> fade
      setLightningFlash(0.55);
      setTimeout(() => {
        setLightningFlash(0.15);
        setTimeout(() => {
          setLightningFlash(0.85);
          setTimeout(() => {
            setLightningFlash(0.4);
            setTimeout(() => {
              setLightningFlash(0);
              lightningBolts = [];
              lightningActive = false;
            }, 180);
          }, 90);
        }, 60);
      }, 70);

      // Schedule next strike in 4s - 9s
      nextLightningTime = Date.now() + 4500 + Math.random() * 6000;
    };

    // ==========================================
    // 3. Main Animation Loop
    // ==========================================
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check if time for lightning
      if (!lightningActive && Date.now() > nextLightningTime) {
        triggerThunderstorm();
      }

      // Draw procedural lightning bolts if active
      if (lightningBolts.length > 0) {
        ctx.save();
        lightningBolts.forEach((bolt) => {
          ctx.beginPath();
          ctx.moveTo(bolt[0].x, bolt[0].y);
          for (let i = 1; i < bolt.length; i++) {
            ctx.lineTo(bolt[i].x, bolt[i].y);
          }
          ctx.strokeStyle = "rgba(235, 245, 255, 0.9)";
          ctx.lineWidth = 2.4;
          ctx.shadowColor = "#818cf8";
          ctx.shadowBlur = 18;
          ctx.stroke();

          // Outer glowing core
          ctx.strokeStyle = "rgba(192, 132, 252, 0.6)";
          ctx.lineWidth = 5;
          ctx.shadowBlur = 30;
          ctx.stroke();
        });
        ctx.restore();
      }

      // Draw falling raindrops
      ctx.save();
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.length * windAngle, d.y + d.length);
        ctx.strokeStyle = `rgba(186, 220, 255, ${d.opacity})`;
        ctx.lineWidth = d.thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        // Advance position
        d.y += d.speed;
        d.x += d.speed * windAngle;

        // Reset drop when past bottom or right edge
        if (d.y > height + 40 || d.x > width + 100) {
          d.y = -d.length - Math.random() * 60;
          d.x = Math.random() * (width + 300) - 150;
          d.speed = 16 + Math.random() * 14;
          d.opacity = 0.15 + Math.random() * 0.45;
        }
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isLive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Wallpaper Image */}
      <img
        src={dashboardWallpaper}
        alt="Atmospheric Weather Wallpaper"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
      />

      {/* 2. Live Lightning Atmospheric Cloud Illumination Flash Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-75"
        style={{
          opacity: lightningFlash,
          background:
            "radial-gradient(ellipse at 75% 30%, rgba(216, 180, 254, 0.45) 0%, rgba(147, 197, 253, 0.28) 40%, rgba(255, 255, 255, 0.15) 70%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 3. Deep Atmospheric Lighting Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[2] bg-gradient-to-b from-[#060a18]/45 via-[#080e26]/15 to-[#0a0618]/50" />

      {/* 4. Live HTML5 Canvas for Rain Streaks & Lightning Bolts */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[3]"
      />
    </div>
  );
}
