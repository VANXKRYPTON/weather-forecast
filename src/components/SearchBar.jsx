import { Search, MapPin, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (!city.trim()) return;
    onSearch(city);
  };

  const clearSearch = () => {
    setCity("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl"
    >
      <div className="glass h-16 rounded-full px-6 flex items-center gap-4 border border-white/10">

        <Search
          size={22}
          className="text-cyan-400 cursor-pointer hover:scale-110 transition"
          onClick={handleSearch}
        />

        <input
          type="text"
          placeholder="Search city, country..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 text-lg"
        />

        {city && (
          <button
            onClick={clearSearch}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

        <button
          className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition"
        >
          <MapPin size={18} />
        </button>

      </div>
    </motion.div>
  );
}