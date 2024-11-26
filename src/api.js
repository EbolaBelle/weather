const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=GS4WHYRHXPH63Z32XEB64WU9W'

async function weatherReport() {
    const response = await fetch(url, {mode: "cors"});
    const weatherData = await response.json();
    console.log(weatherData);
}