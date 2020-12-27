const config = require("../../docs/deploy/config.json");
const Utility = require("../helpers/utility");
const Logger = require("../helpers/logger");
const { logMessage } = require("../helpers/logger");

module.exports = {
    commands: [
        {
            get name() { return "notify";},
            description: "Tell the bot to PM a user either now or on a delay",
            get example() { return `${config.prefix}${this.name}, Fisherswamp#4306, Hey Itai! - Ben, 30 seconds`;},
            guildOnly: false,
            cooldown: 0,
            aliases: ["pm", "whisper", "tell"],
            method: async function(message, args, bot) {
                if(args.length < 2 || args.length > 3) {
                    bot.sendOutput(message.channel, `The ${this.name} command requires 2-3 arguments. You had ${args.length}`);
                    return;
                }
                const userName = args[0].trim();
                const userFound = bot.client.users.cache.find(user => user.tag === userName);
                if(userFound) {
                    if(!args[2]) {
                        bot.sendOutput(userFound, args[1]);
                    }
                    else {
                        const evaluation = Utility.parseHumanTime(args[2]);
                        if(evaluation.evaluatedMs <= 0) {
                            bot.sendOutput(message.channel, `I am unable to understand ${args[2]} as a time, or it is 0. Please enter a valid time longer than 0 seconds.`);
                            return;
                        }
                        setTimeout(() => bot.sendOutput(userFound, args[1]), evaluation.evaluatedMs);
                    }
                }
                else {
                    const promises = [];
                    bot.client.guilds.cache.forEach(guild => {
                        promises.push(guild.members.fetch());
                    });
                    await Promise.all(promises);
                    const userFindTryTwo = bot.client.users.cache.find(user => user.tag === userName);
                    if(userFindTryTwo) {
                        if(!args[2]) {
                            bot.sendOutput(userFindTryTwo, args[1]);
                        }
                        else {
                            const evaluation = Utility.parseHumanTime(args[2]);
                            if(evaluation.evaluatedMs <= 0) {
                                bot.sendOutput(message.channel, `I am unable to understand ${args[2]} as a time, or it is 0. Please enter a valid time longer than 0 seconds.`);
                                return;
                            }
                            setTimeout(() => bot.sendOutput(userFindTryTwo, args[1]), evaluation.evaluatedMs);
                        }
                    }
                    else {
                        bot.sendOutput(message.channel, `Could not find user ${userName}`);
                    }


                }
            },
        },
    ],
};