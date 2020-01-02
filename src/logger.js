const config = require('../docs/deploy/config.json');
const fs = require('fs');
const logPath = '../logs/';
const logFileName = 'log.log'

class Logger {

    static logMessage(logLevel, message) {
        if(typeof Logger.logStream === 'undefined') {
            if(!fs.existsSync(logPath + logFileName)) {
                fs.mkdirSync(logPath, {recursive: true});
            }
            Logger.logStream = fs.createWriteStream(logPath + logFileName, {flag: 'a'});
        }
        if(this.rankLogLevel(logLevel) >= this.rankLogLevel(config.logLevel)) {
            const logString = "| [" + new Date() + "] " + logLevel.toUpperCase() + " |: " + message + "\n";
            Logger.logStream.write(logString);
        } else {
            console.log(this.rankLogLevel(logLevel) + "," + this.rankLogLevel(config.logLevel));
        }
    }

    static rankLogLevel(logLevel) {
        logLevel = logLevel.toUpperCase();
        switch(logLevel) {
            case 'ALL':
                return 0;
            case 'DEBUG':
                return 2;
            case 'INFO':
                return 3;
            case 'WARN':
                return 4;
            case 'ERROR':
                return 5;
            case 'NONE':
                return 6;
            default:
                return 3;
        }
    }

    static closeLogStream() {
        if (typeof Logger.logStream != 'undefined') {
            this.logMessage('INFO', 'Exiting... Ending Write Stream to Log');
            Logger.logStream.end('--------------');
        }
    }

        
}

module.exports = Logger;