require('dotenv').config();
const request = require('request');
const forecast = (latitude, longitude, callback) => {
    const forecastURL = 'http://api.weatherstack.com/current?access_key=' + process.env.FORECAST_KEY + '&query=' + encodeURIComponent(latitude + ',' + longitude);
    
    request({ url: forecastURL, json: true}, (error, response) => {
        if(error){
            callback('Unable to connect to forecast service', undefined);
        }
        else if(response.body.error){
            callback('Unable to find location', undefined);
        }
        else{
            const weatherDesc = response.body.current.weather_descriptions[0];
            const currentTemp = response.body.current.temperature;
            const feelsLikeTemp = response.body.current.feelslike;
            
            const text = "The weather is expected to be " + weatherDesc + ". \nThe current temperature is " + currentTemp + " degrees; it feels like " + feelsLikeTemp + " degrees.";

            callback(undefined, {
                text: text,
                picture: response.body.current.weather_icons[0]
            });
        }
    });
}

module.exports = forecast;