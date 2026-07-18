import { motion } from "framer-motion";
import {
  Cloud,
  Droplets,
  Sparkles,
  Thermometer,
} from "lucide-react";

const METRIC_CONFIG = [
  {
    title: "Max Temp",
    subtitle: "Daily high",
    icon: Thermometer,
    tone: "from-rose-400/25 via-pink-400/15 to-transparent",
  },
  {
    title: "Min Temp",
    subtitle: "Daily low",
    icon: Thermometer,
    tone: "from-cyan-400/25 via-blue-300/15 to-transparent",
  },
  {
    title: "Chance of Rain",
    subtitle: "Likely precipitation",
    icon: Droplets,
    tone: "from-sky-400/25 via-cyan-300/15 to-transparent",
  },
  {
    title: "Cloud Cover",
    subtitle: "Sky coverage",
    icon: Cloud,
    tone: "from-slate-300/25 via-slate-400/15 to-transparent",
  },
];

export default function Highlights({ weather }) {
  if (!weather) return null;

  const rainChance = Math.max(
    0,
    Math.min(
      100,
      Math.round((weather.clouds?.all ?? 0) * 0.55 + (weather.main?.humidity ?? 0) * 0.35)
    )
  );

  const metrics = [
    {
      ...METRIC_CONFIG[0],
      value: weather.main?.temp_max != null ? `${Math.round(weather.main.temp_max)}°` : "--",
      progress: normalizeTemperatureProgress(weather.main?.temp_max),
    },
    {
      ...METRIC_CONFIG[1],
      value: weather.main?.temp_min != null ? `${Math.round(weather.main.temp_min)}°` : "--",
      progress: normalizeTemperatureProgress(weather.main?.temp_min),
    },
    {
      ...METRIC_CONFIG[2],
      value: `${rainChance}%`,
      progress: rainChance,
    },
    {
      ...METRIC_CONFIG[3],
      value: weather.clouds?.all != null ? `${weather.clouds.all}%` : "--",
      progress: weather.clouds?.all ?? 0,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass relative overflow-hidden rounded-[28px] p-5"
    >
      <AuroraBackdrop />

      <div className="relative z-10 space-y-5">
        <Header />

        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric, index) => (
            <HighlightCard key={metric.title} metric={metric} delay={index * 0.05} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function normalizeTemperatureProgress(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  const normalized = ((value + 20) / 60) * 100;
  return Math.min(Math.max(normalized, 0), 100);
}

function AuroraBackdrop() {
  return (
    <>
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/18 blur-[120px]" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-400/18 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
    </>
  );
}

function Header() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/65 backdrop-blur-xl">
          <Sparkles size={14} className="text-cyan-200" />
          Today&apos;s Highlights
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
            Today&apos;s Highlights
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            A compact dashboard for the key conditions that shape comfort, visibility, and air movement.
          </p>
        </div>
      </div>

      <div className="hidden rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-right backdrop-blur-xl sm:block">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">Live</p>
        <p className="mt-1 text-sm font-medium text-white/85">At a glance</p>
      </div>
    </div>
  );
}

function HighlightCard({ metric, delay }) {
  const Icon = metric.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      <div className={`absolute inset-0 bg-linear-to-br ${metric.tone} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-white/45">{metric.title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{metric.value}</h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(metric.progress, 100)}%` }}
          transition={{ duration: 0.8, delay: delay + 0.1 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400"
        />
      </div>

      <p className="relative z-10 mt-3 text-sm leading-6 text-white/60">{metric.subtitle}</p>
    </motion.article>
  );
}
