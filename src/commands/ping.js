const config = require('../../docs/deploy/config.json');
const Discord = require('discord.js');

module.exports = {
    commands: [
        {
            get name() { return  'ping'},
            description: "Pings the bot, checking if it is up",
            get example() { return `${config.prefix}${this.name}`},
            guildOnly: false,
            cooldown: config.defaultCooldown,
            method: function (message, args, bot) {
                const title = this.name[0].toUpperCase() + this.name.slice(1);
                const timeDifference = (Date.now() - message.createdAt);
                const sendString = config.botName + ' is up! Ping is ' + timeDifference + " ms";
                const embedObj = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(title)
                    .setFooter(`Use ${config.prefix}help to see commands`)
                    .setDescription(sendString);
                bot.sendOutput(message.channel, sendString, embedObj);
            }
        }
    ]
}