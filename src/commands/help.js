const config = require('../../docs/deploy/config.json');

module.exports = {
    commands: [
        {
            get name(){ return 'help'},
            description: "Explains what the bot can do, and can describe any function that is called as an argument",
            get example(){ return  `${config.prefix}${this.name}\n\t${config.prefix}${this.name}${config.delimiter}${this.name}`},
            guildOnly: false,
            aliases: ['commandlist','?'],
            cooldown: config.defaultCooldown,
            method: function (message, args, bot) {
                if(args.length == 0) {
                    const commands = Array.from(bot.commands.keys()).sort();
                    let commandsAsString = 'Commands:\n';
                    for(let commandName of commands) {
                        commandsAsString += '\t• ' + commandName + '\n';
                    }
                    const footerInfo = `Use ${config.prefix}${this.name} with a command to see what it does`;
                    bot.sendOutput(message.channel, commandsAsString, true, this.name, footerInfo);
                } else {
                    let commandName = args[0].trim().toLowerCase();
                    if(bot.aliases.has(commandName)) {
                        commandName = bot.aliases.get(commandName);
                    }
                    if(bot.commands.has(commandName)) {
                        const commandData = bot.commands.get(commandName);
                        let commandExplanation = `${commandData.description}\nExample:\n\t${commandData.example}`;
                        if(commandData.aliases) {
                            commandExplanation += `\nAliases: ${commandData.aliases}`;
                        }
                        bot.sendOutput(message.channel, commandExplanation, true, commandName, '');
                    }else {
                        bot.sendOutput(message.channel, `Unable to recognize command '${commandName}'`);
                    }
                }
            }
        }
    ]
}