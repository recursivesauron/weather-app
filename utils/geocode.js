require('dotenv').config();
const request = require('request');

const geocode = (location, callback) =>{
    const geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(location) + '.json?access_token=' + process.env.GEOCODE_KEY + '&limit=1';
    
    request({url: geocodeURL, json: true}, (error, {body}) => {
        if(error){
            callback('Unable to connect to geocode API', undefined);
        }
        else if(body.features.length === 0){
            callback('Unable to find location. Try another search term', undefined);
        }
        else{
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                locationResult: body.features[0].place_name
            });
        }
    });
}

module.exports = geocode;