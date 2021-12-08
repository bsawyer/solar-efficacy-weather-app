# Solar Efficacy Weather App

The purpose of this app is to help residential PV system owners and operators determine the potential power output of their systems based on the current and forecasted weather.

To achieve this a Neural Network was trained with the daily peak hour data collected over a year from a residential PV installation. This data was also supplemented with the hourly historical weather from the installation's location.

## Data
The PV data was sourced from https://www.sciencedirect.com/science/article/pii/S235234091930589X?via%3Dihub and represents hourly Photovoltaic (PV) generation and residential load profiles of a typical South Australian Net Zero Energy (NZE) home.

The weather data was collected from https://www.visualcrossing.com/weather-api and represents hourly weather conditions for the location of the PV system.

### Input
- temperature (farenheit): converted to percent of -128.6 - 134
- cloud cover (percent): 0 - 100
- precipitation (inches): converted to percent of 0 - 14
- wind speed (mph): converted to percent of 0 - 254
- humidity (percent): 0 - 100

### Output
- generated kW (kW): converted to percent of 0.222 - 2.649

### Location Info
- latitude and longitude: -34.8105,138.6112
- capacity: 3kW
- loss: 5%
- tilt angle: 35
- Azimuth angle: 180

## App
The web app can be accessed at https://bsawyer.github.io/solar-efficacy-weather-app/
