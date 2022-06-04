const Discord = require("discord.js");

class CommandDataManager {

    constructor() {
        this.commandMaps = new Discord.Collection();
    }

    createCommandMap(commandName, objectData) {
        this.commandMaps.set(commandName, objectData);
        return this.getCommandMap(commandName);
    }

    getCommandMap(commandName) {
        if(this.commandMaps.has(commandName)) {
            return this.commandMaps.get(commandName);
        }
        return null;
    }

    createCommandMapIfEmpty(commandName, objectData) {
        const commandMap = this.getCommandMap(commandName);
        if(commandMap) {
            return commandMap;
        }
        else {
            return this.createCommandMap(commandName, objectData);
        }
    }


}

module.exports = CommandDataManager;