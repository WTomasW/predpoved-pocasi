'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [favoriteData, setfavoriteData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');


  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    fetchFavouriteWeather();
  }, [favorites]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(''); 
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchWeather = async () => {
    try {
      const response = await fetch(`/api/getWeather/${city}`);
      const data = await response.json();

      if (data.error) {
        setError('Zadané město nebylo nalezeno.');
      } else {
        setError('');
        setWeatherData(prevWeatherData => [data, ...prevWeatherData]);
      }
    } catch (err) {
      setError('Neznámá chyba, prosím zkuste to znovu.');
    }
  };

  const fetchFavouriteWeather = async () => {
    try {
      const weatherPromises = favorites.map(city =>
        fetch(`/api/getWeather/${city}`)
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              throw new Error(data.error.message);
            }
            return data;
          })
      );
      const weatherDataArray = await Promise.all(weatherPromises);
      setfavoriteData(weatherDataArray);
    } catch (err) {
      setError('Neznámá chyba, prosím zkuste to znovu.');
    }
  };

  const handleFavorite = (cityName) => {
    const newFavorites = favorites.includes(cityName)
      ? favorites.filter(fav => fav !== cityName)
      : [...favorites, cityName];

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="container mx-auto my-10 p-5">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Chyba: </strong>
        <span className="block sm:inline">{error}</span>
      </div>}
      <div className="mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={fetchWeather} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
          Get Weather
        </button>
      </div>
      <h2 className="text-xl font-bold my-4">Current Cities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherData.map((data, index) => (
          <div key={index} className="bg-white shadow rounded p-4 relative">
            <button
              onClick={() => handleFavorite(data.location.name)}
              className={`heart-button absolute top-2 right-2 ${favorites.includes(data.location.name) ? 'text-red-500' : 'text-gray-500'}`}>
              ❤
            </button>
            <h2 className="text-lg"><span className='font-bold'>{data.location.name}</span> ({data.location.country})</h2>
            <p><strong>Temperature:</strong> {data.current.temp_c}°C / {data.current.temp_f}°F</p>
            <p><strong>Condition:</strong> {data.current.condition.text}</p>
            <p><strong>Wind speed:</strong> {data.current.wind_kph} km/h</p>
            <img src={`http:${data.current.condition.icon}`} alt="weather icon" />
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold my-4">Favourite Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteData.map((data, index) => (
            <div key={index} className="bg-white shadow rounded p-4 relative">
              <button
                onClick={() => handleFavorite(data.location.name)}
                className={`heart-button absolute top-2 right-2 ${favorites.includes(data.location.name) ? 'text-red-500' : 'text-gray-500'}`}>
                ❤
              </button>
              <h2 className="text-lg font-bold">{data.location.name}</h2>
              <p><strong>Temperature:</strong> {data.current.temp_c}°C / {data.current.temp_f}°F</p>
              <p><strong>Condition:</strong> {data.current.condition.text}</p>
              <p><strong>Wind speed:</strong> {data.current.wind_kph} km/h</p>
              <img src={`http:${data.current.condition.icon}`} alt="weather icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
