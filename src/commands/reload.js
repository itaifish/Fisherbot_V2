const config = require("../../docs/deploy/config.json");
const Path = require("path");
const Logger = require(Path.resolve(global.appRoot, "helpers/logger"));

module.exports = {
    commands: [
        {
            get name() { return "reload";},
            description: "Reloads a command, for admin testing",
            isAdmin: true,
            get example() { return `${config.prefix}${this.name}${config.delimiter}${this.name}`;},
            guildOnly: true,
            cooldown: 0,
            method: function(message, args, bot) {
                if(args.length === 0) {
                    return bot.sendOutput(message.channel,
                        `This command requires another argument for which command to reload. See ${config.prefix}help${config.delimiter}${this.name} for details. `);
                }
                const commandName = args[0].toLowerCase().trim();
                const command = bot.commands.get(commandName);
                if(!command) {
                    return bot.sendOutput(message.channel, `Unable to find command '${commandName}'.`);
                }
                else {
                    let resolveName = commandName;
                    if(command.fileAlias) {
                        resolveName = command.fileAlias;
                    }
                    delete require.cache[require.resolve(`./${resolveName}.js`)];
                    let success = true;
                    try {
                        const refreshedCommands = require(`./${resolveName}.js`);
                        for(const refreshedCommand of refreshedCommands.commands) {
                            bot.commands.set(commandName, refreshedCommand);
                        }
                    }
                    catch (err) {
                        Logger.logMessage("WARN", err);
                        success = false;
                        bot.sendOutput(message.channel, `Reload of ${commandName} failed, check the logs for details.`);
                    }
                    if(success) {
                        bot.sendOutput(message.channel, `Reload of ${commandName} successful`);

                    }
                }
            },
        },
    ],
};