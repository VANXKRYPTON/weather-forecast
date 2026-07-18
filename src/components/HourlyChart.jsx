
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Clock3,
  Sparkles,
  Thermometer,
  Wind,
  Droplets,
} from "lucide-react";

export default function HourlyChart({ forecast }) {
  if (!forecast) return null;

  const data = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "numeric" }),
    temp: Math.round(item.main.temp),
    feels: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    icon: item.weather[0].icon,
    desc: item.weather[0].main,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass shadow-premium rounded-[34px] p-7 relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Hourly Forecast</h2>
          <div className="flex gap-2 mt-2 text-cyan-300 items-center">
            <Sparkles size={16}/>
            <span className="text-sm">Next 24 Hours</span>
          </div>
        </div>

        <div className="glass rounded-xl px-4 py-2 flex gap-2 items-center">
          <Clock3 size={18}/>
          <span>24H</span>
        </div>
      </div>

      <div className="relative z-10 h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15}/>
            <XAxis dataKey="time" tick={{fill:"#cbd5e1"}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip
              contentStyle={{
                background:"#111827",
                borderRadius:16,
                border:"1px solid rgba(255,255,255,.1)"
              }}
            />

            <Area
              type="monotone"
              dataKey="temp"
              stroke="#38bdf8"
              strokeWidth={4}
              fill="url(#g)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-8">
        {data.map((hour,index)=>(
          <HourCard key={index} hour={hour}/>
        ))}
      </div>
    </motion.section>
  );
}

function HourCard({hour}){
  return(
    <motion.div
      whileHover={{y:-6,scale:1.03}}
      className="glass rounded-3xl border border-white/10 p-5"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-300">{hour.time}</p>
          <h3 className="text-4xl font-black mt-2">{hour.temp}°</h3>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
          className="w-16"
          alt={hour.desc}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <Metric icon={<Thermometer size={16}/>} value={`${hour.feels}°`} label="Feels"/>
        <Metric icon={<Droplets size={16}/>} value={`${hour.humidity}%`} label="Humidity"/>
        <Metric icon={<Wind size={16}/>} value={`${hour.wind}m/s`} label="Wind"/>
      </div>

      <p className="capitalize mt-5 text-center text-slate-300">
        {hour.desc}
      </p>
    </motion.div>
  );
}

function Metric({icon,value,label}){
  return(
    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
      <div className="flex justify-center text-cyan-300">{icon}</div>
      <p className="font-semibold mt-2">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}
