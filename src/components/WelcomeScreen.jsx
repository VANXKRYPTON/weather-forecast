import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, CloudRain, Sun, Wind } from "lucide-react";
import Weather3DIcon from "./Weather3DIcon";

export default function WelcomeScreen({ onSelectCity, isLoading }) {
  const quickCities = ["London", "Paris", "Tokyo", "New York", "Patna"];

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 md:py-24 text-center select-none">
      {/* 3D Animated Floating Earth Globe / Weather Illustration */}
      <motion.div
        animate={
          isLoading
            ? { rotate: 360, scale: [1, 1.1, 1] }
            : { y: [0, -10, 0], rotate: [0, 3, -3, 0] }
        }
        transition={{
          duration: isLoading ? 2 : 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-8 relative flex items-center justify-center"
      >
        <div className="text-7xl md:text-8xl filter drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">
          {isLoading ? "🌤️" : "🌍"}
        </div>
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3"
      >
        {isLoading ? "Fetching weather data..." : "Search for a city to see the weather"}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm md:text-base text-gray-400 font-normal mb-10 max-w-lg px-4"
      >
        {isLoading
          ? "Retrieving real-time atmospheric measurements, 5-day forecast & hourly trends..."
          : "Enter a city name above to get current weather, forecasts, air quality and more."}
      </motion.p>

      {/* Quick City Buttons */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-xl w-full px-4"
        >
          {quickCities.map((cityName) => (
            <motion.button
              key={cityName}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectCity(cityName)}
              className="flex-1 min-w-[110px] max-w-[140px] py-2.5 px-5 rounded-full bg-[#0c1432]/80 hover:bg-[#15224e] border border-white/10 hover:border-blue-400/40 text-xs md:text-sm font-semibold text-gray-200 hover:text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all cursor-pointer"
            >
              {cityName}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
