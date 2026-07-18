import { useState } from "react";
import { motion } from "framer-motion";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";

import {
  Map,
  Navigation,
  Thermometer,
  Cloud,
  Compass,
} from "lucide-react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const mapThemes = {
  street: {
    name: "Street",
    url: "https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=TGzvgEOvpHwVvw4WH9Pd",
  },

  light: {
    name: "Light",
    url: "https://api.maptiler.com/maps/landscape-v4/256/{z}/{x}/{y}.png?key=TGzvgEOvpHwVvw4WH9Pd",
  },

  dark: {
    name: "Dark",
    url: "https://api.maptiler.com/maps/alidade_smooth_dark/{z}/{x}/{y}.png?key=TGzvgEOvpHwVvw4WH9Pd",
  },

  satellite: {
    name: "Satellite",
    url: "https://api.maptiler.com/maps/hybrid-v4/256/{z}/{x}/{y}.jpg?key=TGzvgEOvpHwVvw4WH9Pd",
    disabled: true,
  },
};

export default function WeatherMap({ weather }) {
  const [theme, setTheme] = useState("dark");

  if (!weather) return null;

  const position = [
    weather.coord.lat,
    weather.coord.lon,
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="relative overflow-hidden rounded-[32px]
      bg-white/10
      backdrop-blur-2xl
      border
      border-white/10
      shadow-2xl"
    >
      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-5 items-center p-6 border-b border-white/10">

        <div>

          <h2 className="text-3xl font-bold flex items-center gap-3">

            <Map className="text-cyan-400" />

            Weather Map

          </h2>

          <p className="text-gray-300 mt-2">

            Interactive weather location

          </p>

        </div>

        {/* Theme Buttons */}

        <div className="flex gap-3 flex-wrap">

          {Object.entries(mapThemes).map(([key, value]) => (

            <button
              key={key}
              disabled={value.disabled}
              onClick={() => setTheme(key)}
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                transition
                backdrop-blur-lg
                border
                ${
                  theme === key
                    ? "bg-cyan-500 text-white border-cyan-400"
                    : "bg-white/10 border-white/10 hover:bg-white/20"
                }
                ${value.disabled && "opacity-50 cursor-not-allowed"}
              `}
            >
              {value.name}
            </button>

          ))}

        </div>

      </div>

      {/* Floating Weather Card */}

      <div className="absolute top-24 left-6 z-[1000]">

        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          className="rounded-3xl
          bg-black/50
          backdrop-blur-xl
          border
          border-white/10
          p-5
          w-[260px]"
        >

          <div className="flex items-center gap-3">

            <Navigation className="text-cyan-400" />

            <div>

              <h3 className="font-semibold text-xl">

                {weather.name}

              </h3>

              <p className="text-gray-300 text-sm">

                {weather.sys.country}

              </p>

            </div>

          </div>

          <div className="mt-6 flex items-center gap-5">

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=""
              className="w-20"
            />

            <div>

              <h1 className="text-5xl font-black">

                {Math.round(weather.main.temp)}°

              </h1>

              <p className="capitalize text-gray-300">

                {weather.weather[0].description}

              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">

            <Info
              icon={<Thermometer size={18} />}
              label="Feels Like"
              value={`${Math.round(weather.main.feels_like)}°`}
            />

            <Info
              icon={<Cloud size={18} />}
              label="Humidity"
              value={`${weather.main.humidity}%`}
            />

            <Info
              icon={<Compass size={18} />}
              label="Wind"
              value={`${weather.wind.speed} m/s`}
            />

            <Info
              icon={<Navigation size={18} />}
              label="Pressure"
              value={`${weather.main.pressure}`}
            />

          </div>

        </motion.div>

      </div>

      {/* Map */}

      <div className="h-[600px]">

        <MapContainer
          center={position}
          zoom={10}
          zoomControl={false}
          style={{
            width: "100%",
            height: "100%",
          }}
        >

          <ZoomControl position="bottomright" />

          <ScaleControl />

          <TileLayer
            attribution="© MapTiler © OpenStreetMap contributors"
            url={`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=CQBEjFT6dRjZw76EWROA`}
        />

          <Marker position={position}>

            <Popup>

              <div className="text-black p-1">

                <h3 className="font-bold">

                  {weather.name}

                </h3>

                <p>

                  {Math.round(weather.main.temp)}°C

                </p>

                <p className="capitalize">

                  {weather.weather[0].description}

                </p>

              </div>

            </Popup>

          </Marker>

          {/* Accuracy Circle */}

          <circle
            center={position}
            radius={2500}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.08,
              weight: 2,
            }}
          />
        </MapContainer>
      </div>

      {/* Bottom Info Bar */}

      <div className="border-t border-white/10 p-6">

        <div className="grid md:grid-cols-4 gap-5">

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4"
          >
            <p className="text-sm text-gray-400">
              Latitude
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {weather.coord.lat.toFixed(2)}
            </h3>

          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4"
          >
            <p className="text-sm text-gray-400">
              Longitude
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {weather.coord.lon.toFixed(2)}
            </h3>

          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4"
          >
            <p className="text-sm text-gray-400">
              Zoom
            </p>

            <h3 className="text-2xl font-bold mt-2">
              10x
            </h3>

          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4"
          >
            <p className="text-sm text-gray-400">
              Map Theme
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {mapThemes[theme].name}
            </h3>

          </motion.div>

        </div>

        {/* Legend */}

        <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-300">

          <div className="flex items-center gap-2">

            <div className="w-4 h-4 rounded-full bg-cyan-400" />

            City Location

          </div>

          <div className="flex items-center gap-2">

            <div className="w-4 h-4 rounded-full bg-green-400" />

            Weather Marker

          </div>

          <div className="flex items-center gap-2">

            <div className="w-4 h-4 rounded-full bg-yellow-400" />

            Interactive Popup

          </div>

          <div className="flex items-center gap-2">

            <div className="w-4 h-4 rounded-full bg-purple-400" />

            Theme Switcher

          </div>

        </div>

        {/* Satellite Placeholder */}

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-5">

          <h3 className="font-semibold text-lg">

            🚀 Upgrade Available

          </h3>

          <p className="text-gray-300 mt-2">

            Add a MapTiler or Mapbox API key to enable high-resolution
            satellite imagery, terrain maps, rainfall radar,
            temperature overlays, wind animations, and cloud layers.

          </p>

        </div>

      </div>

    </motion.div>
  );
}

function Info({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl p-3"
    >
      <div className="flex items-center gap-2 text-cyan-300">

        {icon}

        <span className="text-xs">

          {label}

        </span>

      </div>

      <h4 className="mt-3 text-lg font-semibold">

        {value}

      </h4>

    </motion.div>
  );
}

