import React, { useRef, useEffect, useState } from "react";

const Hero = () => {
  const userInput = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity && userInput.current) {
      userInput.current.value = savedCity;
      fetchWeather(savedCity); // 👈 auto-fetch data
    }
  }, []);

  const fetchWeather = async (city) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=63b8f36496664fccba9103245251007&q=${city}&aqi=yes`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Invalid city name or network issue");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (error) {
      setError("Invalid city name or API error. Please try again.");
      setData(null);
    }
  };
  const getWeather = async () => {
    const city = userInput.current.value.trim();
    if (!city) {
      setError("Please enter a city.");
      setData(null);
      return;
    }
    localStorage.setItem("lastCity", city);
    fetchWeather(city);
  };

  const getMyLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.weatherapi.com/v1/current.json?key=63b8f36496664fccba9103245251007&q=${latitude},${longitude}&aqi=yes`;
        try {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error("Error fetching your location data");

          const result = await response.json();
          setData(result);
          setError(null);
        } catch (err) {
          setError("Unable to fetch weather from your location.");
        }
      },
      (error) => {
        setError("Location permission denied.");
      }
    );
  };

  return (
    <section className="container1 uppercase mt-14">
      <h2 className="text-3xl font-semibold text-center heading">
        WEATHER APP
      </h2>

      <div className="mt-10 mx-auto flex flex-col items-center justify-center space-y-4">
        <input
          type="text"
          ref={userInput}
          placeholder="Enter city name..."
          className="p-4 text-xs font-semibold outline-none rounded-xl ring-1 ring-inset ring-[#e8e8e8] dark:bg-[#242424] dark:ring-[#393939]"
        />

        <div className="flex flex-col gap-4">
          <button
            className="p-3 ring-1 ring-inset ring-[#e8e8e8] rounded-xl dark:ring-[#a2a2a2]"
            onClick={getWeather}
          >
            <span className="text-sm font-semibold uppercase">Get Weather</span>
          </button>

          <button
            className="p-3 ring-1 ring-inset ring-[#e8e8e8] rounded-xl dark:ring-[#a2a2a2]"
            onClick={getMyLocationWeather}
          >
            <span className="text-sm font-semibold uppercase">
              Use My Location
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 text-center text-red-700 font-semibold">
          {error}
        </div>
      )}

      {data && (
        <div className="my-12 mx-auto w-full text-center h-full flex flex-col space-y-2 ring-1 ring-inset dark:ring-[#3d3d3d] ring-[#e8e8e8] bg-[#f9f9f9] dark:bg-[#242424] rounded-2xl p-8">
          <h2>
            <span className="text-sm font-medium">LOCATION: </span>
            <span className="text-sm font-semibold">{data.location.name}</span>
          </h2>
          <h2>
            <span className="text-sm font-medium">CURRENT TEMP: </span>
            <span className="text-sm font-semibold">
              {data.current.temp_c}°C
            </span>
          </h2>
          <h2>
            <span className="text-sm font-medium">TIME: </span>
            <span className="text-sm font-semibold">
              {data.location.localtime}
            </span>
          </h2>
          <h2>
            <span className="text-sm font-medium">WIND SPEED: </span>
            <span className="text-sm font-semibold">
              {data.current.wind_kph} kph
            </span>
          </h2>
        </div>
      )}
    </section>
  );
};

export default Hero;
