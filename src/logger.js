const config = require('../docs/deploy/config.json');
const fs = require('fs');
const logPath = '../logs/';
const logFileName = 'log' + new Date().getTime() + '.log'

class Logger {

    static logMessage(logLevel, message) {
        //onetime init for logstream
        if(typeof Logger.logStream === 'undefined') {
            if(!fs.existsSync(logPath)) {
                fs.mkdirSync(logPath, {recursive: true});
            }
            Logger.logStream = fs.createWriteStream(logPath + logFileName, {flag: 'a'});
            //remove extra/unneeded log files
            Logger.logStream.on('open', () => { //Wait until the file is actually opened to count how many files are in directory to avoid race conditions
                fs.readdir(logPath, (err, files) => {
                    let dataFiles = files.map((file) => {
                        const stat = fs.statSync(logPath + file);
                        return {
                            name: file,
                            time: stat.birthtimeMs
                        };
                    });

                    dataFiles.filter(dataFile => dataFile.name.endsWith('.log'));
                    
                    dataFiles.sort((file1, file2) => {
                        return file2.time - file1.time;
                    });
                    
                    while(dataFiles.length > config.maxLogFiles) {
                        const toRemove = dataFiles.pop();
                        fs.unlink(logPath + toRemove.name, (err) => {
                            if(err) {
                                console.log('Error when attempting to remove Log File ' + toRemove.name + ': ' + err);
                            }
                        });
                    }
                })
            });
        }
        if(this.rankLogLevel(logLevel) >= this.rankLogLevel(config.logLevel)) {
            const logString = "| [" + new Date() + "] " + logLevel.toUpperCase() + " |: " + message;
            Logger.logStream.write(logString + "\n");
            console.log(logString);
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
            Logger.logStream.end();
        }
    }

        
}

module.exports = Logger;