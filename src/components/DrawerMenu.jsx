import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  History,
  BarChart3,
  Map,
  Sparkles,
  MapPin,
  ChevronRight,
  Clock,
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  Grid,
  Landmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Landmark color accents for the 8 popular destinations matching Image 2
const POPULAR_DESTINATIONS = [
  { name: "Tokyo", icon: "tower", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)" },
  { name: "London", icon: "bigben", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  { name: "New York", icon: "liberty", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  { name: "Paris", icon: "eiffel", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" },
  { name: "Dubai", icon: "burj", color: "#c084fc", bg: "rgba(192, 132, 252, 0.15)" },
  { name: "Sydney", icon: "bridge", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)" },
  { name: "Patna", icon: "monument", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
  { name: "Mumbai", icon: "gateway", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)" },
];

const CITY_SNAPSHOTS = {
  paris: { temp: "18°C", icon: "cloud-sun" },
  tokyo: { temp: "26°C", icon: "sun" },
  london: { temp: "16°C", icon: "cloud" },
  "new york": { temp: "22°C", icon: "cloud-sun" },
  patna: { temp: "29°C", icon: "sun" },
  indore: { temp: "30°C", icon: "sun" },
  mumbai: { temp: "28°C", icon: "cloud-rain" },
  "new delhi": { temp: "31°C", icon: "cloud-sun" },
  dubai: { temp: "38°C", icon: "sun" },
  sydney: { temp: "21°C", icon: "cloud-sun" },
};

function renderWeatherIcon(type) {
  switch (type) {
    case "sun":
      return <Sun size={17} className="text-yellow-400 shrink-0 stroke-[2.2]" />;
    case "cloud-sun":
      return <CloudSun size={17} className="text-amber-300 shrink-0 stroke-[2.2]" />;
    case "cloud-rain":
      return <CloudRain size={17} className="text-blue-400 shrink-0 stroke-[2.2]" />;
    case "cloud":
    default:
      return <Cloud size={17} className="text-gray-300 shrink-0 stroke-[2.2]" />;
  }
}

function renderDestinationIcon(type, color) {
  switch (type) {
    case "tower":
    case "eiffel":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M9 6l3-4 3 4M6 22l4.5-12h3L18 22M8 17h8" />
        </svg>
      );
    case "bigben":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <circle cx="12" cy="8" r="2.5" />
          <path d="M12 14v4" />
        </svg>
      );
    case "liberty":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2 4-2 4-2-4zM8 12h8l-2 10H10zM12 12v10" />
        </svg>
      );
    case "burj":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M8 8l4-6 4 6M6 14l6-4 6 4M4 20l8-4 8 4" />
        </svg>
      );
    case "bridge":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18c3-4 6-6 9-6s6 2 9 6M3 18h18M6 12v6M18 12v6M12 6v12" />
        </svg>
      );
    case "monument":
    case "gateway":
    default:
      return <Landmark size={16} style={{ color }} />;
  }
}

export default function DrawerMenu({
  isOpen,
  onClose,
  favorites = ["Paris", "Tokyo", "London", "New York", "Patna"],
  recentSearches = ["Indore", "Mumbai", "Patna", "New Delhi", "Paris"],
  onSelectCity,
  onOpenHourlyChart,
  onOpenMap,
  onClearRecentSearches,
  onRemoveRecentSearch,
}) {
  const [localRecent, setLocalRecent] = useState(recentSearches);

  useEffect(() => {
    setLocalRecent(recentSearches);
  }, [recentSearches]);

  const handleClearAll = (e) => {
    e.stopPropagation();
    setLocalRecent([]);
    onClearRecentSearches?.();
  };

  const handleRemoveItem = (e, cityName) => {
    e.stopPropagation();
    setLocalRecent((prev) => prev.filter((c) => c !== cityName));
    onRemoveRecentSearch?.(cityName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* 2. Floating Card Dialog Panel matching 1:1 Reference Image */}
          <div className="fixed inset-0 z-50 pointer-events-none flex justify-end p-4 sm:p-5 md:p-6">
            <motion.div
              initial={{ x: "110%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "110%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="pointer-events-auto w-full max-w-[500px] h-full max-h-[96vh] rounded-[32px] bg-[#09102c]/95 border border-blue-500/20 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-3xl p-7 md:p-8 overflow-y-auto flex flex-col justify-between select-none scrollbar-thin scrollbar-thumb-blue-500/20"
            >
              <div className="space-y-6 md:space-y-7">
                {/* Header: App Icon, Title, and Close Pill */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4a85f6] to-[#2563eb] p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center">
                        <CloudSun size={28} className="text-white drop-shadow-md" />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                        Weather <span className="text-[#60a5fa]">Dashboard</span>
                      </h2>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">Global Forecast Pro</p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-11 h-11 rounded-2xl bg-[#131d42] hover:bg-[#1c2a5e] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105 shrink-0"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Section 1: FEATURES & VIEWS */}
                <div>
                  <div className="flex items-center gap-2 mb-3.5 text-gray-400">
                    <Grid size={14} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Features & Views
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Hourly Chart Tile */}
                    <button
                      onClick={() => {
                        onOpenHourlyChart?.();
                        onClose();
                      }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#10193d]/85 hover:bg-[#152252] border border-white/5 hover:border-blue-400/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <BarChart3 size={19} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white leading-tight">Hourly Chart</p>
                          <p className="text-[11px] text-gray-400 leading-tight mt-1">24-hour trends</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>

                    {/* Weather Map Tile */}
                    <button
                      onClick={() => {
                        onOpenMap?.();
                        onClose();
                      }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#10193d]/85 hover:bg-[#152252] border border-white/5 hover:border-cyan-400/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <Map size={19} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white leading-tight">Weather Map</p>
                          <p className="text-[11px] text-gray-400 leading-tight mt-1">Interactive radar</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Section 2: FAVORITE CITIES */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Heart size={14} className="text-pink-400 fill-pink-400/20" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Favorite Cities
                      </span>
                    </div>
                    <span className="text-xs font-bold text-pink-400">
                      {favorites.length} saved
                    </span>
                  </div>

                  <div className="space-y-3">
                    {favorites.map((cityName) => {
                      const snap = CITY_SNAPSHOTS[cityName.toLowerCase()] || { temp: "24°C", icon: "sun" };
                      return (
                        <button
                          key={cityName}
                          onClick={() => {
                            onSelectCity?.(cityName);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl bg-[#10193d]/80 hover:bg-[#162354] border border-white/5 hover:border-pink-400/30 transition-all group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                              <MapPin size={17} />
                            </div>
                            <span className="text-sm font-bold text-white group-hover:text-pink-200 transition-colors">
                              {cityName}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-300 font-medium min-w-[34px] text-right">{snap.temp}</span>
                            <div className="w-5 flex items-center justify-center">
                              {renderWeatherIcon(snap.icon)}
                            </div>
                            <ChevronRight size={16} className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-0.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: RECENT SEARCHES */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <History size={14} className="text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Recent Searches
                      </span>
                    </div>

                    {localRecent.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-xs font-bold text-[#38bdf8] hover:underline transition-all cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {localRecent.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-[#10193d]/50 border border-white/5 text-center text-xs text-gray-400">
                        No recent searches
                      </div>
                    ) : (
                      localRecent.slice(0, 5).map((cityName) => {
                        const snap = CITY_SNAPSHOTS[cityName.toLowerCase()] || { temp: "27°C", icon: "sun" };
                        return (
                          <div
                            key={cityName}
                            onClick={() => {
                              onSelectCity?.(cityName);
                              onClose();
                            }}
                            className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl bg-[#10193d]/80 hover:bg-[#162354] border border-white/5 hover:border-blue-400/30 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                <Clock size={17} />
                              </div>
                              <span className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                                {cityName}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-gray-300 font-medium min-w-[34px] text-right">{snap.temp}</span>
                              <div className="w-5 flex items-center justify-center">
                                {renderWeatherIcon(snap.icon)}
                              </div>
                              <button
                                onClick={(e) => handleRemoveItem(e, cityName)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all ml-1"
                                title="Remove"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Section 4: POPULAR DESTINATIONS (4x2 Grid) */}
                <div>
                  <div className="flex items-center gap-2 mb-3.5 text-gray-400">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Popular Destinations
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {POPULAR_DESTINATIONS.map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => {
                          onSelectCity?.(dest.name);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-2 py-3 px-2 rounded-2xl bg-[#10193d]/85 hover:bg-[#162354] border border-white/5 hover:border-white/20 transition-all hover:scale-[1.03] active:scale-95 group shadow-sm"
                      >
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: dest.bg }}
                        >
                          {renderDestinationIcon(dest.icon, dest.color)}
                        </div>
                        <span className="text-xs font-bold text-gray-200 group-hover:text-white truncate">
                          {dest.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-400">
                <CloudSun size={16} className="text-amber-400" />
                <span>Weather Dashboard Pro • v2.0</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
