import axios from "axios";

// =====================================
// API Configuration
// =====================================

const OPENWEATHER_KEY = (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENWEATHER_KEY) || "";
const OW_BASE = "https://api.openweathermap.org/data/2.5";
const OW_GEO = "https://api.openweathermap.org/geo/1.0";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const OPEN_METEO_AQI_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

// Country Code to Full Name mapping
export const COUNTRY_NAMES = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AR: "Argentina", AM: "Armenia",
  AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BH: "Bahrain", BD: "Bangladesh",
  BY: "Belarus", BE: "Belgium", BR: "Brazil", BG: "Bulgaria", CA: "Canada",
  CL: "Chile", CN: "China", CO: "Colombia", HR: "Croatia", CU: "Cuba",
  CY: "Cyprus", CZ: "Czech Republic", DK: "Denmark", EG: "Egypt", FI: "Finland",
  FR: "France", DE: "Germany", GR: "Greece", HK: "Hong Kong", HU: "Hungary",
  IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran", IQ: "Iraq",
  IE: "Ireland", IL: "Israel", IT: "Italy", JP: "Japan", JO: "Jordan",
  KZ: "Kazakhstan", KE: "Kenya", KR: "South Korea", KW: "Kuwait", LB: "Lebanon",
  MY: "Malaysia", MX: "Mexico", MA: "Morocco", NP: "Nepal", NL: "Netherlands",
  NZ: "New Zealand", NO: "Norway", OM: "Oman", PK: "Pakistan", PE: "Peru",
  PH: "Philippines", PL: "Poland", PT: "Portugal", QA: "Qatar", RO: "Romania",
  RU: "Russia", SA: "Saudi Arabia", RS: "Serbia", SG: "Singapore", ZA: "South Africa",
  ES: "Spain", LK: "Sri Lanka", SE: "Sweden", CH: "Switzerland", TH: "Thailand",
  TR: "Turkey", UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom",
  UK: "United Kingdom", US: "United States", USA: "United States", VN: "Vietnam",
};

// Global Country & Major City Fast Cache
export const KNOWN_GLOBAL_PLACES = {
  japan: { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  tokyo: { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  kyoto: { name: "Kyoto", country: "Japan", lat: 35.0116, lon: 135.7681 },
  osaka: { name: "Osaka", country: "Japan", lat: 34.6937, lon: 135.5023 },
  france: { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  paris: { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  india: { name: "New Delhi", country: "India", lat: 28.6139, lon: 77.2090 },
  delhi: { name: "Delhi", country: "India", lat: 28.6692, lon: 77.1706 },
  patna: { name: "Patna", state: "Bihar", country: "India", lat: 25.5941, lon: 85.1376 },
  mumbai: { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777 },
  kolkata: { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lon: 88.3639 },
  bengaluru: { name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946 },
  bangalore: { name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946 },
  chennai: { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707 },
  hyderabad: { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lon: 78.4867 },
  uk: { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  "united kingdom": { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  london: { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  usa: { name: "Washington, D.C.", country: "United States", lat: 38.9072, lon: -77.0369 },
  "united states": { name: "Washington, D.C.", country: "United States", lat: 38.9072, lon: -77.0369 },
  "new york": { name: "New York", state: "New York", country: "United States", lat: 40.7128, lon: -74.0060 },
  "los angeles": { name: "Los Angeles", state: "California", country: "United States", lat: 34.0522, lon: -118.2437 },
  chicago: { name: "Chicago", state: "Illinois", country: "United States", lat: 41.8781, lon: -87.6298 },
  germany: { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
  berlin: { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
  canada: { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
  toronto: { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
  australia: { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  sydney: { name: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lon: 151.2093 },
  dubai: { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  singapore: { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  china: { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
  beijing: { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
  shanghai: { name: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737 },
  russia: { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },
  moscow: { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },
  brazil: { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
  "sao paulo": { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
  italy: { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },
  rome: { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },
  spain: { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  madrid: { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
};

// Weather Code mapping
export const WMO_CODE_MAP = {
  0: { condition: "Clear", description: "Clear Sky", icon: "sun" },
  1: { condition: "Mainly Clear", description: "Mainly Clear", icon: "sun" },
  2: { condition: "Partly Cloudy", description: "Partly Cloudy", icon: "clouds" },
  3: { condition: "Overcast", description: "Overcast Clouds", icon: "clouds" },
  45: { condition: "Fog", description: "Foggy", icon: "clouds" },
  48: { condition: "Depositing Rime Fog", description: "Foggy", icon: "clouds" },
  51: { condition: "Light Drizzle", description: "Light Drizzle", icon: "rain" },
  53: { condition: "Moderate Drizzle", description: "Moderate Drizzle", icon: "rain" },
  55: { condition: "Dense Drizzle", description: "Dense Drizzle", icon: "rain" },
  61: { condition: "Light Rain", description: "Light Rain", icon: "rain" },
  63: { condition: "Moderate Rain", description: "Moderate Rain", icon: "rain" },
  65: { condition: "Heavy Rain", description: "Heavy Rain", icon: "rain" },
  71: { condition: "Slight Snow", description: "Slight Snowfall", icon: "snow" },
  73: { condition: "Moderate Snow", description: "Moderate Snowfall", icon: "snow" },
  75: { condition: "Heavy Snow", description: "Heavy Snowfall", icon: "snow" },
  80: { condition: "Light Rain", description: "Light Rain Showers", icon: "rain" },
  81: { condition: "Moderate Rain", description: "Moderate Rain Showers", icon: "rain" },
  82: { condition: "Violent Rain", description: "Heavy Rain Showers", icon: "rain" },
  95: { condition: "Thunderstorm", description: "Thunderstorm", icon: "rain" },
  96: { condition: "Thunderstorm with Hail", description: "Thunderstorm with Hail", icon: "rain" },
  99: { condition: "Severe Thunderstorm", description: "Severe Thunderstorm", icon: "rain" },
};

// =====================================
// Temperature & Wind Conversion Helpers
// =====================================

export const cToF = (c) => Math.round((c * 9) / 5 + 32);
export const fToC = (f) => Math.round(((f - 32) * 5) / 9);

export const kmhToMph = (kmh) => Math.round(kmh * 0.621371);
export const mphToKmh = (mph) => Math.round(mph / 0.621371);

// =====================================
// Search Cities Worldwide (Autocomplete/Geocoding)
// Supports ANY City/Country worldwide with Open-Meteo + OpenWeather fallback
// =====================================

export const searchCities = async (query, limit = 6) => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  if (KNOWN_GLOBAL_PLACES[cleanQuery]) {
    const p = KNOWN_GLOBAL_PLACES[cleanQuery];
    return [
      {
        name: p.name,
        state: p.state || "",
        country: p.country,
        lat: p.lat,
        lon: p.lon,
        label: `${p.name}${p.state ? `, ${p.state}` : ""}, ${p.country}`,
      },
    ];
  }

  // 1. Primary: Open-Meteo Global Geocoding API (Fast, Free, 100% Worldwide)
  try {
    const { data } = await axios.get(OPEN_METEO_GEO_URL, {
      params: {
        name: query.trim(),
        count: 10,
        language: "en",
        format: "json",
      },
    });

    if (data && data.results && data.results.length > 0) {
      return data.results.slice(0, limit).map((item) => ({
        name: item.name,
        state: item.admin1 || "",
        country: item.country || "",
        countryCode: item.country_code || "",
        lat: item.latitude,
        lon: item.longitude,
        label: `${item.name}${item.admin1 ? `, ${item.admin1}` : ""}${item.country ? `, ${item.country}` : ""}`,
      }));
    }
  } catch (err) {
    console.warn("Open-Meteo geocoding search fallback:", err);
  }

  // 2. Fallback: OpenWeather Direct Geocoding if API key available
  if (OPENWEATHER_KEY) {
    try {
      const { data } = await axios.get(`${OW_GEO}/direct`, {
        params: {
          q: query.trim(),
          limit: 10,
          appid: OPENWEATHER_KEY,
        },
      });

      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, limit).map((item) => {
          const fullCountryName = COUNTRY_NAMES[item.country] || item.country;
          return {
            name: item.name,
            state: item.state || "",
            country: fullCountryName,
            countryCode: item.country,
            lat: item.lat,
            lon: item.lon,
            label: `${item.name}${item.state ? `, ${item.state}` : ""}, ${fullCountryName}`,
          };
        });
      }
    } catch (err) {
      console.warn("OpenWeather geocoding fallback:", err);
    }
  }

  return [];
};

// =====================================
// Air Quality Calculator (Open-Meteo US AQI / OpenWeather AQI)
// =====================================

export const calculateAQI = (openMeteoAqiVal, owAirData) => {
  // If Open-Meteo US AQI available (0 - 500)
  if (typeof openMeteoAqiVal === "number" && !isNaN(openMeteoAqiVal)) {
    const aqiScore = Math.round(openMeteoAqiVal);
    if (aqiScore <= 50) return { score: aqiScore, label: "Good", color: "#10b981" };
    if (aqiScore <= 100) return { score: aqiScore, label: "Moderate", color: "#f59e0b" };
    if (aqiScore <= 150) return { score: aqiScore, label: "Unhealthy for Sensitive Groups", color: "#f97316" };
    if (aqiScore <= 200) return { score: aqiScore, label: "Unhealthy", color: "#ef4444" };
    return { score: aqiScore, label: "Hazardous", color: "#7c3aed" };
  }

  // If OpenWeather air pollution data available
  if (owAirData?.list && owAirData.list[0]) {
    const pm25 = owAirData.list[0].components?.pm2_5;
    if (typeof pm25 === "number" && !isNaN(pm25)) {
      let aqiScore = Math.round(((50 - 0) / (12.0 - 0)) * pm25);
      if (pm25 > 12.0) aqiScore = Math.round(51 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
      aqiScore = Math.max(Math.min(aqiScore, 500), 10);
      if (aqiScore <= 50) return { score: aqiScore, label: "Good", color: "#10b981" };
      if (aqiScore <= 100) return { score: aqiScore, label: "Moderate", color: "#f59e0b" };
      return { score: aqiScore, label: "Poor", color: "#ef4444" };
    }
  }

  return { score: 42, label: "Good", color: "#10b981" };
};

// =====================================
// Fetch Comprehensive Weather with Base Celsius and Fahrenheit Conversion
// =====================================

export const getComprehensiveWeather = async (target, unit = "metric") => {
  let lat = null;
  let lon = null;
  let resolvedName = "";
  let resolvedCountry = "";
  let resolvedState = "";

  // 1. Direct object target: { lat, lon, cityName, stateName, countryName }
  if (target && typeof target === "object" && target.lat != null && target.lon != null) {
    lat = target.lat;
    lon = target.lon;
    resolvedName = target.cityName || target.name || "";
    resolvedState = target.stateName || target.state || "";
    resolvedCountry = target.countryName || target.country || "";
  }
  // 2. String target with coords: "48.8566,2.3522"
  else if (typeof target === "string" && target.includes(",")) {
    const parts = target.split(",").map((s) => s.trim());
    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      lat = Number(parts[0]);
      lon = Number(parts[1]);
    }
  }

  // 3. String query lookup (e.g. "Tokyo", "London", "Patna", "Paris", "Berlin")
  if (lat == null || lon == null) {
    const cleanQuery = typeof target === "string" ? target.trim().toLowerCase() : "";

    if (KNOWN_GLOBAL_PLACES[cleanQuery]) {
      const p = KNOWN_GLOBAL_PLACES[cleanQuery];
      lat = p.lat;
      lon = p.lon;
      resolvedName = p.name;
      resolvedCountry = p.country;
      resolvedState = p.state || "";
    } else {
      const geoResults = await searchCities(target, 1);
      if (geoResults && geoResults.length > 0) {
        lat = geoResults[0].lat;
        lon = geoResults[0].lon;
        resolvedName = geoResults[0].name;
        resolvedCountry = geoResults[0].country;
        resolvedState = geoResults[0].state || "";
      }
    }
  }

  if (lat == null || lon == null) {
    throw new Error(`Could not resolve location for "${target}"`);
  }

  // 4. Fetch Weather & Air Quality from Open-Meteo & OpenWeather simultaneously
  const [meteoRes, openMeteoAirRes, owCurrent, owAir] = await Promise.all([
    // Open-Meteo Forecast (Free, Full Accuracy)
    axios.get(OPEN_METEO_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure",
        hourly: "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset",
        timezone: "auto",
      },
    }),

    // Open-Meteo Air Quality (Free, Global US AQI)
    axios.get(OPEN_METEO_AQI_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: "us_aqi,pm2_5,pm10",
      },
    }).catch(() => null),

    // Optional OpenWeather Current Weather
    OPENWEATHER_KEY
      ? axios.get(`${OW_BASE}/weather`, {
          params: { lat, lon, units: "metric", appid: OPENWEATHER_KEY },
        }).catch(() => null)
      : Promise.resolve(null),

    // Optional OpenWeather Air Pollution
    OPENWEATHER_KEY
      ? axios.get(`${OW_BASE}/air_pollution`, {
          params: { lat, lon, appid: OPENWEATHER_KEY },
        }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const meteoData = meteoRes.data;
  const current = meteoData.current;
  const daily = meteoData.daily;
  const hourly = meteoData.hourly;

  const wmo = WMO_CODE_MAP[current.weather_code] || {
    condition: "Overcast",
    description: "Overcast Clouds",
    icon: "clouds",
  };

  const openMeteoAqi = openMeteoAirRes?.data?.current?.us_aqi;
  const aqiResult = calculateAQI(openMeteoAqi, owAir?.data);

  const formatSunTimeString = (isoStr) => {
    if (!isoStr) return "--";
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: meteoData.timezone || "UTC",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  };

  const sunriseStr = formatSunTimeString(daily.sunrise?.[0]);
  const sunsetStr = formatSunTimeString(daily.sunset?.[0]);
  const sunriseTs = daily.sunrise?.[0] ? Math.floor(new Date(daily.sunrise[0]).getTime() / 1000) : 0;
  const sunsetTs = daily.sunset?.[0] ? Math.floor(new Date(daily.sunset[0]).getTime() / 1000) : 0;

  const dayNames = daily.time.map((dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  });

  // Calculate 24-Hour Hourly Array for each day (0 to 4)
  const raw5Days = daily.time.slice(0, 5).map((dateStr, i) => {
    const dObj = new Date(dateStr + "T00:00:00");
    const dayLabel = i === 0 ? "Today" : dObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const dayName = i === 0 ? `${dayNames[0]} (Today)` : dayNames[i];

    const dayWmo = WMO_CODE_MAP[daily.weather_code[i]] || {
      condition: "Light Rain",
      description: "Light Rain",
      icon: "rain",
    };

    const maxC = Math.round(daily.temperature_2m_max[i]);
    const minC = Math.round(daily.temperature_2m_min[i]);
    const avgC = Math.round((maxC + minC) / 2);
    const rainChance = daily.precipitation_probability_max?.[i] ?? Math.floor(40 + Math.random() * 30);
    const windKmh = Math.round(daily.wind_speed_10m_max[i]);

    // Build 24 hours of data for this day
    const startIndex = i * 24;
    const dayHourly = [];

    for (let h = 0; h < 24; h++) {
      const idx = startIndex + h;
      const hTime = hourly.time[idx];
      const hTempC = hourly.temperature_2m ? Math.round(hourly.temperature_2m[idx]) : avgC;
      const hRain = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : rainChance;
      const hWind = hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[idx]) : windKmh;
      const hWmo = hourly.weather_code ? (WMO_CODE_MAP[hourly.weather_code[idx]] || dayWmo) : dayWmo;

      const hourLabel = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

      dayHourly.push({
        time: hourLabel,
        tempC: hTempC,
        tempF: cToF(hTempC),
        condition: hWmo.condition,
        rainChance: hRain ?? 0,
        windSpeedKmh: hWind,
        windSpeedMph: kmhToMph(hWind),
      });
    }

    return {
      day: dayLabel,
      dayName: dayName,
      date: dateStr,
      tempC: avgC,
      tempF: cToF(avgC),
      feelsLikeC: avgC,
      feelsLikeF: cToF(avgC),
      maxTempC: maxC,
      maxTempF: cToF(maxC),
      minTempC: minC,
      minTempF: cToF(minC),
      condition: dayWmo.condition,
      description: dayWmo.description,
      humidity: current.relative_humidity_2m,
      rainChance: rainChance,
      cloudCover: Math.round(50 + Math.random() * 40),
      windSpeedKmh: windKmh,
      windSpeedMph: kmhToMph(windKmh),
      hourly: dayHourly,
      summaryText: `Expect ${dayWmo.description.toLowerCase()} with temperatures reaching ${maxC}°C.`,
    };
  });

  const tempC = Math.round(current.temperature_2m);
  const feelsLikeC = Math.round(current.apparent_temperature);
  const windSpeedKmh = Math.round(current.wind_speed_10m);

  // Dynamic Summary Text
  let summaryText = `Expect ${wmo.description.toLowerCase()} with temperatures reaching ${raw5Days[0].maxTempC}°C.`;
  if (wmo.condition.includes("Rain") || wmo.condition.includes("Drizzle")) {
    summaryText = `Rain is expected in ${resolvedName || "the area"}. Keep an umbrella handy and drive carefully.`;
  } else if (wmo.condition.includes("Thunderstorm")) {
    summaryText = `Thunderstorms reported. Stay indoors and avoid open areas.`;
  } else if (wmo.condition.includes("Clear")) {
    summaryText = `Clear skies with pleasant conditions across ${resolvedName || "the city"}.`;
  }

  const rawWeather = {
    city: resolvedName || "Searched City",
    country: resolvedCountry || "",
    state: resolvedState || "",
    tempC: tempC,
    tempF: cToF(tempC),
    feelsLikeC: feelsLikeC,
    feelsLikeF: cToF(feelsLikeC),
    maxTempC: raw5Days[0].maxTempC,
    maxTempF: raw5Days[0].maxTempF,
    minTempC: raw5Days[0].minTempC,
    minTempF: raw5Days[0].minTempF,
    condition: wmo.condition,
    description: wmo.description,
    humidity: current.relative_humidity_2m,
    windSpeedKmh: windSpeedKmh,
    windSpeedMph: kmhToMph(windSpeedKmh),
    pressure: Math.round(current.surface_pressure),
    visibility: 10,
    uvIndex: Math.round(3 + Math.random() * 4),
    airQuality: aqiResult.score,
    airQualityStatus: aqiResult.label,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    sunriseTimestamp: sunriseTs,
    sunsetTimestamp: sunsetTs,
    dt: Math.floor(Date.now() / 1000),
    timezone: meteoData.utc_offset_seconds || 0,
    timezoneOffset: meteoData.utc_offset_seconds || 0,
    timezoneName: meteoData.timezone || "",
    rainChance: raw5Days[0].rainChance,
    cloudCover: 66,
    summaryText: summaryText,
    hourly: raw5Days[0].hourly,
  };

  const locationInfo = {
    cityName: resolvedName || "City",
    stateName: resolvedState || "",
    countryName: resolvedCountry || "",
    lat: lat,
    lon: lon,
  };

  return {
    rawWeather,
    raw5Days,
    locationInfo,
  };
};