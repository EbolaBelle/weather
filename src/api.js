export { fetchWeather };

const locationHeader = document.querySelector(".location");
const weatherObject = {
  location: "",
  current: {},
  dayList: [],
  hourlyReport: ["hello"],
};
const url =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const key = "?key=GS4WHYRHXPH63Z32XEB64WU9W";

function fetchWeather(location = 'louisville', reportType = "current") {
  fetch(url + location + "/" + key, { mode: "cors" })
    .then((response) => response.json())
    .then((response) => {
      populateWeatherObject(response);
      console.log(response);
      printHeaders();
      if (reportType === "current") {
        createWeatherCard(printCurrentConditions(weatherObject.current));
      } else {
        displayExtendedReport(reportType);
      }
    });
}

function populateWeatherObject(forecast) {
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
  console.log(weatherObject);
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

function cleanSlate(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

//User Interface

function printHeaders() {
  locationHeader.textContent = weatherObject.location;
  const dateTime = document.createElement("h6");
  dateTime.textContent = new Date().toString().slice(0, 24);
  locationHeader.append(dateTime);
}

function createWeatherCard(info) {
  const wrapper = document.querySelector(".wrapper");
  const weatherCard = document.createElement("div");
  weatherCard.classList.add("weatherCard");
  weatherCard.appendChild(info);
  wrapper.appendChild(weatherCard);
}

function printCurrentConditions(conditions) {
  const weatherList = document.createElement("ul");
  populateWeatherList(conditions, weatherList);
  return weatherList;
}

function populateWeatherList(conditions, weatherList) {
  for (let key in conditions) {
    let heading = document.createElement("li");
    let currentItem = conditions[key];
    switch (key) {
      case "temp":
        heading.textContent = "Temperature: " + currentItem + "°";
        break;
      case "tempmax":
        heading.textContent = "High: " + currentItem + "°";
        break;
      case "tempmin":
        heading.textContent = "Low: " + currentItem + "°";
        break;
      case "precipprob":
        heading.textContent = "Precipitation: " + currentItem + "%";
        break;
      case "cloudcover":
        heading.textContent = "Cloud cover: " + currentItem + "%";
        break;
      case "uvindex":
        heading.textContent = "UV Index: " + currentItem;
        break;
      case "conditions":
        heading.textContent = "Conditions: " + currentItem;
        break;
    }
    weatherList.appendChild(heading);
  }
}

function displayExtendedReport(report) {
  const wrapper = document.querySelector(".wrapper");
  cleanSlate(wrapper);
  for (let i = 0; i < weatherObject[report].length; i++) {
    createWeatherCard(printCurrentConditions(weatherObject[report][i]));
  }
}

function reportHandler() {
  const reportType = document.querySelector(
    'input[name="report"]:checked',
  ).value;
  return reportType;
}

const locationInput = document.getElementById("location");
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => {
  let wrapper = document.querySelector(".wrapper");
  cleanSlate(wrapper);
  fetchWeather(locationInput.value, reportHandler());
  locationInput.value = "";
});
