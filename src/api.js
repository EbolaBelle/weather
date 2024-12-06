export { fetchWeather, weatherObject };
import { printWeather } from "./UI.js";

const weatherObject = {
  reportType: "",
  location: "",
  current: {},
  dayList: [],
  hourlyReport: [],
};
const url =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const key = "?key=GS4WHYRHXPH63Z32XEB64WU9W";

function fetchWeather(location = "louisville", reportType = "current") {
  fetch(url + location + "/" + key, { mode: "cors" })
    .then((response) => response.json())
    .then((response) => {
      populateWeatherObject(response, reportType);
      printWeather(reportType);
    });
}

function populateWeatherObject(forecast, reportType) {
  weatherObject.reportType = reportType;
  weatherObject.location = forecast.resolvedAddress;
  let { currentConditions, days } = forecast;
  let hourly = days[0].hours;
  const desiredConditions = [
    "cloudcover",
    "conditions",
    "temp",
    "uvindex",
    "precipprob",
  ];
  const desiredField = [
    "conditions",
    "description",
    "tempmax",
    "tempmin",
    "precipprob",
  ];
  getCurrentReport(currentConditions, desiredConditions);
  getDailyReport(days, desiredField);
  getHourlyReport(hourly, desiredConditions);
}

function getCurrentReport(currentConditions, desiredConditions) {
  for (let key in currentConditions) {
    if (desiredConditions.includes(key)) {
      weatherObject.current[key] = currentConditions[key];
    }
  }
}

function getDailyReport(days, desiredField) {
  weatherObject.dayList.length = 0;
  for (let i = 0; i < 10; i++) {
    weatherObject.dayList.push({});
    for (let field in days[i]) {
      if (desiredField.includes(field)) {
        weatherObject.dayList[i][field] = days[i][field];
      }
    }
  }
}

function getHourlyReport(hourly, desiredConditions) {
  weatherObject.hourlyReport.length = 0;
  for (let i = 0; i < hourly.length; i++) {
    weatherObject.hourlyReport.push({});
    for (let field in hourly[i]) {
      if (desiredConditions.includes(field)) {
        weatherObject.hourlyReport[i][field] = hourly[i][field];
      }
    }
  }
}
