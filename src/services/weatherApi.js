import axios from "axios";

// =====================================
// OpenWeather API Configuration
// =====================================

const API_KEY = "8f3c77ea4f58f821b75dfe278c671288";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// =====================================
// Current Weather by City
// =====================================

export const getCurrentWeather = async (
  city,
  unit = "metric"
) => {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: unit,
    },
  });

  return data;
};

// =====================================
// 5-Day Forecast by City
// =====================================

export const getForecast = async (
  city,
  unit = "metric"
) => {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: unit,
    },
  });

  return data;
};

// =====================================
// Air Pollution
// =====================================

export const getAirPollution = async (
  lat,
  lon
) => {
  const { data } = await axios.get(
    `${BASE_URL}/air_pollution`,
    {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    }
  );

  return data;
};

// =====================================
// Get Coordinates from City
// =====================================

export const getCoordinates = async (
  city
) => {
  const { data } = await axios.get(
    `${GEO_URL}/direct`,
    {
      params: {
        q: city,
        limit: 1,
        appid: API_KEY,
      },
    }
  );

  return data.length ? data[0] : null;
};

// =====================================
// Weather by Coordinates
// =====================================

export const getWeatherByCoords = async (
  lat,
  lon,
  unit = "metric"
) => {
  const { data } = await axios.get(
    `${BASE_URL}/weather`,
    {
      params: {
        lat,
        lon,
        units: unit,
        appid: API_KEY,
      },
    }
  );

  return data;
};

// =====================================
// Forecast by Coordinates
// =====================================

export const getForecastByCoords = async (
  lat,
  lon,
  unit = "metric"
) => {
  const { data } = await axios.get(
    `${BASE_URL}/forecast`,
    {
      params: {
        lat,
        lon,
        units: unit,
        appid: API_KEY,
      },
    }
  );

  return data;
};

// =====================================
// Air Pollution by Coordinates
// =====================================

export const getAirPollutionByCoords = async (
  lat,
  lon
) => {
  const { data } = await axios.get(
    `${BASE_URL}/air_pollution`,
    {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    }
  );

  return data;
};