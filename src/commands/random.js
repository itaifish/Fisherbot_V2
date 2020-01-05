const config = require('../../docs/deploy/config.json');

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    commands: [
        {
            get name() { return  'roll'},
            fileAlias: 'random',
            description: "Rolls a die with x sides, default 20",
            get example() { return `${config.prefix}${this.name}${config.delimiter}17\n\t${config.prefix}${this.name}`},
            guildOnly: false,
            cooldown: 0.5,
            aliases: 'random',
            method: function (message, args, bot) {
                let numSides = 20;
                let output = '';
                if(args.length > 0) {
                   const argVal = parseInt(args[0]); 
                    if(!argVal || argVal <= 1) {
                        output += `Unable to read ${args[0]}, defaulting to 20\n`;
                    }else {
                        numSides = argVal;
                    }
                }
                const result = getRandomInt(1, numSides);
                output += `Rolled d${numSides}: I got ${result}`;
                bot.sendOutput(message.channel, output, true, this.name, 'Value determined by texting Ben and asking him');
            }
        },
        {
            get name() { return  'flip'},
            fileAlias: 'random',
            description: "Flips a coin",
            get example() { return `${config.prefix}${this.name}`},
            guildOnly: false,
            cooldown: 0.5,
            method: function (message, args, bot) {
                let result = 'Heads';
                if(Math.random() > 0.5) {
                    result = 'Tails';
                }
                bot.sendOutput(message.channel, result, true, this.name, 'Thankfully Max had a coin to borrow');
            }
        }
    ]
}