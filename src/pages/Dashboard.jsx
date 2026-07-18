import { useState } from 'react';
import { Wind, Droplets, Eye, Sunrise, Sunset } from 'lucide-react';

const API_KEY = "8f3c77ea4f58f821b75dfe278c671288";

export default function WeatherDashboard() {
  const [searchInput, setSearchInput] = useState('');
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempUnit, setTempUnit] = useState('C');

  // Get weather icon based on condition
  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('thunderstorm')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('cloud') || desc.includes('overcast')) return '☁️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '⛅';
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Format sunrise/sunset
  const formatSunTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Fetch weather data from API
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      // Get current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${"8f3c77ea4f58f821b75dfe278c671288"}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentResponse.json();

      // Get air quality data using latitude and longitude
      let airQualityScore = 50;
      let aqiValue = 2;
      
      try {
        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${"8f3c77ea4f58f821b75dfe278c671288"}`
        );
        
        if (airQualityResponse.ok) {
          const airQualityData = await airQualityResponse.json();
          
          if (airQualityData.list && airQualityData.list[0]) {
            // Convert AQI (1-5) to 0-500 scale for display
            aqiValue = airQualityData.list[0].main.aqi || 2;
            const aqiScales = { 1: 25, 2: 50, 3: 75, 4: 100, 5: 150 };
            airQualityScore = aqiScales[aqiValue] || 50;
          }
        }
      } catch {
        console.log('Air quality data unavailable, using default');
      }

      // Get forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      // Process forecast to get 5-day data
      const forecastList = forecastData.list;
      const dailyForecasts = {};
      
      forecastList.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (!dailyForecasts[dateKey]) {
          dailyForecasts[dateKey] = {
            date: dateKey,
            day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temps: [],
            humidity: [],
            wind: [],
            condition: item.weather[0].main,
            description: item.weather[0].description
          };
        }
        
        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].humidity.push(item.main.humidity);
        dailyForecasts[dateKey].wind.push(item.wind.speed);
      });

      const forecast = Object.values(dailyForecasts).slice(0, 5).map((day) => ({
        day: day.day,
        temp: Math.round((Math.max(...day.temps) + Math.min(...day.temps)) / 2 * 10) / 10,
        condition: day.description.charAt(0).toUpperCase() + day.description.slice(1),
        humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
        wind: Math.round(day.wind.reduce((a, b) => a + b) / day.wind.length * 10) / 10,
        icon: getWeatherIcon(day.description)
      }));

      const weatherData = {
        city: currentData.name,
        country: currentData.sys.country,
        date: formatDate(currentData.dt),
        time: formatTime(currentData.dt),
        temp: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1),
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        visibility: Math.round(currentData.visibility / 1000),
        airQuality: airQualityScore,
        airQualityStatus: aqiValue === 1 ? 'Good' : aqiValue === 2 ? 'Fair' : aqiValue === 3 ? 'Moderate' : aqiValue === 4 ? 'Poor' : 'Very Poor',
        sunrise: formatSunTime(currentData.sys.sunrise),
        sunset: formatSunTime(currentData.sys.sunset),
        maxTemp: currentData.main.temp_max,
        minTemp: currentData.main.temp_min,
        rainChance: currentData.clouds.all,
        cloudCover: currentData.clouds.all,
        forecast: forecast
      };

      setCity(weatherData);
    } catch {
      setError('Could not find city. Please try another name.');
      setCity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeatherData(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleQuickCity = (cityName) => {
    fetchWeatherData(cityName);
  };

  return (
    <div className="dashboard min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-5xl">🌤️</div>
          <h1 className="text-4xl md:text-5xl font-bold">Weather <span className="gradient-text">Dashboard</span></h1>
        </div>
        <div className="flex items-center gap-3 backdrop-glass px-4 py-2 rounded-xl">
          <button 
            onClick={() => setTempUnit('C')}
            className={`px-3 py-1 rounded transition-all ${tempUnit === 'C' ? 'bg-blue-500 text-white' : 'text-gray-300'}`}
          >
            °C
          </button>
          <button 
            onClick={() => setTempUnit('F')}
            className={`px-3 py-1 rounded transition-all ${tempUnit === 'F' ? 'bg-blue-500 text-white' : 'text-gray-300'}`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Which city do you want to search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full glass px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all text-lg"
          />
          <button
            type="button"
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-2xl"
          >
            👁️
          </button>
        </div>
      </form>

      {/* Empty State or Dashboard */}
      {!city ? (
        <div className="flex flex-col items-center justify-center py-32">
          {loading ? (
            <>
              <div className="text-7xl mb-6 animate-spin weather-float">🌍</div>
              <h2 className="text-2xl font-bold">Loading weather data...</h2>
            </>
          ) : (
            <>
              <div className="text-8xl mb-6 weather-float">🌍</div>
              <h2 className="text-4xl font-bold mb-4">Welcome to Weather Dashboard</h2>
              <p className="text-gray-400 text-lg mb-12">Search for a city to get started</p>
              
              {error && (
                <div className="glass px-6 py-4 mb-8 text-red-200 border-red-500/50 max-w-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {['London', 'Paris', 'Tokyo'].map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => handleQuickCity(cityName)}
                    className="glass px-6 py-3 font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Main Weather Card */}
          <div className="glass p-8 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Section - Temperature & Condition */}
              <div className="lg:col-span-1">
                <div className="mb-1 text-gray-300 text-lg flex items-center gap-1">
                  <span>📍</span>
                  <span>{city.city}, {city.country}</span>
                </div>
                <div className="text-sm text-gray-400 mb-8">{city.date}</div>
                
                <div className="mb-8">
                  <div className="text-7xl font-bold mb-2">
                    {Math.round(city.temp)}°<span className="text-4xl">{tempUnit}</span>
                  </div>
                  <div className="text-gray-400">Feels like {Math.round(city.feelsLike)}°</div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{city.condition}</h3>
                  <p className="text-gray-400 text-sm">{city.description}</p>
                </div>

                {/* Weather Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets size={18} className="text-blue-400" />
                      <span className="text-gray-400 text-xs">Humidity</span>
                    </div>
                    <div className="text-2xl font-bold">{city.humidity}%</div>
                  </div>
                  <div className="backdrop-glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind size={18} className="text-green-400" />
                      <span className="text-gray-400 text-xs">Wind Speed</span>
                    </div>
                    <div className="text-2xl font-bold">{city.windSpeed} m/s</div>
                  </div>
                  <div className="backdrop-glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-400 text-lg">⊙</span>
                      <span className="text-gray-400 text-xs">Pressure</span>
                    </div>
                    <div className="text-2xl font-bold">{city.pressure}</div>
                  </div>
                  <div className="backdrop-glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye size={18} className="text-cyan-400" />
                      <span className="text-gray-400 text-xs">Visibility</span>
                    </div>
                    <div className="text-2xl font-bold">{city.visibility} km</div>
                  </div>
                </div>
              </div>

              {/* Center Section - Large Weather Icon */}
              <div className="lg:col-span-1 flex items-center justify-center py-8">
                <div className="relative w-full h-56 flex items-center justify-center">
                  {city.condition.includes('Rainy') || city.condition.includes('Rain') ? (
                    <div className="text-8xl weather-float">🌧️</div>
                  ) : city.condition.includes('Sunny') || city.condition.includes('Clear') ? (
                    <div className="text-8xl weather-float">☀️</div>
                  ) : city.condition.includes('Cloud') ? (
                    <div className="text-8xl weather-float">☁️</div>
                  ) : (
                    <div className="text-8xl weather-float">⛅</div>
                  )}
                </div>
              </div>

              {/* Right Section - Air Quality & Highlights */}
              <div className="lg:col-span-2 space-y-6">
                {/* Air Quality */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Air Quality Index</h3>
                  <div className="backdrop-glass p-6 rounded-2xl flex items-center gap-6">
                    <div className="relative w-28 h-28 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" 
                          strokeDasharray={`${Math.min((city.airQuality / 150) * 282, 282)} 282`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{city.airQuality}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-green-400 font-semibold text-lg mb-1">{city.airQualityStatus}</div>
                      <p className="text-sm text-gray-400">Air quality is satisfactory for most people.</p>
                    </div>
                  </div>
                </div>

                {/* Sunrise & Sunset */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sunrise & Sunset</h3>
                  <div className="backdrop-glass p-6 rounded-2xl">
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col items-center gap-2">
                        <Sunrise size={32} className="text-yellow-400" />
                        <span className="text-sm text-gray-400">{city.sunrise}</span>
                      </div>
                      <div className="flex-1 mx-4 h-1 bg-linear-to-r from-yellow-400 via-yellow-300 to-orange-400 rounded-full"></div>
                      <div className="flex flex-col items-center gap-2">
                        <Sunset size={32} className="text-orange-400" />
                        <span className="text-sm text-gray-400">{city.sunset}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Highlights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Today's Highlights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="backdrop-glass p-4 rounded-xl">
                      <div className="text-gray-400 text-xs mb-2">Max Temp</div>
                      <div className="text-2xl font-bold">{Math.round(city.maxTemp)}°{tempUnit}</div>
                    </div>
                    <div className="backdrop-glass p-4 rounded-xl">
                      <div className="text-gray-400 text-xs mb-2">Min Temp</div>
                      <div className="text-2xl font-bold">{Math.round(city.minTemp)}°{tempUnit}</div>
                    </div>
                    <div className="backdrop-glass p-4 rounded-xl">
                      <div className="text-gray-400 text-xs mb-2">Chance of Rain</div>
                      <div className="text-2xl font-bold">{city.rainChance}%</div>
                    </div>
                    <div className="backdrop-glass p-4 rounded-xl">
                      <div className="text-gray-400 text-xs mb-2">Cloud Cover</div>
                      <div className="text-2xl font-bold">{city.cloudCover}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">5-Day Forecast ✨</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {city.forecast.map((day, index) => (
                <div
                  key={index}
                  className={`glass p-6 rounded-2xl transition-all card ${
                    index === 1 ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <h3 className="font-semibold text-base mb-4">{day.day}</h3>
                  <div className="text-6xl mb-4 text-center weather-float">{day.icon}</div>
                  <div className="text-3xl font-bold mb-2">{Math.round(day.temp)}°{tempUnit}</div>
                  <div className="text-gray-400 text-sm mb-4">{day.condition}</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">💧 Humidity</span>
                      <span className="font-semibold">{day.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">💨 Wind</span>
                      <span className="font-semibold">{day.wind} m/s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Tip */}
          <div className="glass p-5 rounded-2xl text-center mb-8">
            <p className="text-gray-300">⚡ Tip: Weather can change quickly, stay prepared!</p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setCity(null)}
              className="glass px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:ring-2 ring-blue-400"
            >
              Search Another City
            </button>
          </div>
        </>
      )}
    </div>
  );
}
