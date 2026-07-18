import {
  Search,
  LocateFixed,
  RotateCw,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({
  city,
  setCity,
  searchWeather,
  unit,
  setUnit,
  getCurrentLocation,
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass sticky top-4 z-50 rounded-[28px] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,.24)] backdrop-blur-2xl sm:px-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3 min-w-fit">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            transition={{ duration: 0.3 }}
            className="text-4xl"
          >
            🌤️
          </motion.div>

          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Weather <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 xl:max-w-4xl xl:px-4">
          <div className="glass flex h-12 flex-1 items-center gap-3 rounded-full px-4 sm:h-14 sm:px-5">
            <Search size={20} className="text-white/70" />

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchWeather();
                }
              }}
              placeholder="Search city"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/45 sm:text-base"
            />

            <button
              onClick={getCurrentLocation}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/6 text-white/85 hover:bg-white/12"
              aria-label="Use my location"
            >
              <LocateFixed size={18} />
            </button>
          </div>

          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.45 }}
            onClick={searchWeather}
            className="glass flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
            aria-label="Refresh weather"
          >
            <RotateCw size={20} />
          </motion.button>

          <div className="glass inline-flex h-12 items-center overflow-hidden rounded-full border border-white/10 sm:h-14">
            <button
              onClick={() => setUnit("metric")}
              className={`px-4 py-2 text-sm font-semibold sm:px-6 sm:text-base ${
                unit === "metric" ? "bg-blue-500 text-white shadow-[0_8px_24px_rgba(37,99,235,.45)]" : "text-white/70"
              }`}
            >
              °C
            </button>

            <button
              onClick={() => setUnit("imperial")}
              className={`px-4 py-2 text-sm font-semibold sm:px-6 sm:text-base ${
                unit === "imperial" ? "bg-blue-500 text-white shadow-[0_8px_24px_rgba(37,99,235,.45)]" : "text-white/70"
              }`}
            >
              °F
            </button>
          </div>

          <button
            className="glass hidden h-12 w-12 items-center justify-center rounded-full xl:flex"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

    </motion.header>
  );
}