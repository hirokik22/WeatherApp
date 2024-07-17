// Function to fetch weather data from the provided API URL
function fetchWeatherData(apiUrl) {
    fetch(apiUrl)
        .then(function(response) {
            return response.json(); // Convert the response to JSON
        })
        .then(function(data) {
            processWeatherData(data); // Process the JSON data
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error); // Handle any errors
        });
}

// Function to process the fetched weather data
function processWeatherData(data) {
    var times = data.hourly.time; // Extract times array from data
    var temperatures = data.hourly.temperature_2m; // Extract temperatures array from data
    var precipitationProbabilities = data.hourly.precipitation_probability; // Extract precipitation probabilities array from data

    var weatherDataDiv = document.getElementById('weather-data'); // Get the div where weather data will be displayed
    weatherDataDiv.innerHTML = ''; // Clear any existing content in the div

    // Loop through the data arrays and create HTML elements for each data point
    for (var i = 0; i < times.length; i++) {
        var timeInfo = createParagraphElement('Time: ' + new Date(times[i]).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' }));
        var temperatureInfo = createParagraphElement('Temperature: ' + temperatures[i] + ' °C');
        var precipitationInfo = createParagraphElement('Precipitation Probability: ' + precipitationProbabilities[i] + '%');

        // Append the created elements to the weather data div
        appendWeatherData(weatherDataDiv, timeInfo, temperatureInfo, precipitationInfo);
    }
}

// Function to create a paragraph element with the given text
function createParagraphElement(text) {
    var p = document.createElement('p'); // Create a new paragraph element
    var textNode = document.createTextNode(text); // Create a text node with the given text
    p.appendChild(textNode); // Append the text node to the paragraph element
    return p; // Return the created paragraph element
}

// Function to append the weather data elements to the parent div
function appendWeatherData(parentDiv, timeInfo, temperatureInfo, precipitationInfo) {
    parentDiv.appendChild(timeInfo); // Append time info paragraph to the parent div
    parentDiv.appendChild(temperatureInfo); // Append temperature info paragraph to the parent div
    parentDiv.appendChild(precipitationInfo); // Append precipitation info paragraph to the parent div

    var br = document.createElement('br'); // Create a line break element
    parentDiv.appendChild(br); // Append the line break to the parent div to separate entries
}

// Call the function with the API URL as a parameter
var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m,precipitation_probability&timezone=Europe%2FBerlin';
fetchWeatherData(apiUrl); // Initiate the fetching of weather data