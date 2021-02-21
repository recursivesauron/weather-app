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
    geocode(location, (error, {latitude, longitude, locationResult} = {}) => {
        if(error){
            return console.log(chalk.red(error));
        }

        if(!latitude){
            return console.log(chalk.red('Could not find a location matching that search term. Please try another.'))
        }

        forecast(latitude, longitude, (error, {picture, text}) =>{
            if(error){
                return console.log(chalk.red(error));
            }
            
            if(picture){
                (async () => {
                    const body = await got(picture).buffer();
                    console.log("In " + locationResult + ':');
                    console.log(text);
                    console.log(await terminalImage.buffer(body, {width: 15, height: 15}));
                })();
            }
        });
    });
}

yargs.parse();

