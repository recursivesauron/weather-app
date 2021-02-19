const forecast = require('./utils/forecast.js');
const geocode = require('./utils/geocode.js');
const chalk = require('chalk');
const yargs = require('yargs');
const got = require('got');
const terminalImage = require('terminal-image');

//Create add command
yargs.command({
    command: 'search',
    describe: 'Searches for a city and returns the forecast of the closest result',
    builder: {
        location: {
            describe: 'Location to search for',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv){
        printForecast(argv.location);
    }
});

const printForecast = (location) => {
    geocode(location, (error, response) => {
        if(error){
            return console.log(chalk.red(error));
        }

        forecast(response.latitude, response.longitude, (error, data) =>{
            if(error){
                return console.log(chalk.red(error));
            }
            
            if(data){
                (async () => {
                    const body = await got(data.picture).buffer();
                    console.log("In " + response.locationResult + ':');
                    console.log(data.text);
                    console.log(await terminalImage.buffer(body, {width: 15, height: 15}));
                })();
            }
        });
    });
}

yargs.parse();

