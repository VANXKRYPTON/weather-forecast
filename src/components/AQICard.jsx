import { Leaf } from "lucide-react";

const AQI_LEVELS = {
  1: {
    label: "Good",
    color: "#22c55e",
    textColor: "text-green-400",
    bgColor: "bg-green-500/10",
    advice: "Air quality is satisfactory for most people.",
  },
  2: {
    label: "Fair",
    color: "#84cc16",
    textColor: "text-lime-400",
    bgColor: "bg-lime-500/10",
    advice: "Acceptable for most outdoor activities.",
  },
  3: {
    label: "Moderate",
    color: "#facc15",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    advice: "Sensitive people should limit outdoor exposure.",
  },
  4: {
    label: "Poor",
    color: "#f97316",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    advice: "Reduce outdoor exertion, keep windows closed.",
  },
  5: {
    label: "Very Poor",
    color: "#ef4444",
    textColor: "text-red-400",
    bgColor: "bg-red-500/10",
    advice: "Stay indoors and avoid physical exertion.",
  },
};

export default function AQICard({ airQuality, airQualityStatus }) {
  if (airQuality == null) return null;

  const current =
    airQuality <= 30
      ? AQI_LEVELS[1]
      : airQuality <= 60
        ? AQI_LEVELS[2]
        : airQuality <= 90
          ? AQI_LEVELS[3]
          : airQuality <= 120
            ? AQI_LEVELS[4]
            : AQI_LEVELS[5];

  const statusLabel = airQualityStatus || current.label;
  const percentage = Math.min((airQuality / 150) * 100, 100);

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <Leaf className="h-4 w-4 text-emerald-400" />
        Air Quality Index
      </h3>
      <div className="backdrop-glass flex items-center gap-6 rounded-2xl p-6">
        {/* Circular Gauge */}
        <div className="relative h-28 w-28 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={current.color}
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 282} 282`}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50px 50px",
                transition: "stroke-dasharray 0.6s ease-out",
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{Math.round(airQuality)}</span>
            <span className={`mt-1 text-xs font-semibold ${current.textColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Text section */}
        <div>
          <div className={`mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${current.bgColor} ${current.textColor}`}>
            {statusLabel}
          </div>
          <p className="text-sm text-gray-400">{current.advice}</p>
        </div>
      </div>
    </div>
  );
}
