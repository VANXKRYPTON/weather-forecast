import React from "react";
import { Thermometer, CloudRain, Cloud } from "lucide-react";

export default function TodayHighlightsCard({
  maxTemp = 36.4,
  minTemp = 28.6,
  rainChance = 65,
  cloudCover = 92,
  unit = "metric",
}) {
  const unitSymbol = unit === "imperial" ? "°F" : "°C";

  const maxTempFormatted =
    typeof maxTemp === "number" ? `${maxTemp}${unitSymbol}` : `36.4${unitSymbol}`;
  const minTempFormatted =
    typeof minTemp === "number" ? `${minTemp}${unitSymbol}` : `28.6${unitSymbol}`;
  const rainChanceFormatted =
    typeof rainChance === "number" ? `${Math.round(rainChance)}%` : "65%";
  const cloudCoverFormatted =
    typeof cloudCover === "number" ? `${Math.round(cloudCover)}%` : "92%";

  return (
    <div className="glass-card-sm glow-hover-highlights p-5 md:p-5.5 flex flex-col justify-between rounded-[22px] min-h-[125px] cursor-pointer select-none">
      {/* Title with Vertical Glowing Purple Bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-3.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Today's Highlights
        </h3>
      </div>

      {/* 2-Column Statistics Grid with Subtle Divider */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-1 divide-x divide-white/10">
        {/* Left Column (Max Temp & Min Temp) */}
        <div className="flex flex-col justify-between gap-2.5 pr-2">
          {/* Max Temp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-rose-500 stroke-[2.2] shrink-0" />
              <span className="text-xs text-gray-300 font-normal">Max Temp</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-white tracking-tight">
              {maxTempFormatted}
            </span>
          </div>

          {/* Min Temp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain size={16} className="text-sky-400 stroke-[2.2] shrink-0" />
              <span className="text-xs text-gray-300 font-normal">Min Temp</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-white tracking-tight">
              {minTempFormatted}
            </span>
          </div>
        </div>

        {/* Right Column (Chance of Rain & Cloud Cover) */}
        <div className="flex flex-col justify-between gap-2.5 pl-4">
          {/* Chance of Rain */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-blue-400 stroke-[2.2] shrink-0" />
              <span className="text-xs text-gray-300 font-normal">Chance of Rain</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-white tracking-tight">
              {rainChanceFormatted}
            </span>
          </div>

          {/* Cloud Cover */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud size={16} className="text-gray-300 stroke-[2.2] shrink-0" />
              <span className="text-xs text-gray-300 font-normal">Cloud Cover</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-white tracking-tight">
              {cloudCoverFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
