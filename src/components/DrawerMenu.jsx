import React from "react";
import { X, Heart, History, BarChart3, Map, Sparkles, MapPin, ChevronRight, Trash2, CloudSun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DrawerMenu({
  isOpen,
  onClose,
  favorites = [],
  recentSearches = [],
  onSelectCity,
  onOpenHourlyChart,
  onOpenMap,
  onClearRecentSearches,
}) {
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
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
          />

          {/* 2. Glassmorphism Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-[#0c1435]/95 border-l border-white/15 p-6 md:p-7 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-y-auto flex flex-col justify-between select-none"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <CloudSun size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                      Weather <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Dashboard</span>
                    </h2>
                    <p className="text-[11px] text-gray-400">Global Forecast Pro</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Feature Views */}
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-yellow-400" /> Features & Views
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onOpenHourlyChart?.();
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-blue-600/15 border border-white/10 hover:border-blue-400/40 text-left transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">Hourly Chart</p>
                      <p className="text-[10px] text-gray-400">24-hour trends</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenMap?.();
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-cyan-600/15 border border-white/10 hover:border-cyan-400/40 text-left transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all shrink-0">
                      <Map size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Weather Map</p>
                      <p className="text-[10px] text-gray-400">Interactive radar</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Favorite Cities */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                    <Heart size={13} className="text-pink-400 fill-pink-400/20" /> Favorite Cities
                  </p>
                  <span className="text-[11px] font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                    {favorites.length} saved
                  </span>
                </div>

                {favorites.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                    No favorite cities yet. Click the heart icon to bookmark any city!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {favorites.map((cityName) => (
                      <button
                        key={cityName}
                        onClick={() => {
                          onSelectCity?.(cityName);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-400/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                            <MapPin size={13} />
                          </div>
                          <span className="text-xs md:text-sm font-medium text-white group-hover:text-pink-200 transition-colors">
                            {cityName}
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Searches */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                    <History size={13} className="text-blue-400" /> Recent Searches
                  </p>
                </div>

                {recentSearches.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                    Searched cities will appear here.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {recentSearches.slice(0, 6).map((cityName) => (
                      <button
                        key={cityName}
                        onClick={() => {
                          onSelectCity?.(cityName);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-400/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <History size={12} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                          <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                            {cityName}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 group-hover:text-blue-300">View &rarr;</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Worldwide Cities */}
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" /> Popular Destinations
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Tokyo", "London", "New York", "Paris", "Dubai", "Sydney", "Patna", "Mumbai"].map((cityName) => (
                    <button
                      key={cityName}
                      onClick={() => {
                        onSelectCity?.(cityName);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/40 text-xs font-medium text-gray-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                    >
                      {cityName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-gray-400">
                Weather Dashboard Pro &bull; v2.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
