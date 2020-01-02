const config = require('../../docs/deploy/config.json');

module.exports = {
    commands: [
        {
            name: 'ping',
            description: "Pings the bot, checking if it is up",
            method: (message, args, bot) => {
                const timeDifference = (Date.now() - message.createdAt);
                const sendString = config.botName + ' is up! Ping is ' + timeDifference + " ms";
                bot.sendOutput(message.channel, sendString, true, this.name);
            }
        }
    ]
}