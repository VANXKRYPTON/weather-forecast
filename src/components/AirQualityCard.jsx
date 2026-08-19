import React from "react";
import { Leaf } from "lucide-react";

export default function AirQualityCard({ airQuality = 42, airQualityStatus = "Good" }) {
  const aqiNum = typeof airQuality === "number" ? Math.round(airQuality) : 42;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  // Progress ratio (out of 100 or 150)
  const percentage = Math.min(Math.max((aqiNum / 100) * 100, 20), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let statusText = airQualityStatus || "Good";
  let statusColor = "text-[#22c55e]";
  let strokeColor = "#22c55e"; // bright green/emerald
  let advice = "Air quality is satisfactory for most people.";

  if (aqiNum <= 50) {
    statusText = "Good";
    statusColor = "text-[#22c55e]";
    strokeColor = "#22c55e";
    advice = "Air quality is satisfactory for most people.";
  } else if (aqiNum <= 100) {
    statusText = "Moderate";
    statusColor = "text-[#f59e0b]";
    strokeColor = "#f59e0b";
    advice = "Air quality is acceptable for most people.";
  } else {
    statusText = "Poor";
    statusColor = "text-[#ef4444]";
    strokeColor = "#ef4444";
    advice = "Sensitive groups should reduce outdoor exposure.";
  }

  return (
    <div className="glass-card-sm glow-hover-aqi p-5 md:p-5.5 flex flex-col justify-between rounded-[22px] min-h-[125px] cursor-pointer select-none">
      {/* Title with Vertical Glowing Blue Bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-3.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Air Quality Index
        </h3>
      </div>

      {/* Content Row: Ring Gauge + Leaf Advisory */}
      <div className="flex items-center gap-5 mt-1">
        {/* Circular Ring Gauge */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="aqiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            {/* Dark background track ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="rgba(30, 41, 75, 0.85)"
              strokeWidth="6"
            />
            {/* Vibrant progress arc */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="url(#aqiGrad)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.8s ease-out",
                filter: "drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))",
              }}
            />
          </svg>

          {/* Center Score & Status */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white leading-none tracking-tight">
              {aqiNum}
            </span>
            <span className={`text-[11px] font-medium ${statusColor} mt-1`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Leaf Icon + Description */}
        <div className="flex items-center gap-3 flex-1">
          <div className="text-emerald-400 shrink-0 flex items-center justify-center">
            <Leaf size={22} className="fill-emerald-400/20 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            {advice}
          </p>
        </div>
      </div>
    </div>
  );
}
