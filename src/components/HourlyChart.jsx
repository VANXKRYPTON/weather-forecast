import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Clock, Droplets, Wind, Thermometer, Sparkles } from "lucide-react";
import Weather3DIcon from "./Weather3DIcon";

export default function HourlyChart({
  forecastList = [],
  hourlyData = [],
  unit = "metric",
  selectedDayName = "Today",
}) {
  const [activeTab, setActiveTab] = useState("temp"); // 'temp' | 'rain' | 'wind'
  const unitSymbol = unit === "imperial" ? "°F" : "°C";
  const speedSymbol = unit === "imperial" ? "mph" : "km/h";

  if (!hourlyData || hourlyData.length === 0) return null;

  // Chart data formatting
  const chartData = hourlyData.map((item) => ({
    time: item.time,
    temp: Math.round(item.temp),
    rain: item.rainChance ?? item.humidity ?? 20,
    wind: Math.round(item.windSpeed),
    condition: item.condition,
    description: item.description,
  }));

  const dataKey = activeTab === "temp" ? "temp" : activeTab === "rain" ? "rain" : "wind";
  const strokeColor =
    activeTab === "temp" ? "#f59e0b" : activeTab === "rain" ? "#38bdf8" : "#10b981";
  const gradientId = `grad_${activeTab}`;

  return (
    <div className="mt-6 glass-panel-dark p-5 md:p-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-400" />
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Hourly Forecast &mdash; <span className="text-amber-400">{selectedDayName}</span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            24-hour weather trends, precipitation, and wind speeds
          </p>
        </div>

        {/* Mode Selector Tabs (Temperature / Precipitation / Wind) */}
        <div className="p-1 rounded-2xl glass-card-sm flex items-center gap-1">
          <button
            onClick={() => setActiveTab("temp")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "temp"
                ? "bg-amber-500/25 border border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Thermometer size={14} /> Temperature
          </button>
          <button
            onClick={() => setActiveTab("rain")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "rain"
                ? "bg-sky-500/25 border border-sky-400/40 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Droplets size={14} /> Precipitation
          </button>
          <button
            onClick={() => setActiveTab("wind")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "wind"
                ? "bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Wind size={14} /> Wind
          </button>
        </div>
      </div>

      {/* Smooth Area Chart */}
      <div className="relative h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 15, left: 15, bottom: 5 }}>
            <defs>
              <linearGradient id="grad_temp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="grad_rain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="grad_wind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis hide domain={["auto", "auto"]} />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="rounded-2xl bg-[#090f28]/95 border border-white/15 p-3 shadow-2xl backdrop-blur-xl text-center">
                      <p className="text-xs text-gray-400 font-medium">{p.time}</p>
                      <p className="text-base font-bold text-white my-0.5">
                        {activeTab === "temp"
                          ? `${p.temp}${unitSymbol}`
                          : activeTab === "rain"
                          ? `${p.rain}% rain`
                          : `${p.wind} ${speedSymbol}`}
                      </p>
                      <p className="text-[11px] text-cyan-300 capitalize">{p.condition}</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ fill: strokeColor, r: 4, strokeWidth: 2, stroke: "#0c1432" }}
              activeDot={{ r: 6, fill: "#ffffff", stroke: strokeColor, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Quick Strip */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        {chartData.map((hour, i) => (
          <div
            key={i}
            className="flex-1 min-w-[65px] flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center"
          >
            <span className="text-[11px] text-gray-400 font-medium">{hour.time}</span>
            <div className="my-1 w-7 h-7 flex items-center justify-center">
              <Weather3DIcon condition={hour.condition} size="sm" className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-white">
              {hour.temp}{unitSymbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
