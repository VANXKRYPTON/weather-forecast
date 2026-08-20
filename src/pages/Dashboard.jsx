import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Heart, X, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Components
import HeaderNav from "../components/HeaderNav";
import WelcomeScreen from "../components/WelcomeScreen";
import HeroWeatherCard from "../components/HeroWeatherCard";
import AirQualityCard from "../components/AirQualityCard";
import SunriseSunsetCard from "../components/SunriseSunsetCard";
import TodayHighlightsCard from "../components/TodayHighlightsCard";
import ForecastSection from "../components/ForecastSection";
import HourlyChart from "../components/HourlyChart";
import DrawerMenu from "../components/DrawerMenu";
import WeatherMap from "../components/WeatherMap";
import LiveWeatherBackground from "../components/LiveWeatherBackground";

// API services
import { getComprehensiveWeather } from "../services/weatherApi";

export default function Dashboard() {
  const [cityQuery, setCityQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  // Stored raw normalized weather & 5 days (starts as null on initial load, NO hardcoded default city)
  const [rawWeather, setRawWeather] = useState(null);
  const [raw5Days, setRaw5Days] = useState([]);
  const [selectedForecastIndex, setSelectedForecastIndex] = useState(0); // Card 1 (Today) active by default

  const [unit, setUnit] = useState("metric"); // 'metric' (°C) | 'imperial' (°F)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals & Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Favorites & Search History (stored in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("weather_fav_cities");
      return saved ? JSON.parse(saved) : ["Paris", "Tokyo", "London", "New York", "Patna"];
    } catch {
      return ["Paris", "Tokyo", "London", "New York", "Patna"];
    }
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("weather_recent_searches");
      return saved ? JSON.parse(saved) : ["Paris", "Tokyo", "London"];
    } catch {
      return ["Paris", "Tokyo", "London"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("weather_fav_cities", JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("weather_recent_searches", JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert raw normalized data to active unit dynamically
  const isImperial = unit === "imperial";

  const dailyForecast = useMemo(() => {
    if (!raw5Days || raw5Days.length === 0) return [];
    return raw5Days.map((d) => ({
      ...d,
      temp: isImperial ? d.tempF : d.tempC,
      feelsLike: isImperial ? d.feelsLikeF : d.feelsLikeC,
      maxTemp: isImperial ? d.maxTempF : d.maxTempC,
      minTemp: isImperial ? d.minTempF : d.minTempC,
      windSpeed: isImperial ? d.windSpeedMph : d.windSpeedKmh,
      hourly: (d.hourly || []).map((h) => ({
        ...h,
        temp: isImperial ? h.tempF : h.tempC,
        windSpeed: isImperial ? h.windSpeedMph : h.windSpeedKmh,
      })),
    }));
  }, [raw5Days, isImperial]);

  const weather = useMemo(() => {
    if (!rawWeather) return null;

    if (selectedForecastIndex === 0 || !dailyForecast[selectedForecastIndex]) {
      return {
        ...rawWeather,
        temp: isImperial ? rawWeather.tempF : rawWeather.tempC,
        feelsLike: isImperial ? rawWeather.feelsLikeF : rawWeather.feelsLikeC,
        maxTemp: isImperial ? rawWeather.maxTempF : rawWeather.maxTempC,
        minTemp: isImperial ? rawWeather.minTempF : rawWeather.minTempC,
        windSpeed: isImperial ? rawWeather.windSpeedMph : rawWeather.windSpeedKmh,
      };
    }

    const selectedDay = dailyForecast[selectedForecastIndex];
    return {
      ...rawWeather,
      temp: selectedDay.temp,
      feelsLike: selectedDay.feelsLike,
      maxTemp: selectedDay.maxTemp,
      minTemp: selectedDay.minTemp,
      windSpeed: selectedDay.windSpeed,
      condition: selectedDay.condition,
      description: selectedDay.description || selectedDay.condition,
      humidity: selectedDay.humidity,
      rainChance: selectedDay.rainChance,
      cloudCover: selectedDay.cloudCover,
      summaryText: selectedDay.summaryText || `Forecasted ${selectedDay.condition} with temperatures around ${selectedDay.temp}°.`,
    };
  }, [rawWeather, dailyForecast, selectedForecastIndex, isImperial]);

  // Fetch weather dynamically for any searched city
  const fetchWeather = useCallback(async (cityNameOrQuery) => {
    if (!cityNameOrQuery) return;

    setLoading(true);
    setError("");

    try {
      const result = await getComprehensiveWeather(cityNameOrQuery);
      setCurrentLocation(result.locationInfo);
      setRawWeather(result.rawWeather);
      setRaw5Days(result.raw5Days);
      setSelectedForecastIndex(0); // Show Current Day (Today) by default

      setRecentSearches((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== result.locationInfo.cityName.toLowerCase());
        return [result.locationInfo.cityName, ...filtered].slice(0, 8);
      });
    } catch (err) {
      console.error(err);
      setError("City not found. Please check the city name and try again.");
      showToast(`City not found. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // GPS Geolocation handler
  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser");
      return;
    }

    showToast("Detecting your location...");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const result = await getComprehensiveWeather(`${latitude},${longitude}`);
          setCurrentLocation(result.locationInfo);
          setRawWeather(result.rawWeather);
          setRaw5Days(result.raw5Days);
          setSelectedForecastIndex(0); // Show Current Day (Today) by default
          showToast(`Location loaded: ${result.locationInfo.cityName}`);
        } catch (err) {
          console.error(err);
          showToast("Failed to fetch location weather data");
        } finally {
          setLoading(false);
        }
      },
      () => {
        showToast("Location access denied or unavailable");
        setLoading(false);
      }
    );
  };

  const handleSearchSubmit = (searchVal) => {
    if (searchVal?.trim()) {
      fetchWeather(searchVal.trim());
      setCityQuery("");
    }
  };

  const handleGoHome = () => {
    setRawWeather(null);
    setRaw5Days([]);
    setCurrentLocation(null);
    setCityQuery("");
    setError("");
  };

  const isCurrentFavorite = Boolean(
    currentLocation?.cityName &&
    favorites.some((f) => f.toLowerCase() === currentLocation.cityName.toLowerCase())
  );

  const toggleFavorite = () => {
    if (!currentLocation?.cityName) return;

    const city = currentLocation.cityName;
    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter((f) => f.toLowerCase() !== city.toLowerCase())
      );
      showToast(`Removed ${city} from favorites`);
    } else {
      setFavorites((prev) => [city, ...prev]);
      showToast(`Added ${city} to favorites ❤️`);
    }
  };

  const activeDayForecast = dailyForecast[selectedForecastIndex] || dailyForecast[0];
  const activeHourlyData = activeDayForecast?.hourly || [];

  return (
    <div className="relative min-h-screen w-full bg-[#060a18] text-white">
      {/* 1. Live Weather Background with Falling Rain & Live Thunderstorm Lightning */}
      <LiveWeatherBackground isLive={true} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-blue-600/90 text-white text-xs md:text-sm font-medium shadow-2xl backdrop-blur-xl border border-blue-400/30 flex items-center gap-2"
          >
            <Sparkles size={15} className="text-yellow-300" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Foreground Dashboard Content */}
      <div className="relative z-10 dashboard-wrapper">
        <div className="w-full flex-1 flex flex-col">
          {/* Navigation Header with Autocomplete */}
          <HeaderNav
            cityQuery={cityQuery}
            setCityQuery={setCityQuery}
            onSearch={handleSearchSubmit}
            unit={unit}
            setUnit={setUnit}
            onRefresh={() => {
              if (currentLocation) {
                fetchWeather(currentLocation);
                showToast(`${currentLocation.cityName} weather refreshed`);
              }
            }}
            onGeoLocation={fetchWeatherByLocation}
            onOpenMenu={() => setIsDrawerOpen(true)}
            onGoHome={handleGoHome}
            isLoading={loading}
            hasCity={Boolean(weather)}
          />

          {/* Error message banner if any */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs md:text-sm flex items-center justify-between"
            >
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-rose-300 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {/* VIEW 1: Initial Empty State (Search First Experience) */}
          {!weather ? (
            <WelcomeScreen
              onSelectCity={(city) => fetchWeather(city)}
              isLoading={loading}
            />
          ) : (
            /* VIEW 2: Full Dynamic Weather Dashboard */
            <>
              {/* Top Row: Hero Card & 3 Stacked Sidebar Cards with Explicit Bottom Margin */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8 md:mb-10">
                {/* Left Column: Hero Weather Card (takes 8 cols on desktop) */}
                <div className="lg:col-span-8 flex flex-col">
                  <HeroWeatherCard weather={weather} unit={unit} />
                </div>

                {/* Right Column: 3 Stacked Cards (Air Quality, Sunrise & Sunset, Highlights) */}
                <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
                  {/* 1. Air Quality Index Card */}
                  <AirQualityCard
                    airQuality={weather.airQuality}
                    airQualityStatus={weather.airQualityStatus}
                  />

                  {/* 2. Sunrise & Sunset Card */}
                  <SunriseSunsetCard
                    sunrise={weather.sunrise}
                    sunset={weather.sunset}
                    sunriseTimestamp={weather.sunriseTimestamp}
                    sunsetTimestamp={weather.sunsetTimestamp}
                    currentTime={weather.dt}
                  />

                  {/* 3. Today's Highlights Card */}
                  <TodayHighlightsCard
                    maxTemp={weather.maxTemp}
                    minTemp={weather.minTemp}
                    rainChance={weather.rainChance}
                    cloudCover={weather.cloudCover}
                    unit={unit}
                  />
                </div>
              </div>

              {/* 5-Day Forecast Section with Explicit Bottom Margin */}
              <div className="mb-8 md:mb-10">
                <ForecastSection
                  forecastList={dailyForecast}
                  selectedIndex={selectedForecastIndex}
                  onSelectDay={(idx) => setSelectedForecastIndex(idx)}
                  unit={unit}
                />
              </div>

              {/* 24-Hour Hourly Forecast Chart */}
              {activeHourlyData.length > 0 && (
                <div className="mb-8 md:mb-10">
                  <HourlyChart
                    hourlyData={activeHourlyData}
                    unit={unit}
                    selectedDayName={activeDayForecast?.dayName || "Today"}
                  />
                </div>
              )}

              {/* Bottom Controls: Centered Tip Pill */}
              <div className="mt-2 mb-4 flex items-center justify-center">
                <div className="px-5 py-2 rounded-full bg-[#0c1432]/90 border border-white/10 text-xs text-gray-300 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <Zap size={14} className="text-[#a855f7] fill-[#a855f7]" />
                  <span className="font-medium">
                    <strong className="text-white font-semibold">Tip:</strong> Weather can change quickly, stay prepared!
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Floating Action Button (Heart / Favorite City) at Bottom-Right */}
        {weather && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            title={isCurrentFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all cursor-pointer ${
              isCurrentFavorite
                ? "bg-gradient-to-tr from-[#9333ea] to-[#ec4899] text-white ring-2 ring-pink-400/50"
                : "bg-gradient-to-tr from-[#6b21a8] to-[#db2777] border border-pink-400/30 text-white hover:brightness-110"
            }`}
          >
            <Heart
              size={18}
              className="fill-white text-white"
            />
          </motion.button>
        )}

        {/* Side Drawer Menu */}
        <DrawerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          favorites={favorites}
          recentSearches={recentSearches}
          onSelectCity={(city) => fetchWeather(city)}
          onOpenHourlyChart={() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          }}
          onOpenMap={() => setShowMapModal(true)}
        />

        {/* Weather Map Modal */}
        <AnimatePresence>
          {showMapModal && weather && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#0c1432] border border-white/10 p-6 shadow-2xl"
              >
                <button
                  onClick={() => setShowMapModal(false)}
                  className="absolute top-6 right-6 z-[1001] w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-gray-200 hover:text-white"
                >
                  <X size={18} />
                </button>
                <WeatherMap weather={weather} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
