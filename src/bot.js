const Logger = require('./logger');

class Bot {

    constructor(prefix, delimiter) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.prefix = prefix;
        this.delimiter = delimiter;
    }

    handleInput(messageObject) {
        if (!messageObject.content.startsWith(this.prefix) || messageObject.author.bot) {
            return;
        }
        const messageLogString = messageObject.author.username + '[ ' + messageObject.author.id + ' ] : ' + messageObject.content;
        Logger.logMessage('DEBUG', messageLogString);
    }

    initMessage() {
        console.log('Ready, ID: ' + this.id);
    }
}

module.exports = Bot;