document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const weatherDetails = document.getElementById('weather-details');
    
    // API key
    const apiKey = '8d1933b2003edcceef9d38da92d53de3';
    
    searchButton.addEventListener('click', () => {
        fetchWeather();
    });
    
    cityInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            fetchWeather();
        }
    });
    
    function fetchWeather() {
        const city = cityInput.value.trim();
        
        if (city === '') {
            displayError('Please enter a city name');
            return;
        }
        
        // Show loading message
        weatherDetails.innerHTML = '<div class="loading">Loading weather data...</div>';
        
        // Encode the city name to handle special characters
        const encodedCity = encodeURIComponent(city);
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;
        
        console.log('Fetching weather for:', city);
        console.log('API URL:', apiUrl);
        
        fetch(apiUrl)
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('City not found. Try adding a country code (e.g., "London,UK")');
                    } else if (response.status === 401) {
                        throw new Error('Invalid API key or API key not yet activated (can take up to 24 hours)');
                    } else {
                        throw new Error(`Server error: ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather data received:', data);
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(error.message);
            });
    }
    
    function displayWeather(data) {
        const { name, sys } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        
        weatherDetails.innerHTML = `
            <h2 class="city-name">${name}${sys.country ? `, ${sys.country}` : ''}</h2>
            <div class="temperature">${Math.round(temp)}°C</div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
            </div>
            <div class="description">${description}</div>
            <div class="details">
                <div class="humidity">Humidity: ${humidity}%</div>
                <div class="wind">Wind Speed: ${speed} m/s</div>
            </div>
        `;

        // Add a subtle entrance animation
        weatherDetails.style.opacity = 0;
        setTimeout(() => {
            weatherDetails.style.transition = 'opacity 0.5s ease-in';
            weatherDetails.style.opacity = 1;
        }, 50);
    }
    
    function displayError(message) {
        weatherDetails.innerHTML = `<div class="error">${message}</div>`;
    }
});
