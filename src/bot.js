const Discord = require('discord.js');
const Logger = require('./logger');
const fs = require('fs');

class Bot {

    constructor(prefix, delimiter) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.prefix = prefix;
        this.delimiter = delimiter;
        this.commands = new Discord.Collection();
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for(const file of commandFiles) {
            const command = require(`./commands/${file}`);
            for(const commandObj of command.commands) {
                this.commands.set(commandObj.name, commandObj);
            }
        }
    }

    handleInput(messageObject) {
        if (!messageObject.content.startsWith(this.prefix) || messageObject.author.bot) {
            return;
        }

        const args = messageObject.content.slice(this.prefix.length).split(this.delimiter + '+');
        const commandName = args.shift().toLowerCase();

        if(!this.commands.has(commandName)){
            return;
        }

        try {
            this.commands.get(commandName).method(messageObject, args, this);
        } catch (err) {
            Logger.logMessage('ERROR', err);
            this.sendOutput(messageObject.channel, "I had trouble executing that command. Please refer to your admin for more information.");
        }

        const messageLogString = messageObject.author.username + '[' + parseInt(messageObject.author.id, 10).toString(36) + '] : ' + messageObject.content;
        Logger.logMessage('DEBUG', messageLogString);
    }

    sendOutput(channel, messageString, isCode=false) {
        const sendFunction = isCode ? () => channel.send(messageString) : () => channel.sendCode(messageString);
        sendFunction(messageString).then((messageSent) => {
            const messageLogString = messageSent.author.username + '[' + parseInt(messageSent.author.id, 10).toString(36) + '] : ' + messageSent.content;
            Logger.logMessage('DEBUG', messageLogString);
        }).catch((err) => {
            Logger.logMessage('ERROR', err);
        });
    }

    initMessage() {
        Logger.logMessage('INFO','Ready, ID: ' + this.id);
    }
}

module.exports = Bot;