const config = require('../../docs/deploy/config.json');

module.exports = {
    commands: [
        {
            get name() { return  'ping'},
            description: "Pings the bot, checking if it is up",
            get example() { return `${config.prefix}${this.name}`},
            guildOnly: false,
            cooldown: config.defaultCooldown,
            method: function (message, args, bot) {
                const timeDifference = (Date.now() - message.createdAt);
                const sendString = config.botName + ' is up! Ping is ' + timeDifference + " ms";
                bot.sendOutput(message.channel, sendString, true, this.name);
            }
        }
    ]
}