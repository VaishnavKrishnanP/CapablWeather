document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('city');
    const button = document.querySelector('button');

    // Detect "Enter" key press in the city input field
    cityInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            getWeather(); // Trigger the getWeather function when Enter is pressed
        }
    });

    // Detect click on the "Get Weather" button
    button.addEventListener('click', getWeather);
});

function getWeather() {
    const apiKey = 'your_api_key_here'; // Your OpenWeatherMap API key
    const city = document.getElementById('city').value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                const weatherDiv = document.getElementById('weather');
                weatherDiv.innerHTML = '';

                // Capitalize city name
                const cityName = data.city.name.charAt(0).toUpperCase() + data.city.name.slice(1).toLowerCase();

                // Current Day Weather
                const currentDayData = data.list[0];
                const currentWeatherIcon = `http://openweathermap.org/img/wn/${currentDayData.weather[0].icon}@2x.png`;
                const currentDayWeather = `
                    <div class="weather-section">
                        <div class="weather-info">
                            <h2>Today's Weather in ${cityName}</h2>
                            <p><strong>${currentDayData.weather[0].main}</strong></p>
                            <p>${currentDayData.weather[0].description}</p>
                            <p>Temperature: ${currentDayData.main.temp} °C</p>
                            <p>Humidity: ${currentDayData.main.humidity}%</p>
                            <p>Wind Speed: ${currentDayData.wind.speed} m/s</p>
                        </div>
                        <div class="weather-icon-container">
                            <img src="${currentWeatherIcon}" alt="Weather icon" class="weather-icon">
                        </div>
                    </div>
                `;

                // Next 5 Days Weather
                const forecastData = {};
                data.list.forEach(item => {
                    const date = new Date(item.dt_txt).toLocaleDateString();
                    if (!forecastData[date]) {
                        forecastData[date] = [];
                    }
                    forecastData[date].push(item);
                });

                let forecastHTML = `
                    <div class="forecast-heading">5-Day Forecast</div>
                    <div class="forecast">
                `;
                const dates = Object.keys(forecastData);
                for (let i = 1; i < 6; i++) {
                    if (dates[i]) {
                        const dayData = forecastData[dates[i]];
                        const dayWeather = dayData[0].weather[0];
                        const tempMin = Math.min(...dayData.map(d => d.main.temp_min));
                        const tempMax = Math.max(...dayData.map(d => d.main.temp_max));
                        const dayWeatherIcon = `http://openweathermap.org/img/wn/${dayWeather.icon}@2x.png`;

                        forecastHTML += `
                            <div class="forecast-day">
                                <h3>${dates[i]}</h3>
                                <img src="${dayWeatherIcon}" alt="Weather icon" class="weather-icon">
                                <p><strong>${dayWeather.main}</strong></p>
                                <p>${dayWeather.description}</p>
                                <p>Min: ${tempMin.toFixed(1)} °C</p>
                                <p>Max: ${tempMax.toFixed(1)} °C</p>
                            </div>
                        `;
                    }
                }
                forecastHTML += '</div></div>';

                weatherDiv.innerHTML = `${currentDayWeather}${forecastHTML}`;
            } else {
                alert('City not found!');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
}
