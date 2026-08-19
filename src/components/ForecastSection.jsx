import React from "react";
import { motion } from "framer-motion";
import Weather3DIcon from "./Weather3DIcon";

export default function ForecastSection({
  forecastList = [],
  selectedIndex = 2,
  onSelectDay,
  unit = "metric",
}) {
  const unitSymbol = unit === "imperial" ? "°F" : "°C";

  return (
    <div className="forecast-container-glass p-6 md:p-8 select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Title with Sparkles */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
          5-Day Forecast
        </h2>
        <span className="text-base text-cyan-300">✨</span>
      </div>

      {/* 5 Forecast Cards Grid with Generous Gaps Between Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-7 items-stretch">
        {forecastList.map((day, idx) => {
          const isSelected = selectedIndex === idx;

          // Format temperature with 2 decimal places if present or integer
          let tempDisplay = `30${unitSymbol}`;
          if (typeof day.temp === "number") {
            tempDisplay = Number.isInteger(day.temp)
              ? `${day.temp}${unitSymbol}`
              : `${day.temp.toFixed(2)}${unitSymbol}`;
          }

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDay?.(idx)}
              className={`relative cursor-pointer p-5 md:p-6 rounded-[22px] min-h-[220px] flex flex-col justify-between items-center text-center transition-all duration-300 ${
                isSelected
                  ? "forecast-item-active"
                  : "forecast-item-card"
              }`}
            >
              {/* Day Header */}
              <h3 className="text-xs md:text-sm font-medium text-gray-200 mb-2">
                {day.dayName || day.day}
              </h3>

              {/* 3D Weather Icon with Floating Animation */}
              <div className="my-1.5 flex items-center justify-center">
                <Weather3DIcon condition={day.condition} size="md" className="animate-float" />
              </div>

              {/* Temperature (Vibrant Coral Orange) */}
              <div className="text-xl md:text-2xl font-bold temp-orange-text tracking-tight my-1">
                {tempDisplay}
              </div>

              {/* Weather Condition */}
              <p className="text-xs text-gray-300 font-normal mb-3 capitalize line-clamp-1">
                {day.condition || "Light Rain"}
              </p>

              {/* Bottom Line: Humidity on Left & Wind on Right */}
              <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400">💧</span>
                  <span className="text-[11px] font-medium">{day.humidity ?? 60}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">💨</span>
                  <span className="text-[11px] font-medium">
                    {day.windSpeed ?? 8} {unit === "imperial" ? "mph" : "km/h"}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
