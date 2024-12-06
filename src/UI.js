import { weatherObject, fetchWeather } from "./api.js";
export { printWeather };

const locationHeader = document.querySelector(".location");

function printWeather(reportType = "current") {
  printHeaders();
  if (reportType === "current") {
    createWeatherCard(printCurrentConditions(weatherObject.current));
  } else {
    displayExtendedReport(reportType);
  }
}

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

function cleanSlate(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}
