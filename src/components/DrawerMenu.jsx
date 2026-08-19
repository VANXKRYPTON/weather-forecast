import { X, Heart, History, BarChart3, Map, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DrawerMenu({
  isOpen,
  onClose,
  favorites = [],
  recentSearches = [],
  onSelectCity,
  onOpenHourlyChart,
  onOpenMap,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#090f28]/95 border-l border-white/10 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌤️</span>
                <h2 className="text-lg font-bold text-white">Weather Dashboard</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Feature Views */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                Features & Views
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onOpenHourlyChart?.();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Hourly Chart</p>
                    <p className="text-[10px] text-gray-400">24-hour trends</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenMap?.();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Map size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Weather Map</p>
                    <p className="text-[10px] text-gray-400">Interactive radar</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Favorite Cities */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                  <Heart size={14} className="text-pink-400" /> Favorite Cities
                </p>
                <span className="text-xs text-gray-500">
                  {favorites.length} saved
                </span>
              </div>

              {favorites.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                  No favorite cities yet. Click the heart button on any city to bookmark it!
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((cityName) => (
                    <button
                      key={cityName}
                      onClick={() => {
                        onSelectCity?.(cityName);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-cyan-400" />
                        <span className="text-sm font-medium text-white group-hover:text-cyan-300">
                          {cityName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">View &rarr;</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Searches */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                <History size={14} className="text-blue-400" /> Recent Searches
              </p>

              {recentSearches.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                  Searched cities will appear here.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSearches.map((cityName) => (
                    <button
                      key={cityName}
                      onClick={() => {
                        onSelectCity?.(cityName);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                    >
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                        {cityName}
                      </span>
                      <span className="text-xs text-gray-500">Search</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Preset Cities */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-400" /> Popular Cities
              </p>
              <div className="flex flex-wrap gap-2">
                {["Patna", "London", "Tokyo", "New York", "Paris", "Dubai", "Sydney", "Mumbai"].map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => {
                      onSelectCity?.(cityName);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-xs text-gray-300 hover:text-white transition-all"
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-gray-500">
              Weather Dashboard Pro &copy; 2026
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
