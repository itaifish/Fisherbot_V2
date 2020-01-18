const config = require('../../docs/deploy/config.json');
const Discord = require('discord.js');

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
                const title = this.name[0].toUpperCase() + this.name.slice(1);
                if(args.length == 0) {
                    const embedObj = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(title)
                        .setDescription('List of commands')
                        .setFooter(`Use ${config.prefix}${this.name} with a command to see what it does`);
                    const commands = Array.from(bot.commands.keys()).sort();
                    let commandsAsString = '';
                    for(let commandName of commands) {
                        commandsAsString += '\t• ' + commandName + '\n';
                    }
                    embedObj.addField('Commands:', commandsAsString);
                    bot.sendOutput(message.channel, commandsAsString, embedObj);
                } else {
                    let commandName = args[0].trim().toLowerCase();
                    if(bot.aliases.has(commandName)) {
                        commandName = bot.aliases.get(commandName);
                    }
                    if(bot.commands.has(commandName)) {
                        const embedObj = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setFooter(`Use ${config.prefix}${this.name} with a command to see what it does`);
                        const commandData = bot.commands.get(commandName);
                        embedObj.addField('Description', commandData.description);
                        embedObj.addField('Example', commandData.example);
                        embedObj.setTitle(commandData.name[0].toUpperCase() + commandData.name.slice(1));
                        if(commandData.aliases) {
                            embedObj.addField('Aliases', commandData.aliases);
                        }
                        bot.sendOutput(message.channel, '', embedObj);
                    }else {
                        bot.sendOutput(message.channel, `Unable to recognize command '${commandName}'`);
                    }
                }
            }
        }
    ]
}