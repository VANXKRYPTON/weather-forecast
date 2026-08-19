import React, { useState, useEffect, useRef } from "react";
import { Search, LocateFixed, RotateCw, Menu, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Weather3DIcon from "./Weather3DIcon";
import { searchCities } from "../services/weatherApi";

export default function HeaderNav({
  cityQuery,
  setCityQuery,
  onSearch,
  unit,
  setUnit,
  onRefresh,
  onGeoLocation,
  onOpenMenu,
  onGoHome,
  isLoading,
  hasCity,
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  const handleRefreshClick = () => {
    setIsSpinning(true);
    onRefresh?.();
    setTimeout(() => setIsSpinning(false), 700);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);
    if (cityQuery?.trim()) {
      onSearch(cityQuery.trim());
    }
  };

  // Debounced geocoding search for worldwide city autocomplete
  useEffect(() => {
    if (!cityQuery || cityQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchCities(cityQuery, 5);
      setSuggestions(results);
      if (results.length > 0) {
        setShowSuggestions(true);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [cityQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    setShowSuggestions(false);
    setCityQuery("");
    onSearch(city.label || city.name);
  };

  return (
    <header className="w-full mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* 1. Left: Brand Logo & Title */}
      <div
        onClick={onGoHome}
        className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        title="Go to Home"
      >
        <div className="w-9 h-9 flex items-center justify-center">
          <Weather3DIcon condition="rain" size="sm" className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight whitespace-nowrap">
          <span className="text-white">Weather </span>
          <span className="text-gradient-header">Dashboard</span>
        </h1>
      </div>

      {/* 2. Center: Sleek In-Line Search Bar with Autocomplete */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-full md:max-w-md lg:max-w-lg w-full mx-auto md:mx-4">
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          {/* Search Icon */}
          <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
            <Search size={16} className="text-gray-400 stroke-[2.2]" />
          </div>

          {/* Search Input Field */}
          <input
            type="text"
            placeholder="Which city do you want to search"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-[#09112a]/85 border border-white/10 text-white placeholder-gray-400 text-xs md:text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-xl transition-all shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
          />

          {/* Location / GPS Icon Button */}
          <button
            type="button"
            onClick={onGeoLocation}
            title="Use current GPS location"
            className="absolute right-3 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LocateFixed size={15} className="stroke-[2.2]" />
          </button>
        </form>

        {/* City Autocomplete Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#0b122e]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl overflow-hidden"
            >
              {suggestions.map((city, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-cyan-300">
                        {city.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {city.state ? `${city.state}, ` : ""}{city.country}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 group-hover:text-white">Select &rarr;</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Right: Action Buttons (Refresh, Unit Switcher, Hamburger Menu) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Refresh Button */}
        {hasCity && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleRefreshClick}
            className="w-11 h-11 rounded-2xl glass-card-sm flex items-center justify-center text-gray-300 hover:text-white hover:border-blue-400/40 transition-all cursor-pointer shadow-md shrink-0"
            title="Refresh weather data"
          >
            <RotateCw
              size={18}
              className={`stroke-[2.2] transition-transform duration-700 ${
                isSpinning || isLoading ? "animate-spin text-blue-400" : ""
              }`}
            />
          </motion.button>
        )}

        {/* Temperature Unit Switcher Pill (°C / °F) with Fixed Width and Equal Columns */}
        <div className="w-28 h-11 p-1 rounded-2xl glass-card-sm grid grid-cols-2 gap-1 items-center shadow-md shrink-0 select-none">
          <button
            type="button"
            onClick={() => setUnit("metric")}
            className={`w-full h-full rounded-xl flex items-center justify-center text-xs md:text-sm font-bold transition-all cursor-pointer ${
              unit === "metric"
                ? "bg-[#2563eb] text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => setUnit("imperial")}
            className={`w-full h-full rounded-xl flex items-center justify-center text-xs md:text-sm font-bold transition-all cursor-pointer ${
              unit === "imperial"
                ? "bg-[#2563eb] text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            °F
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={onOpenMenu}
          className="w-11 h-11 rounded-2xl glass-card-sm flex items-center justify-center text-gray-300 hover:text-white hover:border-blue-400/40 transition-all cursor-pointer shadow-md shrink-0"
          title="More options"
        >
          <Menu size={20} className="stroke-[2.2]" />
        </motion.button>
      </div>
    </header>
  );
}
