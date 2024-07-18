// Function to fetch weather data from the provided API URL
const fetchWeatherData = (apiUrl) => {
    fetch(apiUrl)
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            processWeatherData(data); // Process the JSON data
        })
        .catch(error => {
            console.error('Error fetching weather data:', error); // Handle any errors
        });
}

// Function to process the fetched weather data
const processWeatherData = (data) => {
    const times = data.hourly.time.map(time => new Date(time)); // Convert times to Date objects
    const temperatures = data.hourly.temperature_2m; // Extract temperatures array from data
    const precipitationProbabilities = data.hourly.precipitation_probability; // Extract precipitation probabilities array from data

    const weatherDataDiv = document.getElementById('weather-info'); // Get the div where weather data will be displayed
    weatherDataDiv.innerHTML = ''; // Clear any existing content in the div

    // Create and append header row
    const headerRow = document.createElement('div');
    headerRow.classList.add('weather-header');
    headerRow.appendChild(createDivElement('Date/Time'));
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
        row.appendChild(dateDiv);

        for (let i = 0; i < 24; i++) {
            const entry = entries.find(e => e.time.getHours() === i);
            if (entry) {
                const tempDiv = createDivElement(`Temperature: ${entry.temperature}°C`, 'temperature');
                const precipDiv = createDivElement(`Precipitation: ${entry.precipitation}%`, 'precipitation');
                const combinedDiv = document.createElement('div');
                combinedDiv.appendChild(tempDiv);
                combinedDiv.appendChild(precipDiv);
                row.appendChild(combinedDiv);
            } else {
                row.appendChild(createDivElement(''));
            }
        }

        weatherDataDiv.appendChild(row);
    });
}

// Function to create a div element with the given text
const createDivElement = (text, className) => {
    const div = document.createElement('div'); // Create a new div element
    const textNode = document.createTextNode(text); // Create a text node with the given text
    div.appendChild(textNode); // Append the text node to the div element
    if (className) {
        div.classList.add(className); // Add class if provided
    }
    return div; // Return the created div element
}

// Call the function with the API URL as a parameter
const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m,precipitation_probability&timezone=Europe%2FBerlin';
fetchWeatherData(apiUrl); // Initiate the fetching of weather data
