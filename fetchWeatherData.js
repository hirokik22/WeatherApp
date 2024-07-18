// Function to fetch weather data from the provided API URL
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

// Function to process the fetched weather data
const processWeatherData = (data) => {
    try {
        const times = data.hourly.time.map(time => new Date(time)); // Convert times to Date objects
        const temperatures = data.hourly.temperature_2m; // Extract temperatures array from data
        const precipitationProbabilities = data.hourly.precipitation_probability; // Extract precipitation probabilities array from data

        const weatherDataDiv = document.getElementById('weather-info'); // Get the div where weather data will be displayed
        weatherDataDiv.innerHTML = ''; // Clear any existing content in the div

        // Determine the first and last date in the data
        const firstDate = formatDatewithoutYear(times[0]);
        const lastDate = formatDatewithoutYear(times[times.length - 1]);

        // Update the h1 header with the date range
        const headerTitle = document.querySelector('h1');
        headerTitle.textContent = `Weather Forecast from ${firstDate} to ${lastDate}`;

        // Create and append header row
        const headerRow = document.createElement('div');
        headerRow.classList.add('weather-header');
        headerRow.appendChild(createDivElement('Date'));
        headerRow.appendChild(createDivElement('Day'));
        for (let i = 0; i < 24; i++) {
            headerRow.appendChild(createDivElement(`${i}:00`));
        }
        weatherDataDiv.appendChild(headerRow);

        // Group data by date
        const groupedData = times.reduce((acc, time, index) => {
            const date = time.toLocaleDateString('en-GB');
            if (!acc[date]) acc[date] = [];
            acc[date].push({ time, temperature: temperatures[index], precipitation: precipitationProbabilities[index] });
            return acc;
        }, {});

        // Loop through grouped data and create rows
        Object.entries(groupedData).forEach(([date, entries]) => {
            const row = document.createElement('div');
            row.classList.add('weather-row');

            const dateDiv = createDivElement(date);
            const day = new Date(date.split('/').reverse().join('-')); // Adjust date parsing for 'en-GB' format
            const dayDiv = createDivElement(formatDay(day));
            row.appendChild(dateDiv);
            row.appendChild(dayDiv);

            for (let i = 0; i < 24; i++) {
                const entry = entries.find(e => e.time.getHours() === i);
                if (entry) {
                    const tempDiv = createDivElement(`Temp: ${entry.temperature}°C`, 'temperature');
                    const precipDiv = createDivElement(`Precip: ${entry.precipitation}%`, 'precipitation');
                    const combinedDiv = document.createElement('div');
                    combinedDiv.appendChild(tempDiv);
                    combinedDiv.appendChild(precipDiv);
                    applyHeatmap(tempDiv, entry.temperature);
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

// Function to apply heatmap based on temperature
const applyHeatmap = (element, temperature) => {
    if (temperature > 20) {
        element.style.backgroundColor = 'pink';
    } else if (temperature < 13) {
        element.style.backgroundColor = 'lightblue';
    } else {
        element.style.backgroundColor = 'lightgreen';
    }
}

// Helper function to create a div element with the given text
const createDivElement = (text, className) => {
    const div = document.createElement('div'); // Create a new div element
    const textNode = document.createTextNode(text); // Create a text node with the given text
    div.appendChild(textNode); // Append the text node to the div element
    if (className) {
        div.classList.add(className); // Add class if provided
    }
    return div; // Return the created div element
}

// Helper function to format date without year
const formatDatewithoutYear = (date) => {
    const options = { month: 'short', day: 'numeric'};
    return date.toLocaleDateString(undefined, options);
}

// Helper function to format day of the week
const formatDay = (date) => {
    if (isNaN(date)) {
        console.error('Invalid date:', date);
        return 'Invalid date';
    }
    const options = { weekday: 'long' };
    return date.toLocaleDateString(undefined, options);
};

// Call the function with the API URL as a parameter
const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m,precipitation_probability&timezone=Europe%2FBerlin';
fetchWeatherData(apiUrl); // Initiate the fetching of weather data