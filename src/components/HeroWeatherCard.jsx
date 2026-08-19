import React from "react";
import { MapPin, Droplets, Wind, Gauge, Eye, Sun } from "lucide-react";
import stormHeroCloud from "../assets/images/storm_hero_cloud.jpg";

export default function HeroWeatherCard({ weather, unit = "metric" }) {
  if (!weather) return null;

  // Format local date and time using timezone offset
  const localDateObj = getCityLocalDate(weather.dt, weather.timezone);
  const dateFormatted = localDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = localDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const tempNum = typeof weather.temp === "number" ? weather.temp : 34.1;
  const tempFormatted = Number.isInteger(tempNum) ? `${tempNum}.0` : `${tempNum}`;
  const feelsLikeVal =
    typeof weather.feelsLike === "number"
      ? Math.round(weather.feelsLike)
      : "37";
  const unitSymbol = unit === "imperial" ? "°F" : "°C";

  // UV index display
  const uvValue = weather.uvIndex ?? 1;
  const uvLabel =
    uvValue <= 2 ? "Low" : uvValue <= 5 ? "Moderate" : uvValue <= 7 ? "High" : "Very High";

  return (
    <div className="relative overflow-hidden rounded-[26px] hero-glass-card h-full min-h-[390px] p-7 md:p-8 flex flex-col justify-between cursor-pointer select-none">
      {/* 3D Storm Cloud Visual Floating on Right Side with Smooth Radial Masking */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 pointer-events-none overflow-hidden rounded-r-[26px]">
        <div
          className="w-full h-full bg-cover bg-center md:bg-right opacity-90 transition-transform duration-700"
          style={{
            backgroundImage: `url(${stormHeroCloud})`,
            maskImage: "radial-gradient(ellipse at 70% 50%, black 50%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at 70% 50%, black 50%, transparent 85%)",
          }}
        />
      </div>

      {/* Atmospheric dark navy gradient on left for crystal clear typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c132c] via-[#0c132c]/90 to-transparent pointer-events-none" />

      {/* 1. Top Section: Location, Date & Cyan Time */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white">
          <MapPin size={22} className="text-white shrink-0 stroke-[2.4]" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {weather.city}{weather.country ? `, ${weather.country}` : ""}
          </h2>
        </div>
        <p className="text-xs md:text-sm text-gray-300 mt-1 font-normal">{dateFormatted}</p>
        <p className="text-xs md:text-sm font-semibold text-[#00b4d8] mt-0.5">{timeFormatted}</p>
      </div>

      {/* 2. Middle Section: Temperature, Superscript Unit, Feels Like Badge, and Description */}
      <div className="relative z-10 my-3">
        <div className="flex items-center gap-3">
          <div className="flex items-start">
            <span className="text-7xl md:text-8xl lg:text-[88px] font-black text-white leading-none tracking-tighter">
              {tempFormatted}
            </span>
            <span className="text-2xl md:text-3xl font-light text-white ml-1 mt-1 select-none">
              {unitSymbol}
            </span>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-[#24123d] border border-[#9333ea]/40 text-[#c084fc] text-xs font-semibold shadow-[0_0_12px_rgba(147,51,234,0.35)] backdrop-blur-md self-center">
            Feels like {feelsLikeVal}°
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight capitalize">
            {weather.description || weather.condition || "Overcast Clouds"}
          </h3>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-sm leading-relaxed font-normal">
            {weather.summaryText ||
              "Cloudy skies with a gentle breeze. The humidity may make it feel warmer."}
          </p>
        </div>
      </div>

      {/* 3. Bottom Section: Dedicated Floating Glass Pill for the 5 Weather Statistics */}
      <div className="relative z-10 w-full rounded-2xl bg-[#09112a]/85 border border-white/10 p-3.5 px-4 backdrop-blur-xl shadow-inner mt-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-0 items-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {/* 1. Humidity */}
          <div className="flex items-center gap-2.5 px-2">
            <Droplets size={18} className="text-blue-400 fill-blue-400/20 stroke-[2.2] shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-normal leading-tight">Humidity</p>
              <p className="text-xs md:text-sm font-bold text-white mt-0.5 leading-tight">
                {weather.humidity ?? 52}%
              </p>
            </div>
          </div>

          {/* 2. Wind Speed */}
          <div className="flex items-center gap-2.5 px-2 pl-3 pt-2 sm:pt-0">
            <Wind size={18} className="text-emerald-400 stroke-[2.2] shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-normal leading-tight">Wind Speed</p>
              <p className="text-xs md:text-sm font-bold text-white mt-0.5 leading-tight">
                {weather.windSpeed ?? "3.05"} {unit === "imperial" ? "mph" : "m/s"}
              </p>
            </div>
          </div>

          {/* 3. Pressure */}
          <div className="flex items-center gap-2.5 px-2 pl-3 pt-2 sm:pt-0">
            <Gauge size={18} className="text-amber-400 stroke-[2.2] shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-normal leading-tight">Pressure</p>
              <p className="text-xs md:text-sm font-bold text-white mt-0.5 leading-tight">
                {weather.pressure ?? "1002"} hPa
              </p>
            </div>
          </div>

          {/* 4. Visibility */}
          <div className="flex items-center gap-2.5 px-2 pl-3 pt-2 sm:pt-0">
            <Eye size={18} className="text-purple-400 stroke-[2.2] shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-normal leading-tight">Visibility</p>
              <p className="text-xs md:text-sm font-bold text-white mt-0.5 leading-tight">
                {weather.visibility ?? 6} km
              </p>
            </div>
          </div>

          {/* 5. UV Index */}
          <div className="flex items-center gap-2.5 px-2 pl-3 pt-2 sm:pt-0 col-span-2 sm:col-span-1">
            <Sun size={18} className="text-yellow-400 fill-yellow-400/20 stroke-[2.2] shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-normal leading-tight">UV Index</p>
              <p className="text-xs md:text-sm font-bold text-white mt-0.5 leading-tight">
                {uvValue} {uvLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCityLocalDate(dt, timezoneOffsetSeconds = 0) {
  if (!dt) return new Date();
  const cityMs = (dt + timezoneOffsetSeconds) * 1000;
  return new Date(cityMs);
}
