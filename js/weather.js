function getWeatherInfo() {
    weather_data={
        "weather_code":"null",
        "current_temperature":0,
        "units":"celsius",
        "precipitation":0,
        "cityname":"Earth",
        "web_link":"",
        "is_day":0,
    }
}

function getWeatherInfo_OpenMeteo(latitude=44.804,longitude=20.4651) {
    weather_data={
        "weather_code":"null",
        "current_temperature":0,
        "units":"celsius",
        "precipitation":0,
        "cityname":"Earth",
        "web_link":"",
    }
    if(latitude==44.804 && longitude==20.4651)
    {
        weather_data.cityname="Belgrade";
    }
    /*
        WMO Weather interpretation codes (WW)
        Code	Description
        0	Clear sky
        1, 2, 3	Mainly clear, partly cloudy, and overcast
        45, 48	Fog and depositing rime fog
        51, 53, 55	Drizzle: Light, moderate, and dense intensity
        56, 57	Freezing Drizzle: Light and dense intensity
        61, 63, 65	Rain: Slight, moderate and heavy intensity
        66, 67	Freezing Rain: Light and heavy intensity
        71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
        77	Snow grains
        80, 81, 82	Rain showers: Slight, moderate, and violent
        85, 86	Snow showers slight and heavy
        95 *	Thunderstorm: Slight or moderate
        96, 99 *	Thunderstorm with slight and heavy hail
    */
    curr_temp="";
    precip="";
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,weather_code&hourly=temperature_2m&forecast_days=3`, {
          method: 'GET',
          headers:
          {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => response.json())
        .then(data =>
        {
            switch(data.current.weather_code)
            {
                case 0:
                case 1:
                    weather_data.weather_code="clear"
                    break;
                case 2:
                    weather_data.weather_code="partly_cloudy_less"
                    break;
                case 3:
                    weather_data.weather_code="partly_cloudy"
                    break;
                case 45:
                case 48:
                    weather_data.weather_code="foggy"
                    break;
                case 51:
                case 53:
                case 55:
                    weather_data.weather_code="rainy"
                    break;
                case 56:
                case 57:
                    weather_data.weather_code="rainy"
                    break;
                case 61:
                case 63:
                case 65:
                    weather_data.weather_code="rainy"
                    break;
                case 66:
                case 67:
                    weather_data.weather_code="rainy"
                    break;
                case 71:
                case 73:
                case 75:
                    weather_data.weather_code="snow"
                    break;
                case 77:
                    weather_data.weather_code="snow"
                    break;
                case 80:
                case 81:
                case 82:
                    weather_data.weather_code="cloud_rainy"
                    break;
                case 85:
                case 86:
                    weather_data.weather_code="cloud_rainy"
                    break;
                case 95:
                    weather_data.weather_code="thunderstorm"
                    break;
                case 96:
                case 99:
                    weather_data.weather_code="hail"
                    break;
            }

            if(!data.current.is_day)
            {
                weather_data.weather_code+="_night";
            }

            console.log(data);
            weather_data.current_temperature=data.current.temperature_2m;
            weather_data.precipitation=data.current.precipitation;
            weather_data.is_day=data.current.is_day;

            setWeatherDisplay(weather_data);

        })
        .catch(error =>
        {
          //document.getElementById('autosuggestion-picker-prim').style.display='none';
          console.error(error);
        });
}

function setWeatherDisplay(weather_data) {
    console.log(weather_data);
    document.querySelector(".mainwindow-weather img").src=`img/weather-icons/${weather_data.weather_code}.png`;
    document.querySelector(".mainwindow-weather-degrees").innerHTML=`${Math.round(weather_data.current_temperature)}°C`;
    document.querySelector(".mainwindow-weather-location").innerHTML=`${weather_data.cityname}`;
    document.querySelector(".mainwindow-weather-precipitation span").innerHTML=`${Math.round(weather_data.precipitation)} mm`;
    document.querySelector(".mainwindow-weather").style.opacity=1;
}
