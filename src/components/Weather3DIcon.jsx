import React from "react";
import weather3dRain from "../assets/images/weather_3d_rain.jpg";
import weather3dSun from "../assets/images/weather_3d_sun.jpg";

export default function Weather3DIcon({
  condition = "rain",
  size = "md",
  className = "",
}) {
  const isClear =
    condition?.toLowerCase().includes("clear") ||
    condition?.toLowerCase().includes("sunny");

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  const imgSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${imgSize} ${className}`}
    >
      {/* 3D Puffy Rain Cloud Icon with Sun and Drops */}
      {!isClear ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Subtle warm sun glow behind */}
          <div className="absolute -top-1 right-1 w-6 h-6 rounded-full bg-amber-400/80 blur-xs" />
          
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]">
            <defs>
              {/* Sun Gradient */}
              <radialGradient id="sunGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="60%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57C00" />
              </radialGradient>

              {/* Cloud Gradient */}
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#F0F4F8" />
                <stop offset="85%" stopColor="#D9E2EC" />
                <stop offset="100%" stopColor="#BCCCDC" />
              </linearGradient>

              {/* Cloud Highlight */}
              <linearGradient id="cloudHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Raindrop Gradient */}
              <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* Drop Shadow */}
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Sun Rays & Body */}
            <g transform="translate(18, -4)">
              {/* Sun Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="52"
                  y1="30"
                  x2="52"
                  y2="20"
                  stroke="#F57C00"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 52 30)`}
                />
              ))}
              {/* Sun Circle */}
              <circle cx="52" cy="30" r="14" fill="url(#sunGrad)" filter="url(#softShadow)" />
            </g>

            {/* Puffy 3D Cloud */}
            <g filter="url(#softShadow)">
              {/* Base Cloud Path */}
              <path
                d="M 28 62 
                   A 14 14 0 0 1 30 36 
                   A 18 18 0 0 1 60 28 
                   A 16 16 0 0 1 82 44 
                   A 14 14 0 0 1 76 62 
                   Z"
                fill="url(#cloudGrad)"
              />
              {/* Top Bubble Highlight */}
              <path
                d="M 32 38 
                   A 16 16 0 0 1 58 30 
                   A 14 14 0 0 1 78 44"
                fill="none"
                stroke="url(#cloudHighlight)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Cyan Falling Raindrops */}
            <g>
              {/* Raindrop 1 */}
              <path
                d="M 34 70 C 34 70 30 76 30 79 A 4 4 0 0 0 38 79 C 38 76 34 70 34 70 Z"
                fill="url(#dropGrad)"
              />
              {/* Raindrop 2 */}
              <path
                d="M 48 72 C 48 72 44 78 44 81 A 4 4 0 0 0 52 81 C 52 78 48 72 48 72 Z"
                fill="url(#dropGrad)"
              />
              {/* Raindrop 3 */}
              <path
                d="M 62 70 C 62 70 58 76 58 79 A 4 4 0 0 0 66 79 C 66 76 62 70 62 70 Z"
                fill="url(#dropGrad)"
              />
              {/* Raindrop 4 */}
              <path
                d="M 74 72 C 74 72 70 78 70 81 A 4 4 0 0 0 78 81 C 78 78 74 72 74 72 Z"
                fill="url(#dropGrad)"
              />
            </g>
          </svg>
        </div>
      ) : (
        /* 3D Radiant Sun Icon */
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]">
            <defs>
              <radialGradient id="clearSunGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="35%" stopColor="#FFD54F" />
                <stop offset="75%" stopColor="#FFA000" />
                <stop offset="100%" stopColor="#FF6F00" />
              </radialGradient>
            </defs>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="22"
                stroke="#FFA000"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="22" fill="url(#clearSunGrad)" />
            <circle cx="43" cy="43" r="6" fill="#FFFFFF" opacity="0.6" />
          </svg>
        </div>
      )}
    </div>
  );
}
