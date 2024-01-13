import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [data, setData] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isCelsius, setIsCelsius] = useState(true);

  const apiKey = 'ae209b8b701cfc13371ce269d1e9df2c';
  const unit = isCelsius ? 'metric' : 'imperial';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=${unit}`;

  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.get(url);
        setData(response.data);
        const groupedByDay = response.data.list.reduce((acc, item) => {
          const date = new Date(item.dt_txt).toLocaleDateString(); // Get the date
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            date: date,
            icon: item.weather[0].icon,
            temp: Math.round(item.main.temp),
            wind: item.wind.speed,
            humidity: item.main.humidity,
            feels: item.main.feels_like,
            max: item.main.temp_max,
            min: item.main.temp_min,
            des: item.weather[0].description
          });
          return acc;
        }, {});

      
        const dailyForecast = Object.values(groupedByDay)
          .sort((a, b) => new Date(a[0].dt_txt) - new Date(b[0].dt_txt))
          .slice(0, 5)  
          .map((items) => items[0]);

       
        setDailyData(dailyForecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        alert('City not found. Please enter a valid location.')
      }
    }
  };

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const toggleUnits = () => {
    setIsCelsius(!isCelsius);
  };

  const convertToCelsius = (temp) => parseFloat(temp.toFixed(2));
  const convertToFahrenheit = (temp) => parseFloat(((temp * 9/5) + 32).toFixed(2));

  const searchcity = (e) => {
    setLocation(e.target.value)
  }
 

  return (
    <div className='app'>
      <div className='search'>
        <input
          type="text"
          value={location}
          onChange={(e) => searchcity(e)}
          placeholder='Enter Location'
          onKeyPress={searchLocation}
        />
     
      {dailyData[selectedDay]?.icon && <img className='iconss' src={`http://openweathermap.org/img/w/${dailyData[selectedDay].icon}.png`} alt="Weather Icon" />}
    
      {data.city?.name && ( <p className='city'> {data.city.name}</p>)}
      {dailyData[selectedDay]?.temp && <p className='tem'>{`${isCelsius ? convertToCelsius(dailyData[selectedDay].temp) : convertToFahrenheit(dailyData[selectedDay].temp)} ${isCelsius ? '°C' : '°F'}`}</p>}
        
      </div>
      <div className='toggle-units'>
          <button className='btn' onClick={toggleUnits}>
            {isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          </button>
        </div>
      <div className='container'>
        <div className='top'>
      
          <div className='day'>
            {dailyData.map((day, idx) => (
              <div key={idx} className={`forecast-day ${selectedDay === idx ? 'selected' : ''}`} onClick={() => handleDayClick(idx)}>
                <div className='forecast-temp'>{`${isCelsius ? convertToCelsius(day.temp) : convertToFahrenheit(day.temp)} ${isCelsius ? '°C' : '°F'}`}</div>
                <div className='forecast-icon'>
                  <img src={`http://openweathermap.org/img/w/${day.icon}.png`} alt="Weather Icon" />
                </div>
                <div className="descr">{day.des}</div>
                <div className='forecast-date'>  {new Date().toLocaleDateString()== day.date ? "Today" : day.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='today'>
          <div className='ico'>
            {dailyData[selectedDay]?.icon && <img src={`http://openweathermap.org/img/w/${dailyData[selectedDay].icon}.png`} alt="Weather Icon" />}
          </div>
          <div className='temperature'>
            {dailyData[selectedDay]?.temp && <p>{`${isCelsius ? convertToCelsius(dailyData[selectedDay].temp) : convertToFahrenheit(dailyData[selectedDay].temp)} ${isCelsius ? '°C' : '°F'}`}</p>}
            <p>Temp</p>
          </div>
          <div className='max-tem'>
            {dailyData[selectedDay]?.max && <p>{`${isCelsius ? convertToCelsius(dailyData[selectedDay].max) : convertToFahrenheit(dailyData[selectedDay].max)} ${isCelsius ? '°C' : '°F'}`}</p>}
            <p>temp_max</p>
          </div>
          <div className='min-tem'>
            {dailyData[selectedDay]?.min && <p>{`${isCelsius ? convertToCelsius(dailyData[selectedDay].min) : convertToFahrenheit(dailyData[selectedDay].min)} ${isCelsius ? '°C' : '°F'}`}</p>}
            <p>temp_min</p>
          </div>
          <div className='des'>
            {dailyData[selectedDay]?.des && <p>{`${dailyData[selectedDay].des}`}</p>}
            <p>weather</p>
          </div>
        </div>
        <div className='bottom'>
    <div className='feels'>
      <p className='bold'>{dailyData[selectedDay]?.feels && `${parseFloat(isCelsius ? convertToCelsius(dailyData[selectedDay].feels) : convertToFahrenheit(dailyData[selectedDay].feels)).toFixed(2)} °C`}</p>
      <p>Feels Like</p>
    </div>
    <div className='humidity'>
      <p className='bold'>{dailyData[selectedDay]?.humidity && `${dailyData[selectedDay].humidity}%`}</p>
      <p>Humidity</p>
    </div>
    <div className='wind'>
      <p className='bold'>{dailyData[selectedDay]?.wind && `${dailyData[selectedDay].wind} m/s`}</p>
      <p>Wind Speed</p>
    </div>
  </div>
      

      
      </div>
    </div>
  );
};

export default Weather;
