import { motion } from "framer-motion";
import { Clock, Sunrise, Sunset } from "lucide-react";

export default function SunriseCard({ weather }) {
  if (!weather) return null;

  const sunrise = new Date((weather.sys.sunrise + weather.timezone) * 1000);
  const sunset = new Date((weather.sys.sunset + weather.timezone) * 1000);
  const daylight = weather.sys.sunset - weather.sys.sunrise;
  const hours = Math.floor(daylight / 3600);
  const minutes = Math.floor((daylight % 3600) / 60);
  const current = weather.dt - weather.sys.sunrise;
  const progress = Math.min(Math.max((current / daylight) * 100, 0), 100);
  const arcX = 28 + (progress / 100) * 144;
  const arcY = 92 - Math.pow((progress - 50) / 50, 2) * 54;

  const sunriseText = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(sunrise);

  const sunsetText = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(sunset);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[28px] p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white/90">Sunrise & Sunset</h2>
        <Clock className="text-cyan-300" size={18} />
      </div>

      <div className="mt-6 rounded-[26px] border border-white/10 bg-white/6 p-4">
        <div className="flex items-center justify-between text-sm text-white/55">
          <span>Sunrise</span>
          <span>Sunset</span>
        </div>

        <div className="relative mt-3 h-29.5 overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.03))]">
          <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full">
            <path
              d="M 28 92 Q 100 8 172 92"
              fill="none"
              stroke="rgba(255,255,255,.25)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
          </svg>

          <motion.div
            animate={{ x: arcX - 12, y: arcY - 12 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute z-10 h-6 w-6 rounded-full bg-yellow-300 shadow-[0_0_22px_rgba(250,204,21,.9)]"
          />

          <div className="absolute left-4 bottom-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-300">
              <Sunrise size={24} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Sunrise</p>
              <h3 className="text-lg font-semibold text-white">{sunriseText}</h3>
            </div>
          </div>

          <div className="absolute right-4 bottom-3 flex items-center gap-3 text-right">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Sunset</p>
              <h3 className="text-lg font-semibold text-white">{sunsetText}</h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
              <Sunset size={24} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-white/60">
          <span>Daylight</span>
          <span>
            {hours}h {minutes}m
          </span>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-linear-to-r from-yellow-300 via-orange-400 to-pink-500"
          />
        </div>

        <p className="mt-3 text-center text-sm text-white/55">
          {Math.round(progress)}% of daylight completed
        </p>
      </div>
    </motion.div>
  );
}
