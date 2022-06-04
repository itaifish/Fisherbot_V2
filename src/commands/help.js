const config = require('../../docs/deploy/config.json');
const Discord = require('discord.js');
const Path = require('path');
const Logger = require(Path.resolve(global.appRoot, 'helpers/logger'));

module.exports = {
    commands: [
        {
            get name(){ return 'help'},
            description: "Explains what the bot can do, and can describe any function that is called as an argument",
            get example(){ return  `${config.prefix}${this.name}\n\t${config.prefix}${this.name}${config.delimiter}${this.name}`},
            guildOnly: false,
            aliases: ['commandlist','?'],
            cooldown: config.defaultCooldown,
            generateCommandInfo: function(commandName, bot, footer) {
                if(bot.aliases.has(commandName)) {
                    commandName = bot.aliases.get(commandName);
                }
                if(bot.commands.has(commandName)) {
                    const embedObj = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setFooter(footer);
                    const commandData = bot.commands.get(commandName);
                    embedObj.addField('Description', commandData.description);
                    embedObj.addField('Example', commandData.example);
                    embedObj.setTitle(`${this.name.toUpperCase()}: ${commandData.name[0].toUpperCase()}${commandData.name.slice(1)}`);
                    if(commandData.aliases && commandData.aliases.length > 0) {
                        embedObj.addField('Aliases', commandData.aliases);
                    }
                    return embedObj;
                }else {
                    return `Unable to recognize command '${commandName}`;
                }
            },
            method: function (message, args, bot) {
                let response;
                let callBackFunc = (message) => {};
                if(args.length == 0) {
                    const commands = Array.from(bot.commands.keys()).sort();
                    const commandData = bot.commandDataManager.createCommandMapIfEmpty(this.name, new Discord.Collection());
                    const defaultData = {
                        commands: commands,
                        index: 0
                    };
                    commandData.set(message.channel.id, defaultData);
                    const reacts= ['⏪','⬅️' ,'➡️', '⏩'];
                    const messageInteractionFunction = (message, emote) => {
                        const helpCommandMap = bot.commandDataManager.getCommandMap(this.name);
                        if(!helpCommandMap) {
                            return Logger.logMessage('ERROR', `Unable to find data for command ${this.name}`);
                        }
                        const channelData = helpCommandMap.get(message.channel.id);
                        if(!channelData) {
                            return Logger.logMessage('ERROR', `Unable to find data for command ${this.name} in channel ${message.channel.id}`);
                        }
                        let index = channelData.index;
                        switch(emote.toString()) {
                            case '⏪':
                                index = 0;
                            break;
                            case '⬅️':
                                index -= 1;
                            break;
                            case '➡️':
                                index += 1;
                            break;
                            case '⏩':
                                index = channelData.commands.length - 1;
                        }
                        //clamp index
                        index = Math.min(Math.max(index, 0), channelData.commands.length - 1);
                        if(index != channelData.index) {
                            channelData.index = index;
                            const footer = `${channelData.index + 1} / ${channelData.commands.length}`;
                            message.edit(this.generateCommandInfo(channelData.commands[index], bot, footer));
                        }
                    };
                    callBackFunc = async (messageSent) => {
                        try {
                            for(const react of reacts) {
                                await messageSent.react(react);
                            }
                            bot.interactableMessages.deleteMessage(message.channel.id, this.name);//delete old interactable message
                            bot.interactableMessages.setMessage(messageSent.channel.id, messageSent, this.name, messageInteractionFunction);
                        } catch(err) {
                            messageSent.delete(0);
                            bot.sendOutput(messageSent.channel, `An Error Occured. Please try again.`);
                            Logger.logMessage('ERROR', err);
                        }
                    };
                    const footer = `${defaultData.index + 1} / ${defaultData.commands.length}`;
                    response = this.generateCommandInfo(commands[0], bot, footer);
                } else {
                    let commandName = args[0].trim().toLowerCase();
                    response = this.generateCommandInfo(commandName, bot, `Use ${config.prefix}${this.name} to get a navigable command list`);
                }
                bot.sendOutput(message.channel, response, (typeof response == 'string' ? null : response), callBackFunc);
            }
        }
    ]
}