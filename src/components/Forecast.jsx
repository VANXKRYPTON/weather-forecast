import { motion } from "framer-motion";
import {
  CalendarDays,
  Droplets,
  Wind,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Thermometer,
} from "lucide-react";

export default function Forecast({ forecast, unit = "metric" }) {
  if (!forecast) return null;

  const dailyForecast = getDailyForecast(forecast.list).slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative overflow-hidden rounded-[28px] p-5"
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/18 blur-[120px]" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/18 blur-[120px]" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">5-Day Forecast</h2>
          <div className="mt-2 flex items-center gap-2 text-cyan-300">
            <Sparkles size={16} />
            <span className="text-sm">Weekly Weather Outlook</span>
          </div>
        </div>

        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/75">
          <CalendarDays size={18} />
          <span>Next Week</span>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid gap-4 xl:grid-cols-5">
        {dailyForecast.map((day, index) => (
          <ForecastCard key={day.dt} day={day} index={index} unit={unit} />
        ))}
      </div>
    </motion.section>
  );
}

function getDailyForecast(list) {
  const byDay = new Map();

  for (const item of list) {
    const key = new Date(item.dt * 1000).toLocaleDateString("en-CA");
    if (!byDay.has(key)) {
      byDay.set(key, item);
    }
  }

  return Array.from(byDay.values());
}

function ForecastCard({ day, index, unit }) {
  const date = new Date(day.dt * 1000);
  const isActive = index === 2;
  const dayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);

  const weekdayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative overflow-hidden rounded-[26px] border p-5 ${
        isActive
          ? "border-blue-300/60 bg-[linear-gradient(180deg,rgba(61,125,255,.18),rgba(10,18,49,.62))] shadow-[0_18px_45px_rgba(76,120,255,.22)]"
          : "border-white/10 bg-white/6"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.08),transparent_36%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-white/92">{dayLabel}</h3>
            <p className="mt-1 text-sm text-white/55">{weekdayLabel}</p>
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}
            alt={day.weather[0].description}
            className="relative z-10 w-16 drop-shadow-[0_0_20px_rgba(255,255,255,.2)]"
          />
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-black tracking-tight text-white">
            {Math.round(day.main.temp)}°
          </span>

          <span className="mb-2 text-sm text-white/55">
            {day.weather[0].main}
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((day.main.temp / 45) * 100, 100)}%` }}
            className={`h-full rounded-full ${isActive ? "bg-linear-to-r from-fuchsia-400 via-blue-400 to-cyan-300" : "bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500"}`}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Info icon={<ArrowUp size={16} />} label="High" value={`${Math.round(day.main.temp_max)}°`} />
          <Info icon={<ArrowDown size={16} />} label="Low" value={`${Math.round(day.main.temp_min)}°`} />
          <Info icon={<Wind size={16} />} label="Wind" value={`${day.wind.speed}${unit === "imperial" ? " mph" : " m/s"}`} />
          <Info icon={<Droplets size={16} />} label="Humidity" value={`${day.main.humidity}%`} />
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 p-3">
          <Thermometer className="text-cyan-300" size={18} />
          <div>
            <p className="text-xs text-white/45">Feels Like</p>
            <p className="font-semibold text-white">
              {Math.round(day.main.feels_like)}{unit === "imperial" ? "°F" : "°C"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm capitalize text-white/55">
          {day.weather[0].description}
        </p>
      </div>
    </motion.div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}
