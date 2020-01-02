const config = require('../../docs/deploy/config.json');
const Logger = require('../logger');

module.exports = {
    commands: [
        {
            get name() { return  'reload'},
            description: "Reloads a command, for admin testing",
            isAdmin: true,
            get example() { return `${config.prefix}${this.name}${config.delimiter}${this.name}`},
            guildOnly: false,
            cooldown: 0,
            method: (message, args, bot) => {
                if(args.length === 0) {
                    return bot.sendOutput(message.channel,
                         `This command requires another argument for which command to reload. See ${config.prefix}help${config.delimiter}${this.name} for details.`);
                }
                const commandName = args[0].toLowerCase().trim();
                const command = bot.commands.get(commandName);
                if(!command) {
                    return bot.sendOutput(message.channel, `Unable to find command '${commandName}'.`);
                } else {
                    delete require.cache[require.resolve(`./${commandName}.js`)];
                    try {
                        const refreshedCommands = require(`./${commandName}.js`);
                        for(const refreshedCommand of refreshedCommands.commands) {
                            bot.commands.set(commandName, refreshedCommand);
                            bot.sendOutput(message.channel, `Reload of ${commandName} successful`);
                        }
                    } catch (err) {
                        Logger.logMessage('WARN', err);
                        bot.sendOutput(message.channel, `Reload of ${commandName} failed, check the logs for details.`);
                    }
                } 
            }
        }
    ]
}