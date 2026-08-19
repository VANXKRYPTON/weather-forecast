import React from "react";

export default function SunriseSunsetCard({
  sunrise = "5:15 AM",
  sunset = "6:32 PM",
}) {
  return (
    <div className="glass-card-sm glow-hover-sun p-5 md:p-5.5 flex flex-col justify-between rounded-[22px] min-h-[125px] cursor-pointer select-none">
      {/* Title with Vertical Glowing Blue Bar */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-3.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Sunrise & Sunset
        </h3>
      </div>

      {/* Symmetrical Dotted Arc Trajectory + Radiant Golden Sun at Apex Center */}
      <div className="relative w-full pt-1 pb-1">
        <div className="relative w-full h-10 flex items-center justify-center">
          <svg viewBox="0 0 200 44" className="w-full h-full overflow-visible">
            {/* Symmetrical Dotted Curved Trajectory Arc */}
            <path
              d="M 32 38 Q 100 6 168 38"
              fill="none"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="1.6"
              strokeDasharray="2.5 4"
            />
          </svg>

          {/* Radiant Sun Positioned along Apex Center with Outward Rays */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 pointer-events-none">
            <div className="relative flex items-center justify-center">
              {/* Sun Glow */}
              <div className="absolute w-8 h-8 rounded-full bg-amber-400/30 blur-sm animate-pulse" />
              
              {/* Sun Core with Rays */}
              <svg viewBox="0 0 40 40" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]">
                {/* 8 Sun Rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line
                    key={i}
                    x1="20"
                    y1="20"
                    x2="20"
                    y2="6"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    transform={`rotate(${angle}, 20, 20)`}
                  />
                ))}
                {/* Center Sun Ball */}
                <circle cx="20" cy="20" r="7" fill="#FBBF24" />
                <circle cx="18" cy="18" r="2" fill="#FFFFFF" opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Labels: Sunrise Left, Sunset Right */}
        <div className="flex items-center justify-between px-2 mt-1">
          {/* Sunrise Left */}
          <div className="flex flex-col items-center">
            {/* Sunrise Half-Sun Icon */}
            <svg viewBox="0 0 32 20" className="w-6 h-4 text-amber-400">
              <path d="M 4 16 L 28 16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
              <path d="M 10 16 A 6 6 0 0 1 22 16 Z" fill="#FBBF24" />
              <line x1="16" y1="8" x2="16" y2="4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="11" x2="5" y2="8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="11" x2="27" y2="8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold text-white mt-1 tracking-tight">
              {sunrise}
            </span>
          </div>

          {/* Sunset Right */}
          <div className="flex flex-col items-center">
            {/* Sunset Half-Sun Icon */}
            <svg viewBox="0 0 32 20" className="w-6 h-4 text-orange-500">
              <path d="M 4 16 L 28 16" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
              <path d="M 10 16 A 6 6 0 0 1 22 16 Z" fill="#F97316" />
              <line x1="16" y1="8" x2="16" y2="4" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="11" x2="5" y2="8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="11" x2="27" y2="8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold text-white mt-1 tracking-tight">
              {sunset}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
