// Getting all the data elements
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

// Declaring array for months and days
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Declaring API_KEY
const API_KEY = '073f2e23ea0af54688619b3f4bdf3494';

// Function to update time and date
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML =
        (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ' ' +
        `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

// Function to fetch and display weather data
function getWeatherData() {
    navigator.geolocation.getCurrentPosition(
        (success) => {
            let { latitude, longitude } = success.coords;

            fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    showWeatherData(data);
                })
                .catch((error) => {
                    console.error('Error fetching weather data: ', error);
                });
        },
        (error) => {
            console.error('Error getting geolocation: ', error);
        }
    );
}

function showWeatherData(data) {
    const { current, location, forecast } = data;

    // Update timezone and location
    timezone.innerHTML = location.tz_id;
    countryEl.innerHTML = `${location.name}, ${location.country}`;

    // Update current weather
    const { humidity, pressure_mb, wind_kph, condition } = current;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Condition</div>
            <div>${condition.text}</div>
        </div>
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure_mb} hPa</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_kph} km/h</div>
        </div>
    `;

    // Update current temperature and 7-day forecast
    let otherDayForecast = '';
    forecast.forecastday.forEach((day, idx) => {
        const date = new Date(day.date);
        if (idx === 0) {
            currentTempEl.innerHTML = `
                <img src="${day.day.condition.icon}" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${days[date.getDay()]}</div>
                    <div class="temp">Day - ${day.day.maxtemp_c}&#176;C</div>
                    <div class="temp">Night - ${day.day.mintemp_c}&#176;C</div>
                </div>
            `;
        } else {
            otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${days[date.getDay()]}</div>
                    <img src="${day.day.condition.icon}" alt="weather icon" class="w-icon">
                    <div class="temp">Day - ${day.day.maxtemp_c}&#176;C</div>
                    <div class="temp">Night - ${day.day.mintemp_c}&#176;C</div>
                </div>
            `;
        }
    });

    weatherForecastEl.innerHTML = otherDayForecast;
}

// Initialize weather data fetch
getWeatherData();
