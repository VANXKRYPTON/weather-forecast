import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Sparkles,
  Wind,
} from "lucide-react";

import clearBg from "../assets/weather/clear.jpg";
import cloudsBg from "../assets/weather/clouds.jpg";
import rainBg from "../assets/weather/rain.jpg";
import snowBg from "../assets/weather/snow.jpg";
import mistBg from "../assets/weather/mist.jpg";
import thunderBg from "../assets/weather/thunderstorm.jpg";
import defaultBg from "../assets/weather/default.jpg";

function formatLocalDate(weather) {
  const timestamp = weather?.dt;
  const timezone = weather?.timezone ?? 0;

  if (typeof timestamp !== "number") {
    return new Date();
  }

  return new Date((timestamp + timezone) * 1000);
}

function formatWeatherDateTime(date) {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);

  return { dateLabel, timeLabel };
}

function formatInteger(value, unit) {
  if (typeof value !== "number") return "--";
  return `${Math.round(value)}${unit === "imperial" ? "°F" : "°C"}`;
}

function formatValue(value, suffix = "") {
  if (value == null || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${value}${suffix}`;
}

function pickBackdrop(weather) {
  const condition = weather?.weather?.[0]?.main?.toLowerCase();

  if (condition?.includes("thunder")) return thunderBg;
  if (condition?.includes("rain") || condition?.includes("drizzle")) return rainBg;
  if (condition?.includes("snow")) return snowBg;
  if (condition?.includes("mist") || condition?.includes("fog") || condition?.includes("haze")) return mistBg;
  if (condition?.includes("cloud")) return cloudsBg;
  if (condition?.includes("clear")) return clearBg;

  return defaultBg;
}

export default function WeatherHero({ weather, unit = "metric" }) {
  if (!weather) return null;

  const now = formatLocalDate(weather);
  const { dateLabel, timeLabel } = formatWeatherDateTime(now);
  const backdrop = pickBackdrop(weather);

  const metrics = [
    {
      icon: <Droplets size={18} />,
      label: "Humidity",
      value: formatValue(weather.main?.humidity, "%"),
    },
    {
      icon: <Wind size={18} />,
      label: "Wind Speed",
      value: formatValue(weather.wind?.speed, unit === "imperial" ? " mph" : " m/s"),
    },
    {
      icon: <Gauge size={18} />,
      label: "Pressure",
      value: formatValue(weather.main?.pressure, " hPa"),
    },
    {
      icon: <Eye size={18} />,
      label: "Visibility",
      value:
        weather.visibility != null
          ? `${(weather.visibility / 1000).toFixed(1)} km`
          : "--",
    },
    {
      icon: <Sparkles size={18} />,
      label: "Feels Like",
      value: formatInteger(weather.main?.feels_like, unit),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="glass relative isolate overflow-hidden rounded-[34px] shadow-[0_30px_90px_rgba(0,0,0,.3)]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6,13,36,.16), rgba(6,13,36,.78)), url(${backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(129,140,248,.18),transparent_26%),linear-gradient(180deg,rgba(7,12,28,.14),rgba(7,12,28,.72))]" />

      <div className="relative z-10 grid gap-0 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="flex min-w-0 flex-col gap-6 p-6 sm:p-7 xl:p-8">
          <div className="flex flex-wrap items-center gap-3 text-white/88">
            <Badge icon={<MapPin size={16} className="text-cyan-200" />}>
              {weather.name}, {weather.sys?.country || "--"}
            </Badge>

            <Badge icon={<CalendarDays size={16} className="text-white/75" />}>
              {dateLabel}
            </Badge>

            <Badge icon={<Clock3 size={16} className="text-cyan-200" />}>
              {timeLabel}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <h1 className="text-[clamp(4.6rem,8.9vw,7.2rem)] font-black leading-none tracking-[-0.09em] text-white drop-shadow-[0_14px_32px_rgba(0,0,0,.38)]">
                {typeof weather.main?.temp === "number" ? weather.main.temp.toFixed(1) : "--"}
              </h1>

              <span className="mb-2 text-3xl font-semibold text-white/70 sm:text-5xl">
                {unit === "imperial" ? "°F" : "°C"}
              </span>

              <span className="mb-5 rounded-full border border-fuchsia-300/15 bg-fuchsia-500/18 px-3 py-1 text-sm text-fuchsia-100">
                Feels like {formatInteger(weather.main?.feels_like, unit)}
              </span>
            </div>

            <p className="text-2xl font-semibold capitalize text-white sm:text-[2rem]">
              {weather.weather?.[0]?.description || "Current conditions"}
            </p>

            <p className="max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
              Cloudy skies with a gentle breeze. The humidity may make it feel warmer.
            </p>
          </div>

          <div className="grid gap-3 rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        <div className="relative flex min-h-95 min-w-0 items-stretch overflow-hidden border-t border-white/10 xl:min-h-full xl:border-l xl:border-t-0">
          <div className="absolute inset-0 bg-linear-to-b from-white/8 via-white/4 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.28),transparent_16%),radial-gradient(circle_at_68%_36%,rgba(255,255,255,.14),transparent_24%),radial-gradient(circle_at_45%_58%,rgba(59,130,246,.16),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-7 xl:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
                <Sparkles size={14} className="text-cyan-200" />
                Live Weather
              </div>

              <span className="rounded-full border border-white/10 bg-black/16 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/60">
                {weather.weather?.[0]?.main || "Weather"}
              </span>
            </div>

            <motion.div
              className="relative mx-auto flex w-full max-w-85 flex-1 items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon || "01d"}@4x.png`}
                className="weather-float w-70 drop-shadow-[0_0_70px_rgba(255,255,255,.25)]"
                alt={weather.weather?.[0]?.description || "Weather icon"}
              />

              <div className="absolute left-1/2 top-[18%] h-28 w-28 -translate-x-1/2 rounded-full bg-white/20 blur-[60px]" />
            </motion.div>

            <div className="grid grid-cols-2 gap-3 rounded-[28px] border border-white/10 bg-black/16 p-4 text-white/88 backdrop-blur-xl">
              <MiniStat label="Humidity" value={`${weather.main?.humidity ?? "--"}%`} />
              <MiniStat label="Wind" value={`${weather.wind?.speed ?? "--"}${unit === "imperial" ? " mph" : " m/s"}`} />
              <MiniStat label="Pressure" value={`${weather.main?.pressure ?? "--"} hPa`} />
              <MiniStat label="Visibility" value={weather.visibility != null ? `${(weather.visibility / 1000).toFixed(0)} km` : "--"} />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Badge({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm backdrop-blur-xl">
      {icon}
      {children}
    </span>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-white/10 bg-white/8 p-3.5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/60">
          {label}
        </span>
      </div>

      <h3 className="mt-2.5 text-[1.7rem] font-bold leading-none tracking-tight text-white">
        {value}
      </h3>
    </motion.div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
