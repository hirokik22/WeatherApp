function fetchWeatherData(apiUrl) {
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var times = data.hourly.time;
            var temperatures = data.hourly.temperature_2m;
            var precipitationProbabilities = data.hourly.precipitation_probability;

            var weatherDataDiv = document.getElementById('weather-data');
            weatherDataDiv.innerHTML = '';

            for (var i = 0; i < times.length; i++) {
                var timeInfo = document.createElement('p');
                var temperatureInfo = document.createElement('p');
                var precipitationInfo = document.createElement('p');

                var timeText = document.createTextNode('Time: ' + new Date(times[i]).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' }));
                var temperatureText = document.createTextNode('Temperature: ' + temperatures[i] + ' °C');
                var precipitationText = document.createTextNode('Precipitation Probability: ' + precipitationProbabilities[i] + '%');

                timeInfo.appendChild(timeText);
                temperatureInfo.appendChild(temperatureText);
                precipitationInfo.appendChild(precipitationText);

                weatherDataDiv.appendChild(timeInfo);
                weatherDataDiv.appendChild(temperatureInfo);
                weatherDataDiv.appendChild(precipitationInfo);

                var br = document.createElement('br');
                weatherDataDiv.appendChild(br);
            }
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
        });
}

// Call the function with the API URL as a parameter
var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m,precipitation_probability&timezone=Europe%2FBerlin';
fetchWeatherData(apiUrl);
