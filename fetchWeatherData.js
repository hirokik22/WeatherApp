const fetchWeatherData = (apiUrl) => {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }) // Convert the response to JSON
        .then(data => {
            processWeatherData(data); // Process the JSON data
        })
        .catch(error => {
            console.error('Error fetching weather data:', error); // Handle any errors
        });
}

const processWeatherData = (data) => {
    try {
        const times = data.hourly.time.map(time => new Date(time));
        const temperatures = data.hourly.temperature_2m;
        const precipitationProbabilities = data.hourly.precipitation_probability;

        const weatherDataDiv = document.getElementById('weather-info');
        weatherDataDiv.innerHTML = '';

        const firstDate = formatDatewithoutYear(times[0]);
        const lastDate = formatDatewithoutYear(times[times.length - 1]);

        const headerTitle = document.querySelector('h1');
        headerTitle.textContent = `Weather In Copenhagen from ${firstDate} to ${lastDate}`;

        const headerRow = document.createElement('div');
        headerRow.classList.add('weather-header');
        headerRow.appendChild(createDivElement('Date'));
        headerRow.appendChild(createDivElement('Day'));
        for (let i = 6; i < 24; i++) {
            headerRow.appendChild(createDivElement(`${i}:00`));
        }
        weatherDataDiv.appendChild(headerRow);

        const groupedData = times.reduce((acc, time, index) => {
            const date = time.toLocaleDateString('en-GB');
            if (!acc[date]) acc[date] = [];
            acc[date].push({ time, temperature: temperatures[index], precipitation: precipitationProbabilities[index] });
            return acc;
        }, {});

        Object.entries(groupedData).forEach(([date, entries]) => {
            const row = document.createElement('div');
            row.classList.add('weather-row');

            const dateDiv = createDivElement(date);
            const day = new Date(date.split('/').reverse().join('-'));
            const dayDiv = createDivElement(formatDay(day));
            row.appendChild(dateDiv);
            row.appendChild(dayDiv);

            for (let i = 6; i < 24; i++) {
                const entry = entries.find(e => e.time.getHours() === i);
                if (entry) {
                    const combinedDiv = document.createElement('div');
                    combinedDiv.classList.add('temperature-container');
                    combinedDiv.appendChild(createDivElement(`Temp: ${entry.temperature}°C`, 'temperature'));
                    combinedDiv.appendChild(createDivElement(`Precip: ${entry.precipitation}%`, 'precipitation'));
                    applyHeatmap(combinedDiv, entry.temperature);
                    row.appendChild(combinedDiv);
                } else {
                    row.appendChild(createDivElement(''));
                }
            }

            weatherDataDiv.appendChild(row);
        });
    } catch (error) {
        console.error('Error processing weather data:', error);
    }
}

const applyHeatmap = (element, temperature) => {
    if (temperature >= 20) {
        element.classList.add('heatmap-hot');
    } else if (temperature <= 13) {
        element.classList.add('heatmap-cold');
    } else {
        element.classList.add('heatmap-mild');
    }
}

const createDivElement = (text, className) => {
    const div = document.createElement('div');
    const textNode = document.createTextNode(text);
    div.appendChild(textNode);
    if (className) {
        div.classList.add(className);
    }
    return div;
}

const formatDatewithoutYear = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

const formatDay = (date) => {
    if (isNaN(date)) {
        console.error('Invalid date:', date);
        return 'Invalid date';
    }
    const options = { weekday: 'long' };
    return date.toLocaleDateString(undefined, options);
}

const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m,precipitation_probability&timezone=Europe%2FBerlin';
fetchWeatherData(apiUrl);